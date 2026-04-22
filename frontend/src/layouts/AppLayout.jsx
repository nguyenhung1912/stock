import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="app-shell px-4 pb-10 pt-6 sm:px-5">
        <Outlet />
      </main>
    </div>
  );
}
