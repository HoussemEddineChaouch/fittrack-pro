import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const GOALS = [
  "Gain muscle",
  "Lose weight",
  "Maintain fitness",
  "Improve endurance",
  "Increase strength",
];

export default function Settings() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || "",
    fitness_goal: user?.fitness_goal || "Gain muscle",
  });
  const [saved, setSaved] = useState(false);

  const save = async () => {
    const res = await api.put("/users/me", form);
    updateUser(res.data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your profile and goals.
        </p>
      </div>

      <div className="max-w-xl space-y-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <p className="font-semibold text-gray-900 mb-5">Profile</p>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Name
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Email
              </label>
              <input
                value={user?.email || ""}
                disabled
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Fitness goal
              </label>
              <select
                value={form.fitness_goal}
                onChange={(e) =>
                  setForm({ ...form, fitness_goal: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                {GOALS.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>
            <button
              onClick={save}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              {saved ? "✓ Saved!" : "Save changes"}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <p className="font-semibold text-gray-900 mb-1">Account</p>
          <p className="text-sm text-gray-500 mb-4">
            Sign out of your account.
          </p>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
