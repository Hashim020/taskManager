import React, { useState, useEffect } from "react";

interface Task {
  id?: string;
  title: string;
  description: string;
  status: "Pending" | "Completed";
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  editingTask: Task | null;
}

const TaskModal: React.FC<Props> = ({ isOpen, onClose, onSave, editingTask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"Pending" | "Completed">("Pending");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setStatus(editingTask.status);
    } else {
      setTitle("");
      setDescription("");
      setStatus("Pending");
    }
  }, [editingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, description, status });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-2 z-50">
  <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm">
    {/* Header */}
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-t-3xl">
      <h2 className="text-xl font-bold text-white text-center">
        {editingTask ? "Edit Task" : "Create Task"}
      </h2>
    </div>

    {/* Body */}
    <div className="p-4 space-y-3">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Task Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 outline-none text-sm"
          placeholder="Enter title"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 outline-none text-sm resize-none"
          placeholder="Enter description"
          rows={2} // smaller
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Status
        </label>
        <div className="flex gap-2">
          <label className="flex-1">
            <input
              type="radio"
              value="Pending"
              checked={status === "Pending"}
              onChange={(e) => setStatus(e.target.value as "Pending")}
              className="peer sr-only"
            />
            <div className="px-3 py-2 rounded-xl border-2 border-slate-200 cursor-pointer peer-checked:border-amber-500 peer-checked:bg-amber-50 text-center text-sm font-medium transition-all">
              Pending
            </div>
          </label>
          <label className="flex-1">
            <input
              type="radio"
              value="Completed"
              checked={status === "Completed"}
              onChange={(e) => setStatus(e.target.value as "Completed")}
              className="peer sr-only"
            />
            <div className="px-3 py-2 rounded-xl border-2 border-slate-200 cursor-pointer peer-checked:border-emerald-500 peer-checked:bg-emerald-50 text-center text-sm font-medium transition-all">
              Completed
            </div>
          </label>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-3 py-2 rounded-xl border-2 border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium hover:from-indigo-600 hover:to-purple-700 shadow transition-all"
        >
          {editingTask ? "Update" : "Save"}
        </button>
      </div>
    </div>
  </div>
</div>

  );
};

export default TaskModal;