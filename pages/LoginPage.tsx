import {Link, useNavigate, useLocation} from "react-router-dom";
import {login} from "../api/auth";
import { useAuth } from "../contexts/AuthContext";
import {InputGroup} from "../components/InputGroups";  
import {useForm} from "../hooks/useForm"; 
import {Button} from "../components/Button"; 
import {ErrorMessage} from "../components/ErrorMessage";

interface LoginForm {
    email: string;
    password: string;
}

const initialValues: LoginForm = {
    email: "",
    password: "",
};

export function LoginPage() {
    const {login: authLogin} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const validate = (values: LoginForm) => {
        const errors: Partial<LoginForm> = {};
        if (!values.email) errors.email = "Email is required";
        if (!values.password) errors.password = "Password is required";
        return errors;
    };

    const {values: formData, errors, error, isLoading, handleChange, 
    handleSubmit} = useForm<LoginForm>({
        initialValues,
        validate,
        onSubmit: async values => {
           const user = await login(values.email, values.password)
           if(user) {
            authLogin(user);
            navigate(from, { replace: true });
           } else {
                throw new Error("Invalid email or password");
           }
        },
    });
    
    return (<div className="mx-auto max-w-md">
        <div className="rounded-3xl border border-white/10 bg-slate-900/75 p-8 shadow-2xl shadow-black/30">
            <h2 className="mb-2 text-3xl font-semibold text-white">Welcome Back</h2>
            <p className="mb-6 text-sm text-slate-300">Sign in to browse upcoming movies, reserve seats, and manage your bookings.</p>

            {error && <ErrorMessage error={error} />}
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
               <InputGroup 
               error={errors.email} 
               name="email" 
               label="Email"
               value={formData.email} 
               onChange={handleChange}
               />
               <InputGroup 
               error={errors.password}
               type="password"
               name="password" 
               label="Password"
               value={formData.password} 
               onChange={handleChange}
               />
               <div className="flex flex-col space-y-3">
                <Button disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}  
                </Button>
                <div className="text-center text-sm text-slate-300">
                    Don't have an account?{""}
                    <Link className="text-amber-300 hover:text-amber-200" 
                    to="/register"
                    >
                        Register
                    </Link>
                </div>
               </div>
            </form>
        </div>
    </div>);
}