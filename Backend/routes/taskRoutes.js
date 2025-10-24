import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controller/taskManagerController.js";

const router = express.Router();

router.post("/api/tasks", createTask);
router.get("/api/tasks", getTasks);
router.put("/api/tasks/:id", updateTask);
router.delete("/api/tasks/:id", deleteTask);

export default router;
