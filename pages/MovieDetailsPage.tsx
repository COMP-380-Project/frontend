import {useCallback, useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import {CalendarIcon, Clock3Icon, MapPinIcon, TicketIcon} from "lucide-react";
import {Button} from "../components/Button";
import {LoadingMessage} from "../components/LoadingMessage";
import {ErrorMessage} from "../components/ErrorMessage";
import {useAuth} from "../contexts/AuthContext";
import {useAsync} from "../hooks/useAsync";
import {useFetch} from "../hooks/useFetch";
import type {CartItem, MovieData, MovieTicket} from "../src/types";
import {formatDate} from "../utils/dateUtils";
import {addMovieToCart, fetchBookedSeats, fetchBooking, fetchMovieById, seedConfirmationEmail} from "../api/movies";
import {getGuestCartId} from "../utils/guestCart";

const SEAT_ROWS = ["A", "B", "C", "D", "E", "F", "G"];
const SEATS_PER_ROW = 12;

export function MovieDetailsPage() {
    const {auth} = useAuth();
    const cartOwnerId = auth?.userId ?? getGuestCartId();
    const {movieId} = useParams();
    const id = Number(movieId);
    const [selectedSeat, setSelectedSeat] = useState("");

    const getMovie = useCallback(() => fetchMovieById(id), [id]);
    const getBookedSeats = useCallback(() => fetchBookedSeats(id), [id]);
    const getUserBooking = useCallback(() => fetchBooking(id, auth?.userId), [auth?.userId, id]);

    const {data: movie, loading, error} = useFetch<MovieData>(getMovie);
    const {data: bookedSeats, refetch: refetchBookedSeats} = useFetch<string[]>(getBookedSeats);
    const {data: booking, refetch: refetchBooking} = useFetch<MovieTicket | null>(getUserBooking);

    const bookedSeatSet = useMemo(() => new Set(bookedSeats ?? []), [bookedSeats]);

    const {run: addToCartAction, error: cartError} = useAsync<CartItem, [number, number, string]>({
        action: addMovieToCart,
        onSuccess: () => {
            void refetchBookedSeats();
            setSelectedSeat("");
        },
        errorMessage: "Failed to add movie to cart",
    });

    const {run: emailAction, error: emailError} = useAsync<MovieTicket, [number]>({
        action: seedConfirmationEmail,
        onSuccess: () => void refetchBooking(),
        errorMessage: "Failed to send confirmation",
    });

    const allError = error || cartError || emailError;

    if (loading) {
        return <LoadingMessage message="Loading movie details..." />;
    }

    if (!movie) {
        return <ErrorMessage error="Movie not found" />;
    }

    return (
        <section className="grid gap-6 lg:grid-cols-[1.25fr,1fr]">
            {allError && <ErrorMessage error={allError} />}
            <article className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-xl shadow-black/30">
                <div
                    className="h-72 bg-cover bg-center"
                    style={{
                        backgroundImage: `linear-gradient(180deg, rgba(2,6,23,0.25), rgba(2,6,23,0.95)), url(${movie.posterUrl || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80"})`,
                    }}
                />
                <div className="space-y-4 p-6 text-slate-100 md:p-8">
                    <h1 className="text-3xl font-semibold leading-tight">{movie.name}</h1>
                    <p className="text-slate-300">{movie.description}</p>
                    <div className="grid gap-3 text-sm text-slate-200 md:grid-cols-2">
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-amber-300" />
                            <span>{formatDate(movie.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock3Icon className="h-4 w-4 text-amber-300" />
                            <span>{movie.durationMinutes || 0} min</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPinIcon className="h-4 w-4 text-amber-300" />
                            <span>{movie.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TicketIcon className="h-4 w-4 text-amber-300" />
                            <span>${(movie.price ?? 12.99).toFixed(2)} per ticket</span>
                        </div>
                    </div>
                    {booking && booking.confirmationSentAt && (
                        <div className="rounded-xl border border-emerald-300/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                            Your booking is confirmed for seat {booking.seatNumber}. Confirmation was sent to {booking.customerEmail || "your email"}.
                        </div>
                    )}
                </div>
            </article>

            <aside className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-black/30 md:p-8">
                <h2 className="text-xl font-semibold text-white">Select a Seat</h2>
                <p className="mt-2 text-sm text-slate-300">Choose an available seat and add it to your cart.</p>

                <div className="mt-6 rounded-xl border border-slate-700 bg-slate-950 px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.28em] text-slate-300">
                    Screen
                </div>

                <div className="mt-5 grid gap-2">
                    {SEAT_ROWS.map(row => (
                        <div key={row} className="grid grid-cols-[20px_repeat(12,minmax(0,1fr))] gap-2">
                            <span className="self-center text-xs font-semibold text-slate-400">{row}</span>
                            {Array.from({length: SEATS_PER_ROW}, (_, seatIndex) => {
                                const seatNumber = `${row}${seatIndex + 1}`;
                                const isSelected = selectedSeat === seatNumber;
                                const isBooked = bookedSeatSet.has(seatNumber) && !isSelected;

                                return (
                                    <button
                                        key={seatNumber}
                                        type="button"
                                        disabled={isBooked}
                                        onClick={() => setSelectedSeat(seatNumber)}
                                        className={[
                                            "rounded-md border py-2 text-xs font-semibold transition",
                                            isSelected
                                                ? "border-amber-300 bg-amber-300 text-slate-950"
                                                : "border-slate-700 bg-slate-800 text-slate-200 hover:border-amber-300/70",
                                            isBooked ? "cursor-not-allowed border-rose-400/60 bg-rose-500/20 text-rose-200" : "",
                                        ].join(" ")}
                                    >
                                        {seatIndex + 1}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2 text-xs text-slate-300">
                    <div className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-center">Available</div>
                    <div className="rounded-md border border-amber-300 bg-amber-300 px-2 py-1 text-center text-slate-950">Selected</div>
                    <div className="rounded-md border border-rose-400/60 bg-rose-500/20 px-2 py-1 text-center text-rose-200">Booked</div>
                </div>

                <div className="mt-6 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300">
                    <p>Ticket: ${(movie.price ?? 12.99).toFixed(2)}</p>
                    <p className="mt-1">Seat: <span className="font-semibold text-white">{selectedSeat || "Not selected"}</span></p>
                </div>

                <Button
                    className="mt-6 w-full justify-center"
                    disabled={!selectedSeat}
                    onClick={() => {
                        if (!selectedSeat) {
                            return;
                        }
                        void addToCartAction(id, cartOwnerId, selectedSeat);
                    }}
                >
                    Add to Cart
                </Button>
                <Button
                    className="mt-3 w-full justify-center"
                    variant="secondary"
                    disabled={!booking}
                    onClick={() => {
                        if (booking) {
                            void emailAction(booking.ticketId);
                        }
                    }}
                >
                    Resend Confirmation
                </Button>
            </aside>
        </section>
    );
}
