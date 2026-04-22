import { useState } from "react";
import { FiArrowRight, FiBarChart2, FiLock, FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import InputField from "@/components/ui/InputField";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [touched, setTouched] = useState({ username: false, password: false });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isInvalid = (field) => touched[field] && !formData[field].trim();

  const handleLogin = async (event) => {
    event.preventDefault();
    setTouched({ username: true, password: true });

    const cleanUsername = formData.username.trim();
    const cleanPassword = formData.password.trim();

    if (!cleanUsername || !cleanPassword) return;

    const result = await login(cleanUsername, cleanPassword);

    if (result.success) {
      toast.success("Login successful!");
      navigate("/stocks");
    } else {
      toast.error(result.message || "Invalid username or password!");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <div className="surface-card w-full max-w-md p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-slate-700">
            <FiBarChart2 />
          </span>
          <div>
            <h1 className="page-title text-[1.5rem]">Sign in</h1>
            <p className="page-subtitle">Login to access your stock data.</p>
          </div>
        </div>

        <form className="grid gap-4" onSubmit={handleLogin}>
          <InputField
            id="username"
            label="Username"
            icon={FiUser}
            type="text"
            name="username"
            autoComplete="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            onBlur={() => handleBlur("username")}
            error={isInvalid("username") ? "Username is required" : null}
          />

          <InputField
            id="password"
            label="Password"
            icon={FiLock}
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            onBlur={() => handleBlur("password")}
            error={isInvalid("password") ? "Password is required" : null}
          />

          <button type="submit" className="btn-primary mt-2 w-full">
            <span>Sign in</span>
            <FiArrowRight />
          </button>
        </form>

        <div className="mt-5 text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link
            className="font-medium text-slate-700 hover:text-slate-900"
            to="/register"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
