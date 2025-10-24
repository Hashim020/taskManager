import React, { useState, useEffect } from "react";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import api from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "Pending" | "Completed";
}

interface TaskResponse {
  _id: string;
  title: string;
  description: string;
  status: string;
}

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6; // tasks per page

  const fetchTasks = async (page: number) => {
    try {
      const res = await api.get<{ data: TaskResponse[]; total: number; totalPages: number }>(
        `/api/tasks?page=${page}&limit=${limit}`
      );

      const mappedTasks: Task[] = res.data.data.map((t) => ({
        id: t._id,
        title: t.title,
        description: t.description,
        status: t.status.toLowerCase() === "pending" ? "Pending" : "Completed",
      }));

      setTasks(mappedTasks);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      toast.error("Failed to load tasks!");
    }
  };

  useEffect(() => {
    fetchTasks(page);
  }, [page]);

  const handleSave = async (task: Task) => {
    try {
      if (editingTask) {
        await api.put(`/api/tasks/${editingTask.id}`, task);
        toast.success("Task updated successfully!");
      } else {
        await api.post("/api/tasks", task);
        toast.success("Task created successfully!");
      }
      fetchTasks(page); // refresh current page
    } catch (err) {
      console.error("Failed to save task:", err);
      toast.error("Failed to save task!");
    } finally {
      setIsModalOpen(false);
      setEditingTask(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      toast.success("Task deleted successfully!");
      fetchTasks(page); // refresh current page
    } catch (err) {
      console.error("Failed to delete task:", err);
      toast.error("Failed to delete task!");
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const completedCount = tasks.filter((t) => t.status === "Completed").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Task Manager
            </h1>
            <p className="text-slate-600">
              {tasks.length} tasks · {completedCount} completed
            </p>
          </div>
          <button
            onClick={handleAddNew}
            className="group flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all duration-300 font-medium"
          >
            <svg
              className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Task
          </button>
        </div>

        {/* Task Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.length === 0 && (
            <div className="col-span-full text-center py-16">
              <div className="bg-white rounded-3xl shadow-sm p-12 max-w-md mx-auto border border-slate-100">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">No tasks yet</h3>
                <p className="text-slate-600">Click "Add New Task" to create your first task</p>
              </div>
            </div>
          )}

          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>

        {/* Modal */}
        <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} editingTask={editingTask} />

        {/* Toast */}
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-center items-center mt-6 gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-5 py-2 rounded-xl font-medium shadow-lg transition-all duration-300 ${
              page === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-indigo-500/30 hover:shadow-xl"
            }`}
          >
            Prev
          </button>

          <span className="px-5 py-2 rounded-xl font-medium shadow-lg bg-white border border-slate-200">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className={`px-5 py-2 rounded-xl font-medium shadow-lg transition-all duration-300 ${
              page === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-indigo-500/30 hover:shadow-xl"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
