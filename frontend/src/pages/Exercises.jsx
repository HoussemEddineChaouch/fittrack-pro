import { useEffect, useState } from "react";
import api from "../api/axios";
import { Heart, Search, X, ChevronRight } from "lucide-react";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Chest", value: "chest" },
  { label: "Back", value: "back" },
  { label: "Legs", value: "upper legs" },
  { label: "Arms", value: "upper arms" },
  { label: "Shoulders", value: "shoulders" },
  { label: "Cardio", value: "cardio" },
  { label: "Waist", value: "waist" },
];

export default function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [selected, setSelected] = useState(null); // for detail modal

  // Load favorites once
  useEffect(() => {
    api
      .get("/favorites")
      .then((r) => setFavorites(r.data.map((f) => f.exercise_id)))
      .catch(() => {});
  }, []);

  // Load exercises when filter or search changes
  useEffect(() => {
    setLoading(true);
    const params = {};
    if (filter !== "all") params.bodyPart = filter;
    if (search) params.search = search;

    api
      .get("/exercises", { params })
      .then((r) => {
        setExercises(r.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filter, search]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const toggleFav = async (e, ex) => {
    e.stopPropagation();
    const isFav = favorites.includes(ex.id);
    try {
      if (isFav) {
        await api.delete(`/favorites/${ex.id}`);
        setFavorites((prev) => prev.filter((id) => id !== ex.id));
      } else {
        await api.post("/favorites", {
          exercise_id: ex.id,
          exercise_name: ex.name,
          exercise_data: JSON.stringify(ex),
        });
        setFavorites((prev) => [...prev, ex.id]);
      }
    } catch (err) {
      console.error("Favorite error:", err);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Exercises</h1>
        <p className="text-gray-500 text-sm mt-1">
          Browse the library, save favorites, build plans.
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-64">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, muscle, equipment..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                filter === f.value
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-400 text-sm">Loading exercises...</p>
          </div>
        </div>
      ) : exercises.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p>No exercises found. Try a different search or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {exercises.map((ex) => (
            <div
              key={ex.id}
              onClick={() => setSelected(ex)}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition cursor-pointer"
            >
              <div className="relative">
                <img
                  src={
                    ex.image ||
                    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400"
                  }
                  alt={ex.name}
                  className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=400";
                  }}
                />
                <button
                  onClick={(e) => toggleFav(e, ex)}
                  className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition z-10"
                >
                  <Heart
                    size={15}
                    className={
                      favorites.includes(ex.id)
                        ? "fill-blue-600 text-blue-600"
                        : "text-gray-400"
                    }
                  />
                </button>
                {/* GIF badge */}
                {ex.image && ex.image.includes(".gif") && (
                  <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                    GIF
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
                  {ex.name}
                </p>
                <p className="text-xs text-gray-400 mb-2">
                  {ex.muscle} · {ex.equipment}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1.5 flex-wrap">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {ex.category}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {ex.difficulty}
                    </span>
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-gray-300 group-hover:text-blue-500 transition"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Exercise Detail Modal ── */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
          }}
        >
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {selected.name}
                </h2>
                <p className="text-sm text-gray-400">
                  {selected.category} · {selected.muscle}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => toggleFav(e, selected)}
                  className="w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition"
                >
                  <Heart
                    size={16}
                    className={
                      favorites.includes(selected.id)
                        ? "fill-blue-600 text-blue-600"
                        : "text-gray-400"
                    }
                  />
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1">
              <div className="flex flex-col md:flex-row gap-0">
                {/* GIF / Image */}
                <div className="md:w-80 bg-gray-50 flex items-center justify-center p-6 flex-shrink-0">
                  <img
                    src={
                      selected.image ||
                      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400"
                    }
                    alt={selected.name}
                    className="w-full max-w-xs rounded-xl object-contain"
                    style={{ maxHeight: "280px" }}
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=400";
                    }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 p-6">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {[
                      {
                        label: selected.category,
                        color: "bg-blue-50 text-blue-700",
                      },
                      {
                        label: selected.muscle,
                        color: "bg-green-50 text-green-700",
                      },
                      {
                        label: selected.equipment,
                        color: "bg-purple-50 text-purple-700",
                      },
                      {
                        label: selected.difficulty,
                        color: "bg-orange-50 text-orange-700",
                      },
                    ].map(({ label, color }) => (
                      <span
                        key={label}
                        className={`text-xs font-medium px-3 py-1 rounded-full ${color}`}
                      >
                        {label}
                      </span>
                    ))}
                  </div>

                  {/* Secondary Muscles */}
                  {selected.secondaryMuscles?.length > 0 && (
                    <div className="mb-5">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Secondary Muscles
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {selected.secondaryMuscles.map((m) => (
                          <span
                            key={m}
                            className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full capitalize"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Instructions */}
                  {selected.instructions?.length > 0 ? (
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-3">
                        Instructions
                      </p>
                      <ol className="space-y-3">
                        {selected.instructions.map((step, i) => (
                          <li key={i} className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                              {i + 1}
                            </span>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {step}
                            </p>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400 italic">
                      No instructions available for this exercise.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelected(null)}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
