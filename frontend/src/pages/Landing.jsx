import { useNavigate } from "react-router-dom";
import { Dumbbell, TrendingUp, Heart, ClipboardList } from "lucide-react";

const features = [
  {
    icon: Dumbbell,
    title: "Exercise library",
    desc: "Browse a curated catalog with filters by muscle, equipment, and difficulty.",
  },
  {
    icon: ClipboardList,
    title: "Workout plans",
    desc: "Build push/pull/legs, full body, or custom plans with sets and reps.",
  },
  {
    icon: TrendingUp,
    title: "Progress tracking",
    desc: "Log weight and measurements, see trends with clean charts.",
  },
  {
    icon: Heart,
    title: "Favorites",
    desc: "Save the moves you actually use. Pull them up in one click.",
  },
];

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <header className="flex items-center justify-between px-10 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Dumbbell size={16} className="text-white" />
          </div>
          <span className="font-semibold text-gray-900">FitTrack Pro</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Get started
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center py-20">
        <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-1.5 text-sm text-gray-600 mb-8">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
          Your training, organized.
        </div>
        <h1 className="text-5xl font-bold text-gray-900 max-w-2xl leading-tight mb-6">
          The clean way to{" "}
          <span className="text-blue-600">
            plan and
            <br />
            track
          </span>{" "}
          your training.
        </h1>
        <p className="text-gray-500 text-lg max-w-lg mb-10">
          FitTrack Pro brings your exercises, plans, history, and progress into
          one focused dashboard.
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/register")}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Start free →
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            View demo
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-4xl w-full">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-gray-50 rounded-xl p-5 text-left border border-gray-100"
            >
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
                <Icon size={18} className="text-blue-600" />
              </div>
              <p className="font-semibold text-gray-900 text-sm mb-1">
                {title}
              </p>
              <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-6 text-gray-400 text-sm border-t border-gray-100">
        © 2026 FitTrack Pro
      </footer>
    </div>
  );
}
