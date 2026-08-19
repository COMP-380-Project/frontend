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
            data.error ||
            `Movie ${movieId} not found`
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
            data.error ||
            "Failed to add seat to cart";

        const lowerMessage =
            message.toLowerCase();

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

        movieTitle:
            data.ticket.movie_title ?? null,

        showtime:
            data.ticket.showtime ?? null,
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
            data.error ||
            "Failed to load cart"
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

            movie_title: string | null;
            showtime: string | null;

        }): CartItem => ({

            id: ticket.id,

            showtimeId:
                ticket.showtime_id,

            seatId:
                ticket.seat_id,

            seatNumber:
                ticket.seat_number,

            ticketType:
                ticket.ticket_type,

            price:
                ticket.price,

            movieTitle:
                ticket.movie_title ?? null,

            showtime:
                ticket.showtime ?? null,
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
            data.error ||
            "Failed to remove seat"
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

        // Nullable because guest checkout
        // does not have a customer ID.
        customer_id: number | null;

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
            data.error ||
            "Failed to calculate checkout total"
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
            data.error ||
            "Payment failed"
        );
    }

    return data;
};


export const fetchMovieReports = async (
    customerId: number
): Promise<MovieReportRow[]> => {
    const response = await apiFetch(
        `/api/admin/reports?customer_id=${customerId}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to load reports");
    }

    return data.map(
        (row: {
            movie_id: number;
            movie_name: string;
            bookings: number;
            revenue: number;
        }): MovieReportRow => ({
            movieId: row.movie_id,
            movieName: row.movie_name,
            bookings: row.bookings,
            revenue: row.revenue,
        })
    );
};

export const fetchUserTickets = async (
    _userId: number | undefined
): Promise<MovieTicket[]> => {

    return [];
};


export const cancelMovieBooking = async (
    _ticketId: number
): Promise<void> => {

    throw new Error(
        "Cancel booking endpoint not connected yet"
    );
};



/* =========================================================
   GUEST CART
   ========================================================= */


const GUEST_CART_KEY = "guestCartId";


const createGuestCart = async (): Promise<number> => {

    const response = await apiFetch(
        "/api/cart/guest",
        {
            method: "POST",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error ||
            "Failed to start guest cart"
        );
    }

    localStorage.setItem(
        GUEST_CART_KEY,
        String(data.cart_id)
    );

    return data.cart_id;
};


const getOrCreateGuestCartId =
    async (): Promise<number> => {

        const existing =
            localStorage.getItem(
                GUEST_CART_KEY
            );

        if (existing) {
            return Number(existing);
        }

        return createGuestCart();
    };


export const hasGuestCart = (): boolean =>
    localStorage.getItem(
        GUEST_CART_KEY
    ) !== null;


export const addSeatToGuestCart = async (
    showtimeId: number,
    seatId: number
): Promise<CartItem> => {

    let cartId =
        await getOrCreateGuestCartId();


    const attemptAdd = (id: number) =>
        apiFetch(
            `/api/cart/by-id/${id}/add-seat`,
            {
                method: "POST",

                body: JSON.stringify({
                    showtime_id: showtimeId,
                    seat_id: seatId,
                    ticket_type: "adult",
                }),
            }
        );


    let response =
        await attemptAdd(cartId);


    // Cached cart disappeared after a DB reset.
    if (response.status === 404) {

        localStorage.removeItem(
            GUEST_CART_KEY
        );

        cartId =
            await createGuestCart();

        response =
            await attemptAdd(cartId);
    }


    const data =
        await response.json();


    if (!response.ok) {

        const message =
            data.error ||
            "Failed to add seat to cart";

        const lowerMessage =
            message.toLowerCase();

        if (
            lowerMessage.includes(
                "already booked"
            ) ||
            lowerMessage.includes(
                "already locked"
            )
        ) {
            throw new Error(
                "Seat no longer available. Please choose another seat."
            );
        }

        throw new Error(message);
    }


    return {

        id:
            data.ticket.id,

        showtimeId,

        seatId,

        seatNumber:
            data.ticket.seat_number,

        ticketType:
            data.ticket.ticket_type,

        price:
            data.ticket.price,

        movieTitle:
            data.ticket.movie_title ?? null,

        showtime:
            data.ticket.showtime ?? null,
    };
};


export const fetchGuestCart =
    async (): Promise<CartItem[]> => {

        const cartId =
            localStorage.getItem(
                GUEST_CART_KEY
            );


        if (!cartId) {
            return [];
        }


        const response =
            await apiFetch(
                `/api/cart/by-id/${cartId}`
            );


        // Stale cart from before a DB reset.
        if (response.status === 404) {

            localStorage.removeItem(
                GUEST_CART_KEY
            );

            return [];
        }


        const data =
            await response.json();


        if (!response.ok) {
            throw new Error(
                data.error ||
                "Failed to load cart"
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

                movie_title: string | null;

                showtime: string | null;

            }): CartItem => ({

                id:
                    ticket.id,

                showtimeId:
                    ticket.showtime_id,

                seatId:
                    ticket.seat_id,

                seatNumber:
                    ticket.seat_number,

                ticketType:
                    ticket.ticket_type,

                price:
                    ticket.price,

                movieTitle:
                    ticket.movie_title ?? null,

                showtime:
                    ticket.showtime ?? null,
            })
        );
    };


export const removeSeatFromGuestCart =
    async (
        ticketId: number
    ): Promise<void> => {

        const cartId =
            localStorage.getItem(
                GUEST_CART_KEY
            );


        if (!cartId) {
            throw new Error(
                "No active guest cart"
            );
        }


        const response =
            await apiFetch(
                `/api/cart/by-id/${cartId}/remove-seat`,
                {
                    method: "DELETE",

                    body: JSON.stringify({
                        ticket_id: ticketId,
                    }),
                }
            );


        const data =
            await response.json();


        if (!response.ok) {
            throw new Error(
                data.error ||
                "Failed to remove seat"
            );
        }
    };


export const fetchGuestCheckoutTotal =
    async (): Promise<CheckoutTotal> => {

        const cartId =
            localStorage.getItem(
                GUEST_CART_KEY
            );


        if (!cartId) {
            throw new Error(
                "Your cart could not be found. Please go back and add your seats again."
            );
        }


        const response =
            await apiFetch(
                `/api/cart/by-id/${cartId}/calculate-total`
            );


        if (response.status === 404) {

            localStorage.removeItem(
                GUEST_CART_KEY
            );

            throw new Error(
                "Your cart could not be found. Please go back and add your seats again."
            );
        }


        const data =
            await response.json();


        if (!response.ok) {
            throw new Error(
                data.error ||
                "Failed to calculate checkout total"
            );
        }


        return data;
    };


export interface GuestInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}


export interface GuestCheckoutResult
    extends CheckoutResult {

    guestInfo: GuestInfo;
}


export const checkoutGuestCart = async (
    amount: number,
    guestInfo: GuestInfo
): Promise<GuestCheckoutResult> => {

    const cartId =
        localStorage.getItem(
            GUEST_CART_KEY
        );


    if (!cartId) {
        throw new Error(
            "Your cart could not be found. Please go back and add your seats again."
        );
    }


    const response =
        await apiFetch(
            "/api/payment/checkout",
            {
                method: "POST",

                body: JSON.stringify({

                    cart_id:
                        Number(cartId),

                    amount,

                    payment_method:
                        "Credit Card",
                }),
            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        if (
            response.status === 404
        ) {
            localStorage.removeItem(
                GUEST_CART_KEY
            );
        }

        throw new Error(
            data.error ||
            "Payment failed"
        );
    }


    localStorage.removeItem(
        GUEST_CART_KEY
    );


    return {
        ...data,
        guestInfo,
    };
};