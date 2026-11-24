import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/index.css';
import './styles/App.css';
import Login from './pages/visitor/Login/Login';
import Register from './pages/visitor/Register/Register';
import Search from './pages/common/Search/Search';
import LandingPage from './pages/visitor/LandingPage/LandingPage';
import ShopPublicProfile from './pages/common/ShopPublicProfile/ShopPublicProfile';
import ForgotPassword from './pages/visitor/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/visitor/ResetPassword/ResetPassword';
import CustomerLayout from './components/customer/CustomerLayout/CustomerLayout';
import Dashboard from './pages/customer/Dashboard/Dashboard';
import MyDevices from './pages/customer/MyDevices/MyDevices';
import SavedShops from './pages/customer/SavedShops/SavedShops';
import Profile from './pages/customer/Profile/Profile';
import SendRequest from './pages/customer/SendRequest/SendRequest';
import LeaveReview from './pages/customer/LeaveReview/LeaveReview';
import ReviewHistory from './pages/customer/ReviewHistory/ReviewHistory';

// Shop Pages
import ShopLayout from './components/shop/common/ShopLayout/ShopLayout';
import ServiceRequests from './pages/shop/ServiceRequests/ServiceRequests';
import ActiveTasks from './pages/shop/ActiveTasks/ActiveTasks';
import CustomerReviews from './pages/shop/CustomerReviews/CustomerReviews';
import ShopProfile from './pages/shop/ShopProfile/ShopProfile';
import Settings from './pages/shop/Settings/Settings';
import DeleteAccountPage from './pages/shop/DeleteAccount/DeleteAccount';

function App() {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';

    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/search" element={<Search />} />
                <Route path="/shop-profile/:id" element={<ShopPublicProfile />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />

                {/* Customer Routes */}
                <Route element={<CustomerLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/devices" element={<MyDevices />} />
                    <Route path="/saved" element={<SavedShops />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/shop/:id/request" element={<SendRequest />} />
                    <Route path="/repair/:repairId/review" element={<LeaveReview />} />
                    <Route path="/reviews" element={<ReviewHistory />} />
                    <Route path="/delete-account" element={<DeleteAccountPage />} />
                </Route>

                {/* Shop Routes */}
                <Route element={<ShopLayout />}>
                    <Route path="/shop/requests" element={<ServiceRequests />} />
                    <Route path="/shop/tasks" element={<ActiveTasks />} />
                    <Route path="/shop/reviews" element={<CustomerReviews />} />
                    <Route path="/shop/profile" element={<ShopProfile />} />
                    <Route path="/shop/settings" element={<Settings />} />
                    <Route path="/shop/delete-account" element={<DeleteAccountPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
