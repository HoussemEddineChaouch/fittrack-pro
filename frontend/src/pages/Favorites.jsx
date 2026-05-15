import { useEffect, useState } from "react";
import api from "../api/axios";
import { Heart } from "lucide-react";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    api
      .get("/favorites")
      .then((r) => setFavorites(r.data))
      .catch(() => {});
  }, []);

  const remove = async (exerciseId) => {
    await api.delete(`/favorites/${exerciseId}`);
    setFavorites((prev) => prev.filter((f) => f.exercise_id !== exerciseId));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Favorites</h1>
        <p className="text-gray-500 text-sm mt-1">
          Your saved exercises, ready to plan.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Heart size={40} className="mx-auto mb-3 text-gray-300" />
          <p>No favorites yet. Browse exercises and tap the heart!</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {favorites.map((fav) => {
            const ex = JSON.parse(fav.exercise_data || "{}");
            return (
              <div
                key={fav.exercise_id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={
                      ex.image ||
                      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400"
                    }
                    alt={fav.exercise_name}
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=400";
                    }}
                  />
                  <button
                    onClick={() => remove(fav.exercise_id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm"
                  >
                    <Heart size={15} className="fill-blue-600 text-blue-600" />
                  </button>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-gray-900 text-sm mb-1">
                    {fav.exercise_name}
                  </p>
                  <p className="text-xs text-gray-400 mb-2">
                    {ex.muscle} · {ex.equipment}
                  </p>
                  <div className="flex gap-1.5">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {ex.category}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {ex.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
