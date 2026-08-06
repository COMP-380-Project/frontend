import type {CartItem, MovieData, User} from "../src/types";

export interface BookingRecord {
    id: number;
    movieId: number;
    userId: number;
    seatNumber: string;
    bookedAt: string;
    confirmationSentAt?: string;
    customerEmail?: string;
    status?: "confirmed" | "cancelled";
}

export interface MockUserRecord extends User {
    password: string;
}

interface MockDb {
    movies: MovieData[];
    users: MockUserRecord[];
    bookings: BookingRecord[];
    cartItems: CartItem[];
}

const STORAGE_KEY = "movie-booking-mock-db-v1";

let dbCache: MockDb | null = null;

const cloneDb = (db: MockDb): MockDb => ({
    movies: db.movies.map(movie => ({...movie})),
    users: db.users.map(user => ({...user})),
    bookings: db.bookings.map(booking => ({...booking})),
    cartItems: db.cartItems.map(item => ({...item, movie: {...item.movie}})),
});

const isValidDb = (value: unknown): value is MockDb => {
    if (!value || typeof value !== "object") {
        return false;
    }

    const candidate = value as Partial<MockDb>;
    return (
        Array.isArray(candidate.movies) &&
        Array.isArray(candidate.users) &&
        Array.isArray(candidate.bookings) &&
        Array.isArray(candidate.cartItems)
    );
};

const fetchSeedData = async (): Promise<MockDb> => {
    const [moviesResponse, usersResponse, bookingsResponse] = await Promise.all([
        window.fetch("/mock/movies.json"),
        window.fetch("/mock/users.json"),
        window.fetch("/mock/bookings.json"),
    ]);

    if (!moviesResponse.ok || !usersResponse.ok || !bookingsResponse.ok) {
        throw new Error("Failed to load mock seed data");
    }

    const [movies, users, bookings] = await Promise.all([
        moviesResponse.json() as Promise<MovieData[]>,
        usersResponse.json() as Promise<MockUserRecord[]>,
        bookingsResponse.json() as Promise<BookingRecord[]>,
    ]);

    return {movies, users, bookings, cartItems: []};
};

const normalizeDb = (db: MockDb): MockDb => {
    const fallbackRows = ["A", "B", "C", "D", "E", "F", "G"];
    let fallbackSeatIndex = 1;

    const normalizedBookings = db.bookings.map(attendee => {
        const row = fallbackRows[(fallbackSeatIndex - 1) % fallbackRows.length];
        const number = ((fallbackSeatIndex - 1) % 12) + 1;
        const generatedSeat = `${row}${number}`;
        fallbackSeatIndex += 1;

        return {
            ...attendee,
            seatNumber: attendee.seatNumber || generatedSeat,
            bookedAt: attendee.bookedAt || new Date().toISOString(),
            status: attendee.status || "confirmed",
        };
    });

    return {
        movies: db.movies,
        users: db.users,
        bookings: normalizedBookings,
        cartItems: db.cartItems ?? [],
    };
};

const migrateLegacyDb = (value: unknown): MockDb | null => {
    if (!value || typeof value !== "object") {
        return null;
    }

    const candidate = value as {
        events?: MovieData[];
        users?: MockUserRecord[];
        attendees?: Array<{
            id: number;
            eventId: number;
            userId: number;
            seatNumber?: string;
            bookedAt?: string;
            confirmationSentAt?: string;
            customerEmail?: string;
            status?: "confirmed" | "cancelled";
        }>;
    };

    if (!Array.isArray(candidate.events) || !Array.isArray(candidate.users) || !Array.isArray(candidate.attendees)) {
        return null;
    }

    return {
        movies: candidate.events,
        users: candidate.users,
        bookings: candidate.attendees.map(attendee => ({
            id: attendee.id,
            movieId: attendee.eventId,
            userId: attendee.userId,
            seatNumber: attendee.seatNumber || "A1",
            bookedAt: attendee.bookedAt || new Date().toISOString(),
            confirmationSentAt: attendee.confirmationSentAt,
            customerEmail: attendee.customerEmail,
            status: attendee.status || "confirmed",
        })),
        cartItems: [],
    };
};

export const loadDb = async (): Promise<MockDb> => {
    if (dbCache) {
        return cloneDb(dbCache);
    }

    const rawDb = localStorage.getItem(STORAGE_KEY);
    if (rawDb) {
        try {
            const parsed = JSON.parse(rawDb) as unknown;
            if (isValidDb(parsed)) {
                dbCache = normalizeDb(parsed);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(dbCache));
                return cloneDb(dbCache);
            }
            const migrated = migrateLegacyDb(parsed);
            if (migrated) {
                dbCache = normalizeDb(migrated);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(dbCache));
                return cloneDb(dbCache);
            }
        } catch (error) {
            console.warn("Invalid mock database in localStorage. Re-seeding.", error);
        }
    }

    const seededDb = normalizeDb(await fetchSeedData());
    dbCache = seededDb;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seededDb));
    return cloneDb(seededDb);
};

export const saveDb = (db: MockDb): void => {
    dbCache = cloneDb(db);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dbCache));
};

export const getNextId = (items: Array<{id: number}>): number => {
    if (items.length === 0) {
        return 1;
    }

    return Math.max(...items.map(item => item.id)) + 1;
};

export type {CartItem, MovieData};
