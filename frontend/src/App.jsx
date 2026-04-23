import { BrowserRouter, HashRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/context/AuthContext";
import AppRouter from "@/routes/AppRouter";

const routerMode = import.meta.env.VITE_ROUTER_MODE?.toLowerCase();
const Router = routerMode === "hash" ? HashRouter : BrowserRouter;

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRouter />
      </Router>

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
