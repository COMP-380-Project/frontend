import {useCallback} from "react";
import {useFetch} from "../hooks/useFetch";
import {useAuth} from "../contexts/AuthContext";
import {LoadingMessage} from "../components/LoadingMessage";
import {ErrorMessage} from "../components/ErrorMessage";
import {fetchMovieReports} from "../api/movies";
import type {MovieReportRow} from "../src/types";

export function ReportsPage() {
    const {auth} = useAuth();

    const getReports = useCallback(
        () => fetchMovieReports(auth!.userId),
        [auth]
    );

    const {data, loading, error} = useFetch<MovieReportRow[]>(getReports);

    if (loading) {
        return <LoadingMessage message="Loading reports..." />;
    }

    const rows = data ?? [];
    const totalBookings = rows.reduce((sum, row) => sum + row.bookings, 0);
    const totalRevenue = rows.reduce((sum, row) => sum + row.revenue, 0);

    return (
        <section>
            <div className="mb-8 rounded-3xl border border-white/10 bg-slate-900/70 p-7 shadow-xl shadow-black/25">
                <h1 className="text-3xl font-semibold text-white">Manager Reports</h1>
                <p className="mt-2 text-slate-300">Booking volume and revenue by movie.</p>
            </div>
            {error && <ErrorMessage error={error} />}
            <div className="mb-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 text-slate-100 shadow-lg shadow-black/25">
                    <p className="text-sm text-slate-300">Total bookings</p>
                    <p className="mt-2 text-3xl font-semibold text-amber-300">{totalBookings}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 text-slate-100 shadow-lg shadow-black/25">
                    <p className="text-sm text-slate-300">Total revenue</p>
                    <p className="mt-2 text-3xl font-semibold text-amber-300">${totalRevenue.toFixed(2)}</p>
                </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-lg shadow-black/25">
                <table className="w-full text-left text-sm text-slate-200">
                    <thead className="bg-slate-950/70 text-slate-300">
                        <tr>
                            <th className="px-4 py-3">Movie</th>
                            <th className="px-4 py-3">Bookings</th>
                            <th className="px-4 py-3">Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(row => (
                            <tr key={row.movieId} className="border-t border-slate-800">
                                <td className="px-4 py-3">{row.movieName}</td>
                                <td className="px-4 py-3">{row.bookings}</td>
                                <td className="px-4 py-3">${row.revenue.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
