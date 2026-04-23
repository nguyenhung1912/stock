import { Navigate, Route, Routes, useParams } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import AuthGuard from "@/guards/AuthGuard";
import GuestGuard from "@/guards/GuestGuard";
import CreateStockPage from "@/pages/CreateStockPage";
import LoginPage from "@/pages/LoginPage";
import ProfilePage from "@/pages/ProfilePage";
import RegisterPage from "@/pages/RegisterPage";
import StockDetailsPage from "@/pages/StockDetailsPage";
import StockListPage from "@/pages/StockListPage";

function StockDetailsRoute() {
  const { id } = useParams();

  return <StockDetailsPage key={id} />;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route element={<GuestGuard />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<AuthGuard />}>
        <Route element={<AppLayout />}>
          <Route path="/stocks" element={<StockListPage />} />
          <Route
            path="/favorites"
            element={<StockListPage isFavoritePage={true} />}
          />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/create" element={<CreateStockPage />} />
          <Route path="/stock/:id" element={<StockDetailsRoute />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/stocks" replace />} />
    </Routes>
  );
}
