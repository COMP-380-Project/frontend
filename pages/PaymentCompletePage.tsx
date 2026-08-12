import {useLocation, useNavigate} from "react-router-dom";
import {Button} from "../components/Button";


interface PaymentState {

    order?: {
        id: number;
        total_amount: number;
        order_status: string;
    };

    payment?: {
        id: number;
        amount: number;
        payment_status: string;
    };

    tickets?: {
        id: number;
        seat_number: string;
        ticket_type: string;
        price: number;
    }[];
}


export function PaymentCompletePage() {

    const navigate = useNavigate();

    const location = useLocation();

    const state =
        location.state as PaymentState | null;


    return (

        <section
            className="
                mx-auto max-w-2xl
                rounded-3xl border
                border-white/10
                bg-slate-900/70
                p-8 text-center
                shadow-xl shadow-black/30
            "
        >

            <div
                className="
                    mx-auto flex h-16 w-16
                    items-center justify-center
                    rounded-full
                    bg-emerald-500/20
                    text-3xl text-emerald-300
                "
            >
                ✓
            </div>


            <h1
                className="
                    mt-5 text-3xl
                    font-semibold text-white
                "
            >
                Payment Complete
            </h1>


            <p className="mt-2 text-slate-300">
                Your movie reservation
                has been confirmed.
            </p>


            {state?.order && (

                <div
                    className="
                        mt-7 rounded-2xl
                        border border-white/10
                        bg-slate-950 p-5
                        text-left
                    "
                >

                    <p className="text-slate-300">
                        Confirmation #
                        <span
                            className="
                                ml-2 font-semibold
                                text-white
                            "
                        >
                            {state.order.id}
                        </span>
                    </p>


                    <p className="mt-2 text-slate-300">
                        Payment Status:
                        <span
                            className="
                                ml-2 font-semibold
                                capitalize
                                text-emerald-300
                            "
                        >
                            {
                                state.payment
                                    ?.payment_status
                            }
                        </span>
                    </p>


                    <p className="mt-2 text-slate-300">
                        Total:
                        <span
                            className="
                                ml-2 font-semibold
                                text-white
                            "
                        >
                            $
                            {state.order
                                .total_amount
                                .toFixed(2)}
                        </span>
                    </p>


                    {state.tickets &&
                        state.tickets.length > 0 && (

                            <div className="mt-4">

                                <p
                                    className="
                                        font-semibold
                                        text-white
                                    "
                                >
                                    Seats
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-slate-300
                                    "
                                >
                                    {state.tickets
                                        .map(
                                            ticket =>
                                                ticket
                                                    .seat_number
                                        )
                                        .join(", ")}
                                </p>

                            </div>

                        )}

                </div>

            )}


            <div
                className="
                    mt-7 grid gap-3
                    sm:grid-cols-2
                "
            >

                <Button
                    className="
                        w-full justify-center
                    "
                    onClick={() =>
                        navigate("/bookings")
                    }
                >
                    View Bookings
                </Button>


                <Button
                    variant="secondary"
                    className="
                        w-full justify-center
                    "
                    onClick={() =>
                        navigate("/movies")
                    }
                >
                    Browse Movies
                </Button>

            </div>

        </section>
    );
}