import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import type {ReactNode} from "react";

import {MoviesPage} from "../pages/MoviesPage";
import {BookingsPage} from "../pages/BookingsPage";
import {LoginPage} from "../pages/LoginPage";
import {RegisterPage} from "../pages/RegisterPage";
import {MovieDetailsPage} from "../pages/MovieDetailsPage";
import {CartPage} from "../pages/CartPage";
import {ReportsPage} from "../pages/ReportsPage";
import {GuestCheckoutPage} from "../pages/GuestCheckoutPage";
import {CheckoutPage} from "../pages/CheckoutPage";
import {PaymentCompletePage} from "../pages/PaymentCompletePage";

import {Header} from "../components/header/Header";
import {ProtectedRoute} from "../components/ProtectedRoute";

import {AuthProvider} from "../contexts/AuthProvider";
import {useAuth} from "../contexts/AuthContext";


function ManagerRoute({children}: {children: ReactNode}) {
    const {auth} = useAuth();

    if (auth?.role !== "manager") {
        return <Navigate to="/movies" replace />;
    }

    return <>{children}</>;
}


function App() {
    return (
        <AuthProvider>
            <Router>

                <div className="min-h-screen app-bg">

                    <Header />

                    <main className="mx-auto w-full max-w-7xl px-5 py-8 md:px-8 md:py-10">

                        <Routes>

                            <Route
                                path="/"
                                element={
                                    <Navigate
                                        to="/movies"
                                        replace
                                    />
                                }
                            />

                            <Route
                                path="/movies"
                                element={<MoviesPage />}
                            />

                            <Route
                                path="/movies/:movieId"
                                element={<MovieDetailsPage />}
                            />

                            <Route
                                path="/cart"
                                element={<CartPage />}
                            />

                            <Route
                                path="/guest-checkout"
                                element={<GuestCheckoutPage />}
                            />


                            <Route
                                path="/checkout"
                                element={
                                    <ProtectedRoute>
                                        <CheckoutPage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/payment-complete"
                                element={<PaymentCompletePage />}
                            />

                            <Route
                                path="/bookings"
                                element={
                                    <ProtectedRoute>
                                        <BookingsPage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/reports"
                                element={
                                    <ProtectedRoute>
                                        <ManagerRoute>
                                            <ReportsPage />
                                        </ManagerRoute>
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/login"
                                element={<LoginPage />}
                            />

                            <Route
                                path="/register"
                                element={<RegisterPage />}
                            />
                            
                            <Route
                                path="*"
                                element={
                                    <Navigate
                                        to="/movies"
                                        replace
                                    />
                                }
                            />

                        </Routes>

                    </main>

                </div>

            </Router>
        </AuthProvider>
    );
}
export default App;