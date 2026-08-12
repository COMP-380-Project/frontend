import {useCallback, useState} from "react";
import {useParams} from "react-router-dom";
import {Clock3Icon, TicketIcon} from "lucide-react";
import {Button} from "../components/Button";
import {LoadingMessage} from "../components/LoadingMessage";
import {ErrorMessage} from "../components/ErrorMessage";
import {useAuth} from "../contexts/AuthContext";
import {useAsync} from "../hooks/useAsync";
import {useFetch} from "../hooks/useFetch";
import type {CartItem, MovieData, SeatData} from "../src/types";

import {
    addSeatToCart,
    addSeatToGuestCart,
    fetchMovieById,
    fetchShowtimeSeats
} from "../api/movies";


export function MovieDetailsPage() {
    const {auth} = useAuth();
    const {movieId} = useParams();
    const id = Number(movieId);

    const [selectedShowtimeId, setSelectedShowtimeId] =
        useState<number | null>(null);

    const [selectedSeatId, setSelectedSeatId] =
        useState<number | null>(null);


    const getMovie = useCallback(
        () => fetchMovieById(id),
        [id]
    );


    const getSeats = useCallback(() => {
        if (!selectedShowtimeId) {
            return Promise.resolve([]);
        }

        return fetchShowtimeSeats(selectedShowtimeId);
    }, [selectedShowtimeId]);


    const {
        data: movie,
        loading,
        error
    } = useFetch<MovieData>(getMovie);


    const {
        data: seats,
        refetch: refetchSeats
    } = useFetch<SeatData[]>(getSeats);


    const selectedShowtime = movie?.showtimes.find(
        showtime => showtime.id === selectedShowtimeId
    );


    const selectedSeat = seats?.find(
        seat => seat.id === selectedSeatId
    );


    const {
    run: addToCartAction,
    error: cartError
    } = useAsync<CartItem, [number, number]>({
    action: (showtimeId, seatId) =>
        auth?.userId
            ? addSeatToCart(
                auth.userId,
                showtimeId,
                seatId
            )
            : addSeatToGuestCart(
                showtimeId,
                seatId
            ),

    onSuccess: () => {
        setSelectedSeatId(null);
        void refetchSeats();
    },

    errorMessage: "Seat no longer available"
});


    const allError = error || cartError;


    if (loading) {
        return (
            <LoadingMessage message="Loading movie details..." />
        );
    }


    if (!movie) {
        return (
            <ErrorMessage error="Movie not found" />
        );
    }


    return (
        <section className="grid gap-6 lg:grid-cols-[1.25fr,1fr]">

            {allError && (
                <ErrorMessage error={allError} />
            )}


            <article className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-xl shadow-black/30">

                <div
                    className="h-72 bg-cover bg-center"
                    style={{
                        backgroundImage: `linear-gradient(
                            180deg,
                            rgba(2,6,23,0.25),
                            rgba(2,6,23,0.95)
                        ), url(${
                            movie.posterUrl ||
                            "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80"
                        })`
                    }}
                />


                <div className="space-y-4 p-6 text-slate-100 md:p-8">

                    <h1 className="text-3xl font-semibold">
                        {movie.name}
                    </h1>

                    <p className="text-slate-300">
                        {movie.description}
                    </p>


                    <div className="grid gap-3 text-sm text-slate-200 md:grid-cols-2">

                        <div className="flex items-center gap-2">
                            <Clock3Icon className="h-4 w-4 text-amber-300" />

                            <span>
                                {movie.durationMinutes || 0} min
                            </span>
                        </div>


                        <div className="flex items-center gap-2">
                            <TicketIcon className="h-4 w-4 text-amber-300" />

                            <span>
                                {movie.showtimes.length} showtime
                                {movie.showtimes.length !== 1 ? "s" : ""}
                            </span>
                        </div>

                    </div>

                </div>

            </article>


            <aside className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-black/30 md:p-8">

                <h2 className="text-xl font-semibold text-white">
                    Select a Showtime
                </h2>


                <div className="mt-4 grid gap-2">

                    {movie.showtimes.map(showtime => (
                        <button
                            key={showtime.id}
                            type="button"

                            onClick={() => {
                                setSelectedShowtimeId(showtime.id);
                                setSelectedSeatId(null);
                            }}

                            className={[
                                "rounded-xl border p-3 text-left transition",

                                selectedShowtimeId === showtime.id
                                    ? "border-amber-300 bg-amber-300/10"
                                    : "border-slate-700 bg-slate-950 hover:border-amber-300/70"

                            ].join(" ")}
                        >

                            <p className="font-semibold text-white">
                                {new Date(showtime.time).toLocaleString()}
                            </p>

                            <p className="text-sm text-slate-300">
                                Auditorium {showtime.auditoriumId}
                            </p>

                            <p className="text-sm text-amber-300">
                                ${showtime.price.toFixed(2)}
                            </p>

                        </button>
                    ))}

                </div>


                {selectedShowtime && (
                    <>

                        <h2 className="mt-7 text-xl font-semibold text-white">
                            Select a Seat
                        </h2>


                        <div className="mt-5 rounded-xl border border-slate-700 bg-slate-950 px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.28em] text-slate-300">
                            Screen
                        </div>

                        <div className="mt-5 space-y-2">
                            {Array.from(
                                new Set(
                                    (seats ?? []).map(seat =>
                                        seat.seatNumber.charAt(0)
                                    )
                                )
                            ).map(row => {
                                const rowSeats = (seats ?? []).filter(
                                    seat => seat.seatNumber.startsWith(row)
                                );

                                return (
                                    <div
                                        key={row}
                                        className="flex justify-center gap-2"
                                    >
                                        {rowSeats.map(seat => {
                                            const isSelected =
                                                selectedSeatId === seat.id;

                                            const unavailable =
                                                seat.status === "booked" ||
                                                seat.status === "locked";

                                            return (
                                                <button
                                                    key={seat.id}
                                                    type="button"
                                                    disabled={unavailable}
                                                    onClick={() =>
                                                        setSelectedSeatId(seat.id)
                                                    }
                                                    className={[
                                                        "w-24 rounded-md border py-2 text-xs font-semibold transition",

                                                        isSelected
                                                            ? "border-amber-300 bg-amber-300 text-slate-950"
                                                            : "border-slate-700 bg-slate-800 text-slate-200 hover:border-amber-300/70",

                                                        unavailable
                                                        ? "cursor-not-allowed border-rose-400/60 bg-rose-500/20 text-rose-200"
                                                        : ""
                                                    ].join(" ")}
                                                >
                                                    {seat.seatNumber}
                                                </button>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>


                        <div className="mt-5 grid grid-cols-3 gap-2 text-xs">

                            <div className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-center text-slate-300">
                                Available
                            </div>

                            <div className="rounded-md border border-amber-300 bg-amber-300 px-2 py-1 text-center text-slate-950">
                                Selected
                            </div>

                            <div className="rounded-md border border-rose-400/60 bg-rose-500/20 px-2 py-1 text-center text-rose-200">
                                Unavailable
                            </div>

                        </div>


                        <div className="mt-6 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300">

                            <p>
                                Ticket: ${selectedShowtime.price.toFixed(2)}
                            </p>

                            <p className="mt-1">
                                Seat:{" "}

                                <span className="font-semibold text-white">
                                    {selectedSeat?.seatNumber || "Not selected"}
                                </span>
                            </p>

                        </div>

                        <Button
                            className="mt-6 w-full justify-center"
                            disabled={!selectedSeatId}

                            onClick={() => {
                                if (
                                    !selectedShowtimeId ||
                                    !selectedSeatId
                                ) {
                                return;
                                }

                                void addToCartAction(
                                    selectedShowtimeId,
                                    selectedSeatId
                                );
                            }}
                    >
                        Add to Cart
                    </Button>

                    </>
                )}

            </aside>

        </section>
    );
}