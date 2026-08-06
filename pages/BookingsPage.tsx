import {useCallback} from "react";
import {CalendarIcon, MapPinIcon, TicketIcon} from "lucide-react";
import {useAuth} from "../contexts/AuthContext";
import {useAsync} from "../hooks/useAsync";
import {useFetch} from "../hooks/useFetch";
import {cancelMovieBooking, fetchUserTickets} from "../api/movies";
import type {MovieTicket} from "../src/types";
import {LoadingMessage} from "../components/LoadingMessage";
import {ErrorMessage} from "../components/ErrorMessage";
import {formatDate} from "../utils/dateUtils";

export function BookingsPage() {
    const {auth} = useAuth();
    const getTickets = useCallback(() => fetchUserTickets(auth?.userId), [auth?.userId]);
    const {data, loading, error, refetch} = useFetch<MovieTicket[]>(getTickets);

    const {run: cancelAction, error: cancelError} = useAsync<void, [number]>({
        action: cancelMovieBooking,
        onSuccess: () => void refetch(),
        errorMessage: "Failed to cancel booking",
    });

    if (loading) {
        return <LoadingMessage message="Loading bookings..." />;
    }

    const tickets = data ?? [];

    return (
        <section>
            <div className="mb-8 rounded-3xl border border-white/10 bg-slate-900/70 p-7 shadow-xl shadow-black/25">
                <h1 className="text-3xl font-semibold text-white">My Bookings</h1>
                <p className="mt-2 text-slate-300">View, manage, and cancel your booked movie tickets.</p>
            </div>
            {(error || cancelError) && <ErrorMessage error={error || cancelError} />}
            {tickets.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 text-center text-slate-300">
                    You have no confirmed bookings yet.
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {tickets.map(ticket => (
                        <article key={ticket.ticketId} className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-lg shadow-black/30">
                            <div
                                className="h-36 bg-cover bg-center"
                                style={{
                                    backgroundImage: `linear-gradient(180deg, rgba(2,6,23,0.2), rgba(2,6,23,0.8)), url(${ticket.movie.posterUrl || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80"})`,
                                }}
                            />
                            <div className="space-y-2 p-5 text-slate-100">
                                <h2 className="text-xl font-semibold">{ticket.movie.name}</h2>
                                <div className="flex items-center gap-2 text-sm text-slate-300">
                                    <CalendarIcon className="h-4 w-4 text-amber-300" />
                                    <span>{formatDate(ticket.movie.date)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-300">
                                    <MapPinIcon className="h-4 w-4 text-amber-300" />
                                    <span>{ticket.movie.location}</span>
                                </div>
                                <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3">
                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                        <TicketIcon className="h-4 w-4 text-amber-300" />
                                        <span>Seat {ticket.seatNumber}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => void cancelAction(ticket.ticketId)}
                                        className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:border-rose-300 hover:text-rose-200"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
