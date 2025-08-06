import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [showVerification, setShowVerification] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { signup, verifyEmail } = useAuth();
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await signup(name, email, password);
            toast.success('Please check your email for verification code');
            setShowVerification(true);
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Signup failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerification = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await verifyEmail(email, verificationCode);
            toast.success('Email verified successfully!');
            navigate('/login');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Sign Up</h2>
            {!showVerification ? (
                <form onSubmit={handleSignup}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>
                    <button type="submit" className="btn" disabled={isLoading}>
                        {isLoading ? 'Loading...' : 'Sign Up'}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleVerification}>
                    <div className="form-group">
                        <label htmlFor="verificationCode">Verification Code</label>
                        <input
                            type="text"
                            id="verificationCode"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn" disabled={isLoading}>
                        {isLoading ? 'Loading...' : 'Verify Email'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default Signup;
