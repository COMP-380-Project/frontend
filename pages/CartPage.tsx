import {useCallback} from "react";
import {useNavigate} from "react-router-dom";

import {useAuth} from "../contexts/AuthContext";
import {useAsync} from "../hooks/useAsync";
import {useFetch} from "../hooks/useFetch";

import {
    fetchMovieCart,
    fetchGuestCart,
    removeMovieFromCart,
    removeSeatFromGuestCart
} from "../api/movies";

import type {CartItem} from "../src/types";

import {LoadingMessage} from "../components/LoadingMessage";
import {ErrorMessage} from "../components/ErrorMessage";
import {CartSummary} from "../components/movies/CartSummary";


export function CartPage() {

    const {auth} = useAuth();
    const navigate = useNavigate();

    const cartOwnerId = auth?.userId;


    const getCart = useCallback(
        () =>
            cartOwnerId
                ? fetchMovieCart(cartOwnerId)
                : fetchGuestCart(),
        [cartOwnerId]
    );


    const {
        data,
        loading,
        error,
        refetch
    } = useFetch<CartItem[]>(getCart);


    const {
        run: removeAction,
        error: removeError
    } = useAsync<void, [number]>({

        action: itemId =>
            cartOwnerId
                ? removeMovieFromCart(
                    cartOwnerId,
                    itemId
                )
                : removeSeatFromGuestCart(
                    itemId
                ),

        onSuccess: () => {
            void refetch();
        },

        errorMessage: "Failed to remove item",
    });


    if (loading) {
        return (
            <LoadingMessage message="Loading cart..." />
        );
    }


    const items = data ?? [];

    const errorMessage =
        error ||
        removeError;


    return (
        <section className="space-y-6">

            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-7 shadow-xl shadow-black/25">

                <h1 className="text-3xl font-semibold text-white">
                    Cart Checkout
                </h1>

                <p className="mt-2 text-slate-300">
                    Review selected seats, then complete your movie booking.
                </p>

            </div>


            {errorMessage && (
                <ErrorMessage error={errorMessage} />
            )}


            <CartSummary
                items={items}
                isProcessing={false}
                isAuthenticated={Boolean(auth?.userId)}

                onRemove={itemId => {
                    void removeAction(itemId);
                }}

                onCheckout={() => {
                    if (auth?.userId) {
                        navigate("/checkout");
                    }
                }}

                onGuestCheckout={() => {
                    navigate("/guest-checkout");
                }}

                onLogin={() => {
                    navigate("/login", {
                        state: {
                            from: "/cart"
                        }
                    });
                }}
            />

        </section>
    );
}