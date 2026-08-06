import {useMemo, useState} from "react";
import {FilmIcon, SearchIcon} from "lucide-react";
import {fetchMovies} from "../api/movies";
import {useFetch} from "../hooks/useFetch";
import type {MovieData} from "../src/types";
import {MovieList} from "../components/movies/MovieList";
import {SearchBar} from "../components/SearchBar";

export function MoviesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const {data, loading, error} = useFetch<MovieData[]>(() => fetchMovies(searchTerm));

    const movies = useMemo(() => data ?? [], [data]);

    return (
        <section>
            <div className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-linear-to-r from-slate-900 via-slate-900 to-orange-950 p-8 shadow-2xl shadow-black/25">
                <div className="mb-4 flex items-center gap-3 text-amber-300">
                    <FilmIcon className="h-5 w-5" />
                    <span className="text-sm font-semibold uppercase tracking-[0.2em]">MCAB Theater</span>
                </div>
                <h1 className="max-w-2xl text-3xl font-semibold leading-tight text-white md:text-4xl">
                    GET YOUR TICKETS NOW!
                </h1>
                <p className="mt-3 max-w-2xl text-slate-300">
                    Search a movie, reserve a seat, add it to cart, and confirm your booking.
                </p>
            </div>

            <div className="mb-6 rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-black/20">
                <div className="flex items-center gap-3 text-slate-300">
                    <SearchIcon className="h-4 w-4 text-amber-300" />
                    <span className="text-sm font-medium">Search movies</span>
                </div>
                <SearchBar value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search movies, genres, languages, or theaters" />
            </div>

            <MovieList loading={loading} error={error?.message ?? null} movies={movies} />
        </section>
    );
}
