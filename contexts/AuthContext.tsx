import { createContext, useContext } from 'react';
import type { AuthUser } from '../src/types';

interface AuthContextType {
    auth: AuthUser | null;
    login: (user: AuthUser) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};