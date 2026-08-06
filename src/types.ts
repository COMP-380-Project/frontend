export interface AuthUser {
    userId: number;
    token: string;
    name?: string;
    role?: "customer" | "manager";
}

export interface User {
    id: number;
    name: string;
    email: string;
    role?: "customer" | "manager";
}

export interface MovieData {
    id: number;
    name: string;
    description: string;
    date: string;
    location: string;
    ownerId: number;
    posterUrl?: string;
    genre?: string;
    durationMinutes?: number;
    rating?: string;
    language?: string;
    price?: number;
}

export interface MovieTicket {
    ticketId: number;
    movieId: number;
    seatNumber: string;
    bookedAt: string;
    confirmationSentAt?: string;
    customerEmail?: string;
    status?: "confirmed" | "cancelled";
    movie: MovieData;
}

export interface CartItem {
    id: number;
    movieId: number;
    userId: number;
    seatNumber: string;
    selectedAt: string;
    movie: MovieData;
}

export interface MovieReportRow {
    movieId: number;
    movieName: string;
    bookings: number;
    revenue: number;
}