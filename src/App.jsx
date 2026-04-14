import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/index.css';
import './styles/App.css';
import Login from './pages/visitor/Login';
import Register from './pages/visitor/Register';
import Search from './pages/visitor/Search';
import LandingPage from './pages/visitor/LandingPage';
import CustomerLayout from './components/customer/CustomerLayout';
import Dashboard from './pages/customer/Dashboard';
import MyDevices from './pages/customer/MyDevices';
import SavedShops from './pages/customer/SavedShops';
import Profile from './pages/customer/Profile';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/search" element={<Search />} />

                {/* Customer Routes */}
                <Route element={<CustomerLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/devices" element={<MyDevices />} />
                    <Route path="/saved" element={<SavedShops />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
