import {useCallback} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../contexts/AuthContext";
import {useAsync} from "../hooks/useAsync";
import {useFetch} from "../hooks/useFetch";
import {bookMoviesFromCart, fetchMovieCart, removeMovieFromCart} from "../api/movies";
import type {CartItem, MovieTicket} from "../src/types";
import {LoadingMessage} from "../components/LoadingMessage";
import {ErrorMessage} from "../components/ErrorMessage";
import {CartSummary} from "../components/movies/CartSummary";

export function CartPage() {
    const {auth} = useAuth();
    const navigate = useNavigate();
    const getCart = useCallback(() => fetchMovieCart(auth?.userId), [auth?.userId]);
    const {data, loading, error, refetch} = useFetch<CartItem[]>(getCart);

    const {run: removeAction, error: removeError} = useAsync<void, [number]>({
        action: removeMovieFromCart,
        onSuccess: () => void refetch(),
        errorMessage: "Failed to remove item",
    });

    const {run: checkoutAction, error: checkoutError} = useAsync<MovieTicket[], [number]>({
        action: bookMoviesFromCart,
        onSuccess: () => {
            void refetch();
            navigate("/bookings");
        },
        errorMessage: "Failed to complete booking",
    });

    if (loading) {
        return <LoadingMessage message="Loading cart..." />;
    }

    const items = data ?? [];
    const errorMessage = error || removeError || checkoutError;

    return (
        <section className="grid gap-6 lg:grid-cols-[1.25fr,0.75fr]">
            <div>
                <div className="mb-8 rounded-3xl border border-white/10 bg-slate-900/70 p-7 shadow-xl shadow-black/25">
                    <h1 className="text-3xl font-semibold text-white">Cart Checkout</h1>
                    <p className="mt-2 text-slate-300">Review selected seats, then complete your movie booking.</p>
                </div>
                {errorMessage && <ErrorMessage error={errorMessage} />}
                {items.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 text-center text-slate-300">
                        No seats in cart yet.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {items.map(item => (
                            <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 text-slate-100 shadow-lg shadow-black/25">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl font-semibold">{item.movie.name}</h2>
                                        <p className="text-sm text-slate-300">Seat {item.seatNumber}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => void removeAction(item.id)}
                                        className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:border-rose-300 hover:text-rose-200"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <CartSummary
                items={items}
                isProcessing={false}
                onRemove={itemId => void removeAction(itemId)}
                onCheckout={() => {
                    if (auth?.userId) {
                        void checkoutAction(auth.userId);
                    }
                }}
            />
        </section>
    );
}
