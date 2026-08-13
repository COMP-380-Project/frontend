import {Button} from "../Button";
import type {CartItem} from "../../src/types";

interface CartSummaryProps {
    items: CartItem[];
    onRemove: (cartItemId: number) => void;
    onCheckout: () => void;
    onGuestCheckout: () => void;
    onLogin: () => void;
    isProcessing: boolean;
    isAuthenticated: boolean;
    }

export function CartSummary({items, onRemove, onCheckout, onGuestCheckout, onLogin, isProcessing, isAuthenticated}: CartSummaryProps) {
    const total = items.reduce((sum, item) => sum + item.price,0);
    return (
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-black/30">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Cart</h2>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">{items.length} items</span>
            </div>

            {items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 p-6 text-center text-slate-300">
                    Your cart is empty.
                </div>
            ) : (
                <div className="space-y-3">
                    {items.map(item => (
                        <div key={item.id} className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Ticket</h3>
                                    <p className="text-sm text-slate-300">Seat {item.seatNumber}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onRemove(item.id)}
                                    className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:border-rose-300 hover:text-rose-200"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-950/70 p-4 text-slate-300">
                <div className="flex items-center justify-between">
                    <span>Total</span>
                    <span className="text-lg font-semibold text-amber-200">${total.toFixed(2)}</span>
                </div>
            </div>

            {isAuthenticated ? (
                <Button
                    className="mt-5 w-full justify-center"
                    disabled={items.length === 0 || isProcessing}
                    onClick={onCheckout}
                >
                    {isProcessing ? "Booking..." : "Confirm Booking"}
                </Button>
            ) : (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <Button
                        className="w-full justify-center"
                        disabled={items.length === 0 || isProcessing}
                        onClick={onGuestCheckout}
                    >
                        Checkout as Guest
                    </Button>

                    <Button
                        variant="secondary"
                        className="w-full justify-center"
                        disabled={isProcessing}
                        onClick={onLogin}
                    >
                        Log In
                    </Button>
                </div>
            )}
        </div>
    );
}
