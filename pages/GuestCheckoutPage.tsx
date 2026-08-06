import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button} from "../components/Button";

export function GuestCheckoutPage() {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const guestInformation = {
            firstName,
            lastName,
            email,
            phone,
        };

        console.log("Guest checkout:", guestInformation);
        // Navigates to home page until API is ready
        navigate("/");
    };

    return (
        <section className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-xl shadow-black/30">
            <h1 className="text-3xl font-semibold text-white">
                Guest Checkout
            </h1>

            <p className="mt-2 text-slate-300">
                Please enter the following information:
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label
                            className="mb-2 block text-sm font-medium text-slate-200"
                            htmlFor="firstName"
                        >
                            First name
                        </label>

                        <input
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={event => setFirstName(event.target.value)}
                            required
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-amber-300"
                        />
                    </div>

                    <div>
                        <label
                            className="mb-2 block text-sm font-medium text-slate-200"
                            htmlFor="lastName"
                        >
                            Last name
                        </label>

                        <input
                            id="lastName"
                            type="text"
                            value={lastName}
                            onChange={event => setLastName(event.target.value)}
                            required
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-amber-300"
                        />
                    </div>
                </div>

                <div>
                    <label
                        className="mb-2 block text-sm font-medium text-slate-200"
                        htmlFor="email"
                    >
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                        required
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-amber-300"
                    />
                </div>

                <div>
                    <label
                        className="mb-2 block text-sm font-medium text-slate-200"
                        htmlFor="phone"
                    >
                        Phone number
                    </label>

                    <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={event => setPhone(event.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-amber-300"
                    />
                </div>

                <div className="grid gap-3 pt-3 sm:grid-cols-2">
                    <Button
                        type="submit"
                        className="w-full justify-center"
                    >
                        Complete Booking
                    </Button>

                    <Button
                        type="button"
                        variant="secondary"
                        className="w-full justify-center"
                        onClick={() => navigate("/cart")}
                    >
                        Back to Cart
                    </Button>
                </div>
            </form>
        </section>
    );
}