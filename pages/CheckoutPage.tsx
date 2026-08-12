import {useCallback, useState} from "react";
import {useNavigate} from "react-router-dom";

import {useAuth} from "../contexts/AuthContext";
import {useFetch} from "../hooks/useFetch";
import {useAsync} from "../hooks/useAsync";

import {
    checkoutCart,
    fetchCheckoutTotal
} from "../api/movies";

import type {
    CheckoutResult,
    CheckoutTotal
} from "../api/movies";

import {Button} from "../components/Button";
import {LoadingMessage} from "../components/LoadingMessage";
import {ErrorMessage} from "../components/ErrorMessage";


export function CheckoutPage() {

    const {auth} = useAuth();
    const navigate = useNavigate();

    const [nameOnCard, setNameOnCard] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiration, setExpiration] = useState("");
    const [cvv, setCvv] = useState("");


    const getTotal = useCallback(() => {

        if (!auth?.userId) {
            return Promise.reject(
                new Error("Please log in to checkout.")
            );
        }

        return fetchCheckoutTotal(auth.userId);

    }, [auth?.userId]);


    const {
        data: totals,
        loading,
        error
    } = useFetch<CheckoutTotal>(getTotal);


    const {
        run: checkoutAction,
        loading: processing,
        error: checkoutError
    } = useAsync<
        CheckoutResult,
        [number, number]
    >({

        action: checkoutCart,

        onSuccess: result => {

            navigate("/payment-complete", {
                state: {
                    order: result.order,
                    payment: result.payment,
                    tickets: result.tickets
                }
            });

        },

        errorMessage: "Payment could not be completed"
    });


    const handleSubmit = (
        event: React.FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        if (!auth?.userId || !totals) {
            return;
        }

        void checkoutAction(
            auth.userId,
            totals.total
        );
    };


    if (loading) {
        return (
            <LoadingMessage
                message="Loading checkout..."
            />
        );
    }


    return (

        <section
            className="
                mx-auto grid max-w-5xl gap-6
                lg:grid-cols-[1fr,0.65fr]
            "
        >
            <div
                className="
                    rounded-3xl border border-white/10
                    bg-slate-900/70 p-8
                    shadow-xl shadow-black/30
                "
            >

                <h1
                    className="
                        text-3xl font-semibold text-white
                    "
                >
                    Payment
                </h1>

                <p className="mt-2 text-slate-300">
                    Enter your payment information to
                    complete your reservation.
                </p>


                {(error || checkoutError) && (

                    <div className="mt-5">
                        <ErrorMessage
                            error={
                                error ||
                                checkoutError ||
                                ""
                            }
                        />
                    </div>

                )}


                <form
                    className="mt-8 space-y-5"
                    onSubmit={handleSubmit}
                >

                    {/* NAME */}

                    <div>

                        <label
                            htmlFor="nameOnCard"
                            className="
                                mb-2 block text-sm
                                font-medium text-slate-200
                            "
                        >
                            Name on card
                        </label>

                        <input
                            id="nameOnCard"
                            type="text"
                            required
                            value={nameOnCard}
                            onChange={event =>
                                setNameOnCard(
                                    event.target.value
                                )
                            }
                            className="
                                w-full rounded-xl border
                                border-slate-700
                                bg-slate-950 px-4 py-3
                                text-white outline-none
                                transition
                                focus:border-amber-300
                            "
                        />

                    </div>
                    <div>

                        <label
                            htmlFor="cardNumber"
                            className="
                                mb-2 block text-sm
                                font-medium text-slate-200
                            "
                        >
                        </label>

                        <input
                            id="cardNumber"
                            type="text"
                            inputMode="numeric"
                            required
                            maxLength={19}
                            placeholder="1234 5678 9012 3456"

                            value={cardNumber}

                            onChange={event => {

                                const numbers =
                                    event.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 16);

                                const formatted =
                                    numbers
                                        .replace(
                                            /(.{4})/g,
                                            "$1 "
                                        )
                                        .trim();

                                setCardNumber(formatted);
                            }}

                            className="
                                w-full rounded-xl border
                                border-slate-700
                                bg-slate-950 px-4 py-3
                                text-white outline-none
                                transition
                                focus:border-amber-300
                            "
                        />

                    </div>


                    <div
                        className="
                            grid gap-5 sm:grid-cols-2
                        "
                    >
                        <div>

                            <label
                                htmlFor="expiration"
                                className="
                                    mb-2 block text-sm
                                    font-medium
                                    text-slate-200
                                "
                            >
                                Expiration
                            </label>

                            <input
                                id="expiration"
                                type="text"
                                required
                                maxLength={5}
                                placeholder="MM/YY"
                                value={expiration}

                                onChange={event =>
                                    setExpiration(
                                        event.target.value
                                    )
                                }

                                className="
                                    w-full rounded-xl
                                    border border-slate-700
                                    bg-slate-950
                                    px-4 py-3 text-white
                                    outline-none transition
                                    focus:border-amber-300
                                "
                            />

                        </div>
                        <div>

                            <label
                                htmlFor="cvv"
                                className="
                                    mb-2 block text-sm
                                    font-medium
                                    text-slate-200
                                "
                            >
                                CVV
                            </label>

                            <input
                                id="cvv"
                                type="password"
                                inputMode="numeric"
                                required
                                maxLength={4}
                                placeholder="123"

                                value={cvv}

                                onChange={event =>
                                    setCvv(
                                        event.target.value
                                            .replace(
                                                /\D/g,
                                                ""
                                            )
                                    )
                                }

                                className="
                                    w-full rounded-xl
                                    border border-slate-700
                                    bg-slate-950
                                    px-4 py-3 text-white
                                    outline-none transition
                                    focus:border-amber-300
                                "
                            />

                        </div>

                    </div>


                    <p className="text-xs text-slate-400">
                        Demo payment only. No real card
                        will be charged.
                    </p>


                    <Button
                        type="submit"
                        disabled={processing}
                        className="
                            w-full justify-center
                        "
                    >

                        {processing
                            ? "Processing..."
                            : `Pay $${totals?.total.toFixed(2) ?? "0.00"}`
                        }

                    </Button>

                </form>

            </div>
            <aside
                className="
                    h-fit rounded-3xl border
                    border-white/10
                    bg-slate-900/70 p-7
                    shadow-xl shadow-black/30
                "
            >

                <h2
                    className="
                        text-xl font-semibold text-white
                    "
                >
                    Order Summary
                </h2>


                <div
                    className="
                        mt-6 space-y-3
                        text-sm text-slate-300
                    "
                >

                    <div
                        className="
                            flex justify-between
                        "
                    >
                        <span>Subtotal</span>

                        <span>
                            $
                            {totals
                                ?.subtotal
                                .toFixed(2)}
                        </span>
                    </div>


                    <div
                        className="
                            flex justify-between
                        "
                    >
                        <span>Tax</span>

                        <span>
                            $
                            {totals
                                ?.tax
                                .toFixed(2)}
                        </span>
                    </div>


                    <div
                        className="
                            flex justify-between
                        "
                    >
                        <span>Convenience Fee</span>

                        <span>
                            $
                            {totals
                                ?.fees
                                .toFixed(2)}
                        </span>
                    </div>


                    <div
                        className="
                            mt-4 flex justify-between
                            border-t border-white/10
                            pt-4 text-lg
                            font-semibold text-white
                        "
                    >

                        <span>Total</span>

                        <span>
                            $
                            {totals
                                ?.total
                                .toFixed(2)}
                        </span>

                    </div>

                </div>


                <Button
                    type="button"
                    variant="secondary"
                    className="
                        mt-6 w-full justify-center
                    "
                    onClick={() =>
                        navigate("/cart")
                    }
                >
                    Back to Cart
                </Button>

            </aside>

        </section>
    );
}