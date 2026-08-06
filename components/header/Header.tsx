import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../../contexts/AuthContext";
import {Button} from "../Button";
import logo from "../../src/assets/mcablogo.svg";

export function Header() {
    const {isAuthenticated, logout, auth} = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
      logout();
      navigate("/login");  
    };
    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 md:px-8">
            <Link to="/movies">
                <img
                    src={logo}
                    alt="Theater Logo"
                    className="h-15 w-auto"
                />
            </Link>
            <nav className="flex items-center gap-5">
                <ul className="flex items-center gap-5 text-sm font-medium text-slate-200">
                    <li>
                        <Link className="transition hover:text-amber-300" to="/movies">Now Showing</Link>
                    </li>
                    <li>
                        <Link className="transition hover:text-amber-300" to="/cart">Cart</Link>
                    </li>
                    
                    
                    {isAuthenticated && (
                        <>
                    <li>
                        <Link className="transition hover:text-amber-300" to="/bookings">My Bookings</Link>
                    </li>
                    {auth?.role === "manager" && (
                        <li>
                            <Link className="transition hover:text-amber-300" to="/reports">Reports</Link>
                        </li>
                    )}
                    <li>
                        <span className="text-slate-400">{auth?.name}</span>
                    </li>
                        </>
                    )}
                    {isAuthenticated ? (
                    <li>
                        <Button variant="secondary" size="small" onClick={handleLogout}>
                            Logout
                        </Button>
                    </li>
                       ) : (
                       <>
                        <li>
                            <Link className="transition hover:text-amber-300" to="/login">Login</Link>
                        </li>
                        <li>
                            <Link className="transition hover:text-amber-300" to="/register">Register</Link>
                        </li>
                       </>
                    )}

                </ul>
            </nav>
            </div>
        </header>
    );
}