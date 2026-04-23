import { FiArrowRight, FiCheckCircle, FiLock, FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import InputField from "@/components/ui/InputField";
import { authService } from "@/services/authService";

const registerSchema = z
  .object({
    username: z.string().min(3, "Min length is 3 characters"),
    password: z.string().min(6, "Min length is 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data) => {
    try {
      const newUser = { username: data.username, password: data.password };
      await authService.register(newUser);

      toast.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Cannot connect to backend to register!");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <div className="surface-card w-full max-w-md p-6 sm:p-8">
        <div className="mb-6">
          <h1 className="page-title text-[1.5rem]">Create account</h1>
          <p className="page-subtitle">
            Register to manage stocks and favorites.
          </p>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <InputField
            id="username"
            label="Username"
            icon={FiUser}
            type="text"
            autoComplete="username"
            placeholder="Choose a username"
            error={errors.username?.message}
            inputProps={register("username")}
          />

          <InputField
            id="password"
            label="Password"
            icon={FiLock}
            type="password"
            autoComplete="new-password"
            placeholder="Create a password"
            error={errors.password?.message}
            inputProps={register("password")}
          />

          <InputField
            id="confirmPassword"
            label="Confirm password"
            icon={FiCheckCircle}
            type="password"
            autoComplete="new-password"
            placeholder="Confirm your password"
            error={errors.confirmPassword?.message}
            inputProps={register("confirmPassword")}
          />

          <button
            type="submit"
            className={`btn-primary mt-2 w-full ${isSubmitting ? "pointer-events-none opacity-70" : ""}`}
            disabled={isSubmitting}
          >
            <span>{isSubmitting ? "Creating..." : "Create account"}</span>
            <FiArrowRight />
          </button>
        </form>

        <div className="mt-5 text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            className="font-medium text-slate-700 hover:text-slate-900"
            to="/login"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
