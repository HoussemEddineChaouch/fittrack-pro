import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Dumbbell,
  ClipboardList,
  Heart,
  TrendingUp,
  Settings,
  LogOut,
} from "lucide-react";

const links = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/exercises", icon: Dumbbell, label: "Exercises" },
  { to: "/plans", icon: ClipboardList, label: "Workout Plans" },
  { to: "/favorites", icon: Heart, label: "Favorites" },
  { to: "/progress", icon: TrendingUp, label: "Progress" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="fixed top-0 left-0 h-full w-56 bg-gray-900 flex flex-col z-10">
      {/* Logo */}
      <div className="p-5 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <Dumbbell size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">FitTrack Pro</p>
            <p className="text-gray-400 text-xs">Personal dashboard</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        <p className="text-gray-500 text-xs font-medium px-3 py-2 uppercase tracking-wider">
          Workspace
        </p>
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white w-full transition-all"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  );
}
