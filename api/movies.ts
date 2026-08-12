import type {
    CartItem,
    MovieData,
    MovieReportRow,
    MovieTicket,
    SeatData
} from "../src/types";

import {apiFetch} from "./api";


interface BackendShowtime {
    id: number;
    auditorium_id: number;
    showtime: string;
    price: number;
}

interface BackendMovie {
    id: number;
    title: string;
    description: string;
    genre?: string;
    duration?: number;
    rating?: number;
    cast?: string;
    showtimes?: BackendShowtime[];
}


const mapMovie = (movie: BackendMovie): MovieData => ({
    id: movie.id,
    name: movie.title,
    description: movie.description,
    genre: movie.genre,
    durationMinutes: movie.duration,
    rating:
        movie.rating !== undefined
            ? String(movie.rating)
            : undefined,
    cast: movie.cast,
    showtimes: (movie.showtimes ?? []).map(showtime => ({
        id: showtime.id,
        auditoriumId: showtime.auditorium_id,
        time: showtime.showtime,
        price: showtime.price,
    })),
});


export const fetchMovies = async (
    query = ""
): Promise<MovieData[]> => {
    const url = query.trim()
        ? `/api/events/search?title=${encodeURIComponent(query.trim())}`
        : "/api/events";

    const response = await apiFetch(url);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || "Failed to load movies"
        );
    }

    return (data as BackendMovie[]).map(mapMovie);
};


export const fetchMovieById = async (
    movieId: number
): Promise<MovieData> => {
    const response = await apiFetch(
        `/api/events/${movieId}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || `Movie ${movieId} not found`
        );
    }

    return mapMovie(data as BackendMovie);
};


export const fetchShowtimeSeats = async (
    showtimeId: number
): Promise<SeatData[]> => {
    const response = await apiFetch(
        `/api/seats/showtime/${showtimeId}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || "Failed to load seats"
        );
    }

    return data.seats.map(
        (seat: {
            id: number;
            seat_number: string;
            is_booked: boolean;
            is_locked: boolean;
            lock_expires_at: string | null;
            status: "available" | "locked" | "booked";
        }): SeatData => ({
            id: seat.id,
            seatNumber: seat.seat_number,
            isBooked: seat.is_booked,
            isLocked: seat.is_locked,
            lockExpiresAt: seat.lock_expires_at,
            status: seat.status,
        })
    );
};


export const addSeatToCart = async (
    userId: number,
    showtimeId: number,
    seatId: number
): Promise<CartItem> => {
    const response = await apiFetch(
        `/api/cart/${userId}/add-seat`,
        {
            method: "POST",
            body: JSON.stringify({
                showtime_id: showtimeId,
                seat_id: seatId,
                ticket_type: "adult",
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        const message =
            data.error || "Failed to add seat to cart";

        const lowerMessage = message.toLowerCase();

        if (
            lowerMessage.includes("already booked") ||
            lowerMessage.includes("already locked")
        ) {
            throw new Error(
                "Seat no longer available. Please choose another seat."
            );
        }

        throw new Error(message);
    }

    return {
        id: data.ticket.id,
        showtimeId,
        seatId,
        seatNumber: data.ticket.seat_number,
        ticketType: data.ticket.ticket_type,
        price: data.ticket.price,
    };
};


export const fetchMovieCart = async (
    userId: number | undefined
): Promise<CartItem[]> => {
    if (!userId) {
        return [];
    }

    const response = await apiFetch(
        `/api/cart/${userId}`
    );

    if (response.status === 404) {
        return [];
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || "Failed to load cart"
        );
    }

    return data.tickets.map(
        (ticket: {
            id: number;
            showtime_id: number;
            seat_id: number;
            seat_number: string;
            ticket_type: string;
            price: number;
        }): CartItem => ({
            id: ticket.id,
            showtimeId: ticket.showtime_id,
            seatId: ticket.seat_id,
            seatNumber: ticket.seat_number,
            ticketType: ticket.ticket_type,
            price: ticket.price,
        })
    );
};


export const removeMovieFromCart = async (
    userId: number,
    ticketId: number
): Promise<void> => {
    const response = await apiFetch(
        `/api/cart/${userId}/remove-seat`,
        {
            method: "DELETE",
            body: JSON.stringify({
                ticket_id: ticketId,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || "Failed to remove seat"
        );
    }
};
export interface CheckoutTotal {
    subtotal: number;
    tax: number;
    fees: number;
    total: number;
}

export interface CheckoutResult {
    message: string;

    order: {
        id: number;
        customer_id: number;
        total_amount: number;
        order_status: string;
        created_at: string;
    };

    payment: {
        id: number;
        amount: number;
        payment_status: string;
        receipt: unknown;
    };

    tickets: {
        id: number;
        seat_number: string;
        ticket_type: string;
        price: number;
    }[];
}

export const fetchCheckoutTotal = async (
    userId: number
): Promise<CheckoutTotal> => {

    const response = await apiFetch(
        `/api/cart/${userId}/calculate-total`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || "Failed to calculate checkout total"
        );
    }

    return data;
};

export const checkoutCart = async (
    userId: number,
    amount: number
): Promise<CheckoutResult> => {

    const response = await apiFetch(
        "/api/payment/checkout",
        {
            method: "POST",

            body: JSON.stringify({
                customer_id: userId,
                amount,
                payment_method: "Credit Card",
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || "Payment failed"
        );
    }

    return data;
};
export const fetchMovieReports = async (): Promise<MovieReportRow[]> => {
    return [];
};
export const fetchUserTickets = async (
    _userId: number | undefined
): Promise<MovieTicket[]> => {
    return [];
};

export const cancelMovieBooking = async (
    _ticketId: number
): Promise<void> => {
    throw new Error("Cancel booking endpoint not connected yet");
};