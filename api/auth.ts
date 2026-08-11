import type {AuthUser, User} from "../src/types";
import {apiFetch} from "./api";

export const register = async (
    name: string,
    email: string,
    password: string
): Promise<User | null> => {
    try {
        const response = await apiFetch("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({
                name,
                email,
                password,
            }),
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        return {
            id: data.customer.id,
            name: data.customer.name,
            email: data.customer.email,
            role: data.customer.role,
        };
    } catch (error) {
        console.error("Registration error:", error);
        return null;
    }
};

export const login = async (
    email: string,
    password: string
): Promise<AuthUser | null> => {
    try {
        const response = await apiFetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({
                email,
                password,
            }),
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        return {
            userId: data.auth.userId,
            token: data.token,
            name: data.auth.name,
            role: data.auth.role,
        };
    } catch (error) {
        console.error("Login error:", error);
        return null;
    }
};