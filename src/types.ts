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

export interface Showtime {
    id: number;
    auditoriumId: number;
    time: string;
    price: number;
}

export interface MovieData {
    id: number;
    name: string;
    description: string;
    genre?: string;
    durationMinutes?: number;
    rating?: string;
    language?: string;
    posterUrl?: string;
    cast?: string;
    showtimes: Showtime[];
}

export interface MovieTicket {
    ticketId: number;
    movieId: number;
    showtimeId: number;
    seatNumber: string;
    bookedAt: string;
    confirmationSentAt?: string;
    customerEmail?: string;
    status?: "confirmed" | "cancelled";
    movie: MovieData;
}

export interface SeatData {
    id: number;
    seatNumber: string;
    isBooked: boolean;
    isLocked: boolean;
    lockExpiresAt: string | null;
    status: "available" | "locked" | "booked";
}

export interface CartItem {
    id: number;
    showtimeId: number;
    seatId: number;
    seatNumber: string;
    ticketType: string;
    price: number;
    movieTitle: string | null;
    showtime: string | null;
}

export interface MovieReportRow {
    movieId: number;
    movieName: string;
    bookings: number;
    revenue: number;
}