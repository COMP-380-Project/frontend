import {CalendarIcon, Clock3Icon, MapPinIcon, StarIcon, TicketIcon} from "lucide-react";
import type {MovieData} from "../../src/types";

interface MovieCardProps {
    movie: MovieData;
    onClick: (movieId: number) => void;
}

export function MovieCard({movie, onClick}: MovieCardProps) {
    return (
        <button
            type="button"
            onClick={() => onClick(movie.id)}
            className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 text-left shadow-lg shadow-black/30 transition duration-300 hover:-translate-y-1 hover:border-amber-300/60"
        >
            <div
                className="h-48 w-full bg-cover bg-center"
                style={{
                    backgroundImage: `linear-gradient(180deg, rgba(2,6,23,0.1), rgba(2,6,23,0.7)), url(${movie.posterUrl || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80"})`,
                }}
            />
            <div className="flex flex-1 flex-col p-5 text-slate-100">
                <div className="mb-3 flex items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold leading-tight">{movie.name}</h3>
                    <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300">
                        {movie.rating || "NR"}
                    </span>
                </div>
                <p className="mb-4 line-clamp-2 text-sm text-slate-300">{movie.description}</p>
                <div className="mb-2 flex items-center text-sm text-slate-300">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <p>{movie.showtimes.length} showtime {movie.showtimes.length !== 1 ? "s" : ""}</p>
                </div>
                <div className="mb-2 flex items-center text-sm text-slate-300">
                    <Clock3Icon className="mr-2 h-4 w-4" />
                    <p>{movie.durationMinutes || 0} min</p>
                </div>
                <div className="mb-5 flex items-center text-sm text-slate-300">
                    <MapPinIcon className="mr-2 h-4 w-4" />
                    <p>{movie.durationMinutes || 0} min</p>
                </div>
                <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-amber-300">
                        <StarIcon className="h-4 w-4" />
                        <span>{movie.genre || "Feature Film"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-amber-200">
                        <TicketIcon className="h-4 w-4" />
                        <span>{movie.showtimes.length > 0 ? `From $${Math.min(...movie.showtimes.map(showtime => showtime.price)).toFixed(2)}`: "No showtimes"}</span>
                    </div>
                </div>
                <div className="mt-4 rounded-lg bg-amber-300/90 px-3 py-2 text-center text-sm font-semibold text-slate-900 transition group-hover:bg-amber-300">
                    Select Seat
                </div>
            </div>
        </button>
    );
}
