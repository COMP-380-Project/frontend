import type {User} from "../src/types";
import {API_BASE_URL, apiFetch} from "./api";

export const fetchUsers = async (): Promise<User[]> => {
    try {
        const response = await apiFetch(`${API_BASE_URL}/v1/users`);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};