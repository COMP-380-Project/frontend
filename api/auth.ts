import type {AuthUser, User} from "../src/types";
import {getNextId, loadDb, saveDb} from "./mockStore";

export const register = async (
    name: string,
    email: string,
    password: string
): Promise<User | null> => {
    try {
        const db = await loadDb();
        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = db.users.find(
            user => user.email.trim().toLowerCase() === normalizedEmail
        );

        if (existingUser) {
            return null;
        }

        const newUser = {
            id: getNextId(db.users),
            name: name.trim(),
            email: normalizedEmail,
            password,
            role: "customer" as const,
        };

        db.users.push(newUser);
        saveDb(db);

        return {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        };
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
        const db = await loadDb();
        const normalizedEmail = email.trim().toLowerCase();
        const user = db.users.find(
            candidate =>
                candidate.email.trim().toLowerCase() === normalizedEmail &&
                candidate.password === password
        );

        if (!user) {
            return null;
        }

        return {
            userId: user.id,
            token: `mock-token-${user.id}`,
            name: user.name,
            role: user.role,
        };
    } catch (error ) {
        console.error("Login error:", error);
        return null;
    }
};