import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function GuestGuard() {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Navigate to="/stocks" replace={true} />;
  }

  return <Outlet />;
}
