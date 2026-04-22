import { useState } from "react";
import {
  FiBarChart2,
  FiLogOut,
  FiMenu,
  FiPlus,
  FiStar,
  FiUser,
  FiX,
} from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { to: "/stocks", label: "Stocks", icon: FiBarChart2 },
  { to: "/favorites", label: "Favorites", icon: FiStar },
  { to: "/create", label: "Create", icon: FiPlus },
];

const navLinkClasses = ({ isActive }) =>
  `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "border border-slate-300 bg-slate-100 text-slate-900"
      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logout();
    navigate("/login", { replace: true });
  };

  const goTo = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="app-shell flex items-center gap-4 px-4 py-3 sm:px-5">
        <button
          type="button"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900"
          onClick={() => goTo("/stocks")}
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-slate-100 text-slate-800">
            <FiBarChart2 />
          </span>
          <span>Stocks Demo</span>
        </button>

        <button
          type="button"
          className="btn-icon ml-auto md:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>

        <div
          className={`${isMenuOpen ? "flex" : "hidden"} w-full flex-col gap-3 border-t border-slate-200 pt-3 md:flex md:w-auto md:flex-1 md:flex-row md:items-center md:justify-between md:border-t-0 md:pt-0`}
        >
          <ul className="flex flex-col gap-1 md:ml-6 md:flex-row md:gap-1">
            {navItems.map(({ to, label, icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={navLinkClasses}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {icon({ className: "text-base" })}
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
              onClick={() => goTo("/profile")}
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
              <span>{user?.username}</span>
              <FiUser className="text-slate-500" />
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
              onClick={handleLogout}
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
