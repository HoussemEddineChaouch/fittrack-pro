import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Trash2 } from "lucide-react";

export default function Progress() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    weight: "",
    chest: "",
    waist: "",
    arms: "",
    legs: "",
  });

  useEffect(() => {
    api
      .get("/progress")
      .then((r) => setEntries(r.data))
      .catch(() => {});
  }, []);

  const addEntry = async () => {
    const payload = {};
    Object.keys(form).forEach((k) => {
      if (form[k]) payload[k] = parseFloat(form[k]);
    });
    const res = await api.post("/progress", payload);
    setEntries((prev) => [res.data, ...prev]);
    setForm({ weight: "", chest: "", waist: "", arms: "", legs: "" });
  };

  const deleteEntry = async (id) => {
    await api.delete(`/progress/${id}`);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const chartData = [...entries]
    .reverse()
    .map((e) => ({
      date: new Date(e.date).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      }),
      weight: e.weight,
    }))
    .filter((e) => e.weight);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Progress</h1>
        <p className="text-gray-500 text-sm mt-1">
          Log measurements and watch the trend.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Chart */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="font-semibold text-gray-900 mb-4">Weight evolution</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis domain={["auto", "auto"]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* New Entry */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="font-semibold text-gray-900 mb-4">New entry</p>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600 block mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                ["Chest", "chest"],
                ["Waist", "waist"],
                ["Arms", "arms"],
                ["Legs", "legs"],
              ].map(([label, key]) => (
                <div key={key}>
                  <label className="text-sm text-gray-600 block mb-1">
                    {label}
                  </label>
                  <input
                    type="number"
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={addEntry}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              + Add entry
            </button>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mt-4">
        <div className="p-5 border-b border-gray-100">
          <p className="font-semibold text-gray-900">History</p>
        </div>
        {entries.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            No entries yet. Add your first measurement!
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {entries.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between px-5 py-4"
              >
                <p className="text-sm text-gray-500">
                  {new Date(e.date).toLocaleDateString("en-US", {
                    month: "numeric",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {e.weight} kg
                </p>
                <button
                  onClick={() => deleteEntry(e.id)}
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
