import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/api';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    verifyEmail: (email: string, code: string) => Promise<void>;
    sendOTP: (email: string) => Promise<void>;
    verifyOTP: (email: string, otp: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const response = await authService.login({ email, password });
        setIsAuthenticated(true);
        return response;
    };

    const signup = async (name: string, email: string, password: string) => {
        return await authService.signup({ name, email, password });
    };

    const logout = () => {
        authService.logout();
        setIsAuthenticated(false);
    };

    const verifyEmail = async (email: string, verificationCode: string) => {
        return await authService.verifyEmail({ email, verificationCode });
    };

    const sendOTP = async (email: string) => {
        return await authService.sendOTP(email);
    };

    const verifyOTP = async (email: string, otp: string) => {
        return await authService.verifyOTP({ email, otp });
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isLoading,
                login,
                signup,
                logout,
                verifyEmail,
                sendOTP,
                verifyOTP,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
