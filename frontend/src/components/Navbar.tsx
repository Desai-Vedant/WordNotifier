import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="navbar-brand">
                    <h1>Word Notifier</h1>
                </div>
                <div className="nav-controls">
                    {isAuthenticated ? (
                        <button
                            onClick={handleLogout}
                            className="logout-button"
                            aria-label="Logout"
                        >
                            <i className="fas fa-sign-out-alt"></i>
                        </button>
                    ) : (
                        <div className="auth-buttons">
                            <button
                                onClick={() => navigate('/login')}
                                className="login-button"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate('/signup')}
                                className="signup-button"
                            >
                                Sign Up
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
