import { FiArrowRight, FiBarChart2, FiStar, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, isLoggedIn } = useAuth();

  return (
    <div className="mx-auto grid w-full max-w-3xl gap-4">
      <div className="page-header">
        <span className="page-eyebrow">Account</span>
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">Basic account information.</p>
      </div>

      <section className="surface-card p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-xl font-semibold text-slate-700">
            {user?.username?.charAt(0).toUpperCase()}
          </div>

          <div>
            <div className="text-lg font-semibold text-slate-900">
              {user?.username}
            </div>
            <div className="mt-1 text-sm text-slate-500">Standard User</div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="surface-soft p-4">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
              <FiUser className="text-slate-400" />
              <span>Username</span>
            </div>
            <div className="mt-2 text-sm text-slate-500">{user?.username}</div>
          </div>

          <div className="surface-soft p-4">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
              <FiBarChart2 className="text-slate-400" />
              <span>Status</span>
            </div>
            <div className="mt-2 text-sm text-slate-500">
              {isLoggedIn ? "Authenticated" : "Not authenticated"}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link to="/stocks" className="btn-secondary w-full sm:w-auto">
            <FiBarChart2 />
            <span>View stocks</span>
          </Link>
          <Link to="/favorites" className="btn-secondary w-full sm:w-auto">
            <FiStar />
            <span>View favorites</span>
          </Link>
          <Link to="/create" className="btn-primary w-full sm:w-auto">
            <span>Create stock</span>
            <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
