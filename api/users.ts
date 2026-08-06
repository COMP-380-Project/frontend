import type {User} from "../src/types";
import {loadDb} from "./mockStore";

export const fetchUsers = async (): Promise<User[]> => {
    try {
        const db = await loadDb();
        return db.users.map(({id, name, email, role}) => ({id, name, email, role}));
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};