import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../../contexts/AuthContext";
import {Button} from "../Button";

export function Header() {
    const {isAuthenticated, logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
      logout();
      navigate("/");  
    };
    return (
        <header className="flex items-center justify-between bg-white p-4 shadow"> 
            <h2 className="text-xl font-bold">Event app</h2>
            <nav className="flex items-center gap-4">
                <ul className="flex gap-4">
                    <li>
                        <Link to="/">All Events</Link>
                    </li>
                    <li>
                        <Link to="/my-events">My Events</Link>
                    </li>
                    {isAuthenticated ? (
                    <li>
                        <Button variant="secondary" size="small" onClick={handleLogout}>
                            Logout
                        </Button>
                    </li>
                       ) : (
                       <>
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                        <li>
                            <Link to="/register">Register</Link>
                        </li>
                       </>
                    )}

                </ul>
            </nav>
        </header>
    );
}