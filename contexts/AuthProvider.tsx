import { useEffect, useState, type ReactNode } from "react";
import type { AuthUser } from "../src/types";
import { AuthContext } from "./AuthContext";

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [auth, setAuth] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAuthUser = () => {
            const savedUser = localStorage.getItem("auth");
            if (savedUser) {
                try {
                    setAuth(JSON.parse(savedUser));
                } catch (error) {
                    console.error("Error parsing saved user:", error);
                    localStorage.removeItem("auth");
                }
            }

            setLoading(false);
        };

        loadAuthUser();
    }, []);

    const login = (userData: AuthUser) => {
        setAuth(userData);
        localStorage.setItem("auth", JSON.stringify(userData));
    };

    const logout = () => {
        setAuth(null);
        localStorage.removeItem("auth");
    };

    if (loading) {
        return null;
    }

    const value = {
        auth,
        login,
        logout,
        isAuthenticated: !!auth,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};