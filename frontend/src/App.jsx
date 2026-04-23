import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/context/AuthContext";
import AppRouter from "@/routes/AppRouter";
import { warmApi } from "@/services/api";

export default function App() {
  useEffect(() => {
    warmApi();
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        theme="light"
        newestOnTop
      />
    </AuthProvider>
  );
}
