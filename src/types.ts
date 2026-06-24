export interface AuthUser {
    userId: number;
    token: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface EventData {
    id: number;
    name: string;
    description: string;
    date: string;
    location: string;
    ownerId: number;
}