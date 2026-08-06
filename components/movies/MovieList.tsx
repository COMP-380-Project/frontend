import {useNavigate} from "react-router-dom";
import {LoadingMessage} from "../LoadingMessage";
import {ErrorMessage} from "../ErrorMessage";
import type {MovieData} from "../../src/types";
import {MovieCard} from "./MovieCard";

interface MovieListProps {
    movies: MovieData[];
    loading: boolean;
    error: string | null;
}

export function MovieList({movies, loading = false, error = null}: MovieListProps) {
    const navigate = useNavigate();

    if (loading) {
        return <LoadingMessage message="Loading movies..." />;
    }

    if (error) {
        return <ErrorMessage error={error} />;
    }

    if (movies.length === 0) {
        return (
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 text-center text-slate-300 shadow-lg shadow-black/30">
                No upcoming movies found.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {movies.map(movie => (
                <MovieCard key={movie.id} movie={movie} onClick={movieId => navigate(`/movies/${movieId}`)} />
            ))}
        </div>
    );
}
