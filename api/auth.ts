import type {AuthUser, User} from "../src/types";
import {API_BASE_URL, apiFetch} from "./api";

export const register = async (
    name: string,
    email: string,
    password: string
): Promise<User | null> => {
    try {
        const response = await apiFetch(`${API_BASE_URL}/v1/auth/register`,{ method: "POST",
         body: JSON.stringify({name, email, password }),
        }); 
    
    if (!response.ok) {
        return null;
    }
    
    return await response.json();
    } catch (error ) {
        console.error("Registration error:", error);
        return null;
    }
};

export const login = async (
    email: string,
    password: string
): Promise<AuthUser | null> => {
    try {
        const response = await apiFetch(`${API_BASE_URL}/v1/auth/login`, {
         method: "POST",
         body: JSON.stringify({ email, password }),
        });
    
    if (!response.ok) {
        return null;
    }
    
    return await response.json();
    } catch (error ) {
        console.error("Registration error:", error);
        return null;
    }
};