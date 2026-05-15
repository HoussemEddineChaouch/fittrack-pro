import { useEffect, useState } from "react";
import api from "../api/axios";
import { Trash2, X, Plus } from "lucide-react";

const CATEGORIES = [
  "Push Pull Legs",
  "Full Body",
  "Upper Lower",
  "Cardio",
  "Custom",
];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editPlan, setEditPlan] = useState(null);
  const [form, setForm] = useState({
    name: "",
    goal: "",
    description: "",
    category: "Push Pull Legs",
    difficulty: "Intermediate",
    duration: 45,
  });
  const [exForm, setExForm] = useState({
    exercise_id: "",
    exercise_name: "",
    sets: 3,
    reps: 10,
    rest_seconds: 60,
  });
  const [addingEx, setAddingEx] = useState(false);
  const [creatingPlan, setCreatingPlan] = useState(false);

  useEffect(() => {
    api
      .get("/plans")
      .then((r) => setPlans(r.data))
      .catch(() => {});
    api
      .get("/exercises")
      .then((r) => setExercises(r.data))
      .catch(() => {});
  }, []);

  const createPlan = async (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (!form.name.trim()) return;
    setCreatingPlan(true);
    try {
      const res = await api.post("/plans", form);
      setPlans((prev) => [...prev, { ...res.data, exercises: [] }]);
      setShowCreate(false);
      setForm({
        name: "",
        goal: "",
        description: "",
        category: "Push Pull Legs",
        difficulty: "Intermediate",
        duration: 45,
      });
    } catch (err) {
      console.error("Create plan error:", err);
    } finally {
      setCreatingPlan(false);
    }
  };

  const deletePlan = async (id) => {
    try {
      await api.delete(`/plans/${id}`);
      setPlans((prev) => prev.filter((p) => p.id !== id));
      if (editPlan?.id === id) setEditPlan(null);
    } catch (err) {
      console.error("Delete plan error:", err);
    }
  };

  const addExercise = async (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (!exForm.exercise_id || !editPlan) return;
    setAddingEx(true);
    try {
      const res = await api.post(`/plans/${editPlan.id}/exercises`, exForm);
      const updated = {
        ...editPlan,
        exercises: [...(editPlan.exercises || []), res.data],
      };
      setEditPlan(updated);
      setPlans((prev) => prev.map((p) => (p.id === editPlan.id ? updated : p)));
      setExForm({
        exercise_id: "",
        exercise_name: "",
        sets: 3,
        reps: 10,
        rest_seconds: 60,
      });
    } catch (err) {
      console.error("Add exercise error:", err);
    } finally {
      setAddingEx(false);
    }
  };

  const removeExercise = async (planId, exId) => {
    try {
      await api.delete(`/plans/${planId}/exercises/${exId}`);
      const updated = {
        ...editPlan,
        exercises: editPlan.exercises.filter((e) => e.id !== exId),
      };
      setEditPlan(updated);
      setPlans((prev) => prev.map((p) => (p.id === planId ? updated : p)));
    } catch (err) {
      console.error("Remove exercise error:", err);
    }
  };

  const selectExercise = (e) => {
    const ex = exercises.find((x) => x.id === e.target.value);
    if (ex) {
      setExForm((prev) => ({
        ...prev,
        exercise_id: ex.id,
        exercise_name: ex.name,
      }));
    }
  };

  const openEdit = (plan) => {
    setEditPlan({ ...plan, exercises: plan.exercises || [] });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workout Plans</h1>
          <p className="text-gray-500 text-sm mt-1">
            Build and manage your training programs.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          <Plus size={16} /> New plan
        </button>
      </div>

      {/* Plans Grid */}
      {plans.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p>No plans yet. Create your first workout plan!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900">{plan.name}</p>
                  <p className="text-sm text-gray-400">{plan.goal}</p>
                </div>
                <button
                  onClick={() => deletePlan(plan.id)}
                  className="text-gray-400 hover:text-red-500 transition p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                {plan.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                  {plan.category}
                </span>
                <span className="text-xs border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                  {plan.difficulty}
                </span>
                <span className="text-xs border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                  {plan.duration} min
                </span>
                <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                  {plan.exercises?.length || 0} exercises
                </span>
              </div>
              <button
                onClick={() => openEdit(plan)}
                className="w-full py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                Edit exercises
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Create Plan Modal ── */}
      {showCreate && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCreate(false);
          }}
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">
                Create workout plan
              </h2>
              <button
                onClick={() => setShowCreate(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Plan name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Push/Pull/Legs"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Goal
                </label>
                <input
                  type="text"
                  value={form.goal}
                  onChange={(e) => setForm({ ...form, goal: e.target.value })}
                  placeholder="e.g. Gain Weight"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                  placeholder="Describe your plan..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Difficulty
                  </label>
                  <select
                    value={form.difficulty}
                    onChange={(e) =>
                      setForm({ ...form, difficulty: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {DIFFICULTIES.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    value={form.duration}
                    onChange={(e) =>
                      setForm({ ...form, duration: +e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button
                onClick={createPlan}
                disabled={creatingPlan || !form.name.trim()}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
              >
                {creatingPlan ? "Creating..." : "Create plan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Exercises Modal ── */}
      {editPlan && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditPlan(null);
          }}
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                {editPlan.name}
              </h2>
              <button
                onClick={() => setEditPlan(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Add Exercise Row */}
            <p className="text-sm font-medium text-gray-700 mb-2">
              Add exercise
            </p>
            <div className="flex gap-2 mb-4">
              <select
                value={exForm.exercise_id}
                onChange={selectExercise}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
              >
                <option value="">Select exercise</option>
                {exercises.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={exForm.sets}
                onChange={(e) =>
                  setExForm({ ...exForm, sets: +e.target.value })
                }
                placeholder="Sets"
                min={1}
                className="w-14 border border-gray-300 rounded-lg px-2 py-2.5 text-sm text-center outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                value={exForm.reps}
                onChange={(e) =>
                  setExForm({ ...exForm, reps: +e.target.value })
                }
                placeholder="Reps"
                min={1}
                className="w-14 border border-gray-300 rounded-lg px-2 py-2.5 text-sm text-center outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                value={exForm.rest_seconds}
                onChange={(e) =>
                  setExForm({ ...exForm, rest_seconds: +e.target.value })
                }
                placeholder="Rest"
                min={0}
                className="w-14 border border-gray-300 rounded-lg px-2 py-2.5 text-sm text-center outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addExercise}
                disabled={addingEx || !exForm.exercise_id}
                className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition disabled:opacity-50 flex-shrink-0"
              >
                {addingEx ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Plus size={18} />
                )}
              </button>
            </div>

            {/* Exercise List */}
            <div className="flex-1 overflow-y-auto space-y-2 min-h-[100px]">
              {!editPlan.exercises || editPlan.exercises.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm border border-dashed border-gray-200 rounded-lg">
                  No exercises yet. Add one above!
                </div>
              ) : (
                editPlan.exercises.map((ex) => (
                  <div
                    key={ex.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {ex.exercise_name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {ex.sets} × {ex.reps} · {ex.rest_seconds}s rest
                      </p>
                    </div>
                    <button
                      onClick={() => removeExercise(editPlan.id, ex.id)}
                      className="text-gray-400 hover:text-red-500 transition p-1"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setEditPlan(null)}
              className="w-full mt-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
