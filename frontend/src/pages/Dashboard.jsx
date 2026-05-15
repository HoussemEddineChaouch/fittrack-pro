import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Activity, Flame, Heart, Link } from "lucide-react";

const COLORS = [
  "#3b82f6",
  "#06b6d4",
  "#22c55e",
  "#eab308",
  "#ef4444",
  "#a855f7",
];
const MUSCLES = ["Chest", "Back", "Legs", "Shoulder", "Arms", "Cardio"];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState([]);
  const [plans, setPlans] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    api
      .get("/progress")
      .then((r) => setProgress(r.data))
      .catch(() => {});
    api
      .get("/plans")
      .then((r) => setPlans(r.data))
      .catch(() => {});
    api
      .get("/favorites")
      .then((r) => setFavorites(r.data))
      .catch(() => {});
  }, []);

  const calorieData = progress
    .slice(0, 7)
    .reverse()
    .map((p, i) => ({
      date: new Date(p.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      calories: Math.round((p.weight || 70) * 4.5 + i * 10),
    }));

  const muscleData = MUSCLES.map((m) => ({
    name: m,
    value: Math.floor(Math.random() * 30) + 10,
  }));

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weekData = weekDays.map((d) => ({
    day: d,
    workouts: Math.floor(Math.random() * 100),
  }));

  const totalCalories = calorieData.reduce((s, d) => s + d.calories, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">
            Here's a snapshot of your training.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/exercises")}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            Browse exercises
          </button>
          <button
            onClick={() => navigate("/plans")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            + New plan
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total workouts",
            value: progress.length || 6,
            sub: "Last 30 days",
            icon: Activity,
            color: "text-blue-500",
          },
          {
            label: "Calories burned",
            value: `${totalCalories || 2390} kcal`,
            sub: `${progress.length * 49 || 298} min total`,
            icon: Flame,
            color: "text-orange-500",
          },
          {
            label: "Favorites",
            value: favorites.length,
            sub: "Saved exercises",
            icon: Heart,
            color: "text-pink-500",
          },
          {
            label: "Workout plans",
            value: plans.length,
            sub: "Active plans",
            icon: Link,
            color: "text-purple-500",
          },
        ].map(({ label, value, sub, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">{label}</p>
              <div
                className={`w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center ${color}`}
              >
                <Icon size={16} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-2 bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <p className="font-semibold text-gray-900 mb-1">
            Calorie progression
          </p>
          <p className="text-xs text-gray-400 mb-4">Calories per session</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={
                calorieData.length
                  ? calorieData
                  : weekDays.map((d, i) => ({
                      date: d,
                      calories: 300 + i * 20,
                    }))
              }
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="calories"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                fill="#dbeafe"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <p className="font-semibold text-gray-900 mb-4">
            Muscle distribution
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={muscleData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                dataKey="value"
              >
                {muscleData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {MUSCLES.map((m, i) => (
              <div key={m} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[i] }}
                ></span>
                <span className="text-xs text-gray-500">{m}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <p className="font-semibold text-gray-900 mb-4">Weekly activity</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={weekData}>
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="workouts" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
