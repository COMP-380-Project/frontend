import type {CartItem, MovieData, MovieReportRow, MovieTicket} from "../src/types";
import {getNextId, loadDb, saveDb} from "./mockStore";

const mapBookingToTicket = (dbMovie: MovieData, booking: {id: number; movieId: number; userId: number; seatNumber: string; bookedAt: string; confirmationSentAt?: string; customerEmail?: string; status?: "confirmed" | "cancelled";}): MovieTicket => ({
    ticketId: booking.id,
    movieId: booking.movieId,
    seatNumber: booking.seatNumber,
    bookedAt: booking.bookedAt,
    confirmationSentAt: booking.confirmationSentAt,
    customerEmail: booking.customerEmail,
    status: booking.status,
    movie: dbMovie,
});

export const fetchMovies = async (query = ""): Promise<MovieData[]> => {
    const db = await loadDb();
    const upcomingMovies = db.movies.filter(movie => new Date(movie.date) >= new Date());
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
        return upcomingMovies.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    return upcomingMovies.filter(movie =>
        [movie.name, movie.genre, movie.language, movie.location, movie.description]
            .filter(Boolean)
            .some(value => value!.toLowerCase().includes(normalizedQuery))
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const fetchMovieById = async (movieId: number): Promise<MovieData> => {
    const db = await loadDb();
    const movie = db.movies.find(candidate => candidate.id === movieId);
    if (!movie) {
        throw new Error(`Movie ${movieId} not found`);
    }
    return movie;
};

export const fetchBookedSeats = async (movieId: number): Promise<string[]> => {
    const db = await loadDb();
    return db.bookings
        .filter(booking => booking.movieId === movieId && booking.status !== "cancelled")
        .map(booking => booking.seatNumber);
};

export const fetchUserTickets = async (userId: number | undefined): Promise<MovieTicket[]> => {
    if (!userId) {
        return [];
    }

    const db = await loadDb();
    return db.bookings
        .filter(booking => booking.userId === userId && booking.status !== "cancelled")
        .map(booking => {
            const movie = db.movies.find(candidate => candidate.id === booking.movieId);
            return movie ? mapBookingToTicket(movie, booking) : null;
        })
        .filter((ticket): ticket is MovieTicket => ticket !== null)
        .sort((a, b) => new Date(a.movie.date).getTime() - new Date(b.movie.date).getTime());
};

export const fetchBooking = async (movieId: number, userId: number | undefined): Promise<MovieTicket | null> => {
    if (!userId) {
        return null;
    }

    const db = await loadDb();
    const booking = db.bookings.find(candidate => candidate.movieId === movieId && candidate.userId === userId && candidate.status !== "cancelled");
    if (!booking) {
        return null;
    }

    const movie = db.movies.find(candidate => candidate.id === movieId);
    return movie ? mapBookingToTicket(movie, booking) : null;
};

export const fetchMovieCart = async (userId: number | undefined): Promise<CartItem[]> => {
    if (!userId) {
        return [];
    }

    const db = await loadDb();
    return db.cartItems
        .filter(item => item.userId === userId)
        .map(item => ({...item, movie: {...item.movie}}));
};

export const addMovieToCart = async (movieId: number, userId: number, seatNumber: string): Promise<CartItem> => {
    const normalizedSeat = seatNumber.trim().toUpperCase();
    if (!normalizedSeat) {
        throw new Error("Seat is required");
    }

    const db = await loadDb();
    const movie = db.movies.find(candidate => candidate.id === movieId);
    if (!movie) {
        throw new Error(`Movie ${movieId} not found`);
    }

    const seatTaken = db.bookings.some(booking => booking.movieId === movieId && booking.seatNumber === normalizedSeat && booking.status !== "cancelled") ||
        db.cartItems.some(item => item.movieId === movieId && item.seatNumber === normalizedSeat);
    if (seatTaken) {
        throw new Error("This seat is already reserved");
    }

    const cartItem = {
        id: getNextId(db.cartItems),
        movieId,
        userId,
        seatNumber: normalizedSeat,
        selectedAt: new Date().toISOString(),
        movie,
    } satisfies CartItem;

    db.cartItems.push(cartItem);
    saveDb(db);
    return cartItem;
};

export const removeMovieFromCart = async (cartItemId: number): Promise<void> => {
    const db = await loadDb();
    db.cartItems = db.cartItems.filter(item => item.id !== cartItemId);
    saveDb(db);
};

export const bookMoviesFromCart = async (userId: number): Promise<MovieTicket[]> => {
    const db = await loadDb();
    const userCart = db.cartItems.filter(item => item.userId === userId);
    const user = db.users.find(candidate => candidate.id === userId);

    const confirmedTickets: MovieTicket[] = [];

    for (const item of userCart) {
        const existingBooking = db.bookings.find(booking => booking.movieId === item.movieId && booking.userId === userId && booking.status !== "cancelled");
        if (existingBooking) {
            existingBooking.seatNumber = item.seatNumber;
            existingBooking.bookedAt = new Date().toISOString();
            existingBooking.status = "confirmed";
            existingBooking.confirmationSentAt = new Date().toISOString();
            existingBooking.customerEmail = user?.email;
            const movie = db.movies.find(candidate => candidate.id === item.movieId);
            if (movie) {
                confirmedTickets.push(mapBookingToTicket(movie, existingBooking));
            }
            continue;
        }

        const booking = {
            id: getNextId(db.bookings),
            movieId: item.movieId,
            userId,
            seatNumber: item.seatNumber,
            bookedAt: new Date().toISOString(),
            confirmationSentAt: new Date().toISOString(),
            customerEmail: user?.email,
            status: "confirmed" as const,
        };
        db.bookings.push(booking);
        const movie = db.movies.find(candidate => candidate.id === item.movieId);
        if (movie) {
            confirmedTickets.push(mapBookingToTicket(movie, booking));
        }
    }

    db.cartItems = db.cartItems.filter(item => item.userId !== userId);
    saveDb(db);
    return confirmedTickets;
};

export const cancelMovieBooking = async (ticketId: number): Promise<void> => {
    const db = await loadDb();
    const booking = db.bookings.find(item => item.id === ticketId);
    if (!booking) {
        throw new Error(`Booking ${ticketId} not found`);
    }
    booking.status = "cancelled";
    saveDb(db);
};

export const fetchMovieReports = async (): Promise<MovieReportRow[]> => {
    const db = await loadDb();
    return db.movies.map(movie => {
        const activeBookings = db.bookings.filter(booking => booking.movieId === movie.id && booking.status !== "cancelled");
        return {
            movieId: movie.id,
            movieName: movie.name,
            bookings: activeBookings.length,
            revenue: activeBookings.length * (movie.price ?? 12.99),
        };
    }).sort((a, b) => b.bookings - a.bookings);
};

export const seedConfirmationEmail = async (ticketId: number): Promise<MovieTicket> => {
    const db = await loadDb();
    const booking = db.bookings.find(item => item.id === ticketId);
    if (!booking) {
        throw new Error(`Booking ${ticketId} not found`);
    }

    booking.confirmationSentAt = new Date().toISOString();
    const movie = db.movies.find(candidate => candidate.id === booking.movieId);
    saveDb(db);

    if (!movie) {
        throw new Error(`Movie ${booking.movieId} not found`);
    }

    return mapBookingToTicket(movie, booking);
};
