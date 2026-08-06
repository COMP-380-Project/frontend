import {Link, useNavigate} from "react-router-dom";
import {register} from "../api/auth";
import {Button} from "../components/Button";
import {InputGroup} from "../components/InputGroups";
import {useForm} from "../hooks/useForm";
import {ErrorMessage} from "../components/ErrorMessage";

interface RegisterFormData {
    name: string;
    email: string;
    password: string;
}

const initialValues: RegisterFormData = {
   name: "",
   email: "",
   password: "",
};


export function RegisterPage() {
    const navigate = useNavigate();

    const validateForm = (values: RegisterFormData) => {
        const errors: Partial<RegisterFormData> = {};
        if(!values.name) errors.name = "Name is required";
        if(!values.email) errors.email = "Email is required";
        if(values.password.length < 8)
            errors.password = "Password must be at least 8 characters long";
        return errors;
    };

    const onSubmit = async ({name, email, password}: RegisterFormData) => {
      const user = await register(name, email, password);
      if (!user) {
        throw new Error("This email is already in use");
      }
        navigate("/login");
    };

    const {values, errors, error, isLoading, handleChange, handleSubmit} = useForm<RegisterFormData>({
        initialValues,
        validate: validateForm,
        onSubmit,
    });

    return (
    <div className="mx-auto max-w-md">
      <div className="rounded-3xl border border-white/10 bg-slate-900/75 p-8 shadow-2xl shadow-black/30">
        <h2 className="mb-2 text-3xl font-semibold text-white">Create Account</h2>
        <p className="mb-6 text-sm text-slate-300">Join CineReserve to reserve movie tickets and seats instantly.</p>
            {error && <ErrorMessage error={error} />}
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <InputGroup 
                label="Name" 
                name="name" 
                value={values.name} 
                onChange={handleChange} 
                error={errors.name}
              />
              <InputGroup 
                label="Email" 
                name="email" 
                value={values.email} 
                onChange={handleChange} 
                error={errors.email}
              />
              <InputGroup 
                label="Password" 
                name="password"
                type="password"
                value={values.password} 
                onChange={handleChange} 
                error={errors.password}
              />
              <div className="flex flex-col space-y-3">
                <Button type="submit" disabled={isLoading}>
                {isLoading ? "Registering..." : "Register"}
                </Button>
                <div className="text-center text-sm text-slate-300">
                    Already have an account?{" "}
                  <Link to="/login" className="text-amber-300 hover:text-amber-200">
                    Login
                    </Link>
                </div>
              </div>
            </form>
        </div>
    </div>
    );
}