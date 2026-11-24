import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// ─── Token helpers ────────────────────────────────────────────────────────────

const getAccessToken = () => sessionStorage.getItem('access_token');
const getRefreshToken = () => sessionStorage.getItem('refresh_token');

const saveTokens = (access, refresh) => {
    sessionStorage.setItem('access_token', access);
    if (refresh) sessionStorage.setItem('refresh_token', refresh);
    sessionStorage.setItem('isAuthenticated', 'true');
    window.dispatchEvent(new Event('auth-changed'));
};

const clearTokens = () => {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userData');
    window.dispatchEvent(new Event('auth-changed'));
};

// ─── Refresh queue ────────────────────────────────────────────────────────────
// Prevents multiple simultaneous 401s from each triggering their own refresh.
// All failed requests wait in this queue until one refresh resolves/rejects them all.

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve(token);
    });
    failedQueue = [];
};

// ─── Request interceptor ──────────────────────────────────────────────────────
// Attach the access token to every outgoing request.

api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ─── Response interceptor ─────────────────────────────────────────────────────
// On 401: try to refresh the access token silently, then retry the request.
// If the refresh itself fails, clear everything and redirect to /login.

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Only handle 401s that haven't been retried yet
        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        const refresh = getRefreshToken();

        // No refresh token available → log out immediately
        if (!refresh) {
            clearTokens();
            window.location.href = '/login';
            return Promise.reject(error);
        }

        // If a refresh is already in progress, queue this request
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then((newAccessToken) => {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                })
                .catch((err) => Promise.reject(err));
        }

        // Start the refresh
        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const { data } = await axios.post(
                'http://127.0.0.1:8000/api/token/refresh/',
                { refresh },
                { headers: { 'Content-Type': 'application/json' } }
            );

            const newAccessToken = data.access;
            saveTokens(newAccessToken, data.refresh); // some backends also rotate the refresh token

            // Update the Authorization header for the default instance too
            api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

            processQueue(null, newAccessToken);

            // Retry the original failed request with the new token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);

        } catch (refreshError) {
            // Refresh failed (token expired or revoked) → force logout
            processQueue(refreshError, null);
            clearTokens();
            window.location.href = '/login';
            return Promise.reject(refreshError);

        } finally {
            isRefreshing = false;
        }
    }
);

export { saveTokens, clearTokens };
export default api;