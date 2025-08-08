import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMemories,
  createMemory,
  toggleLikeMemory,
  addComment,
  deleteMemory,
  getUserMemories,
} from "../controllers/memory.controller.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(protectRoute);

// Get all memories from friends and current user
router.get("/", getMemories);

// Create a new memory
router.post("/", createMemory);

// Like/unlike a memory
router.put("/:memoryId/like", toggleLikeMemory);

// Add a comment to a memory
router.post("/:memoryId/comment", addComment);

// Delete a memory (only by the author)
router.delete("/:memoryId", deleteMemory);

// Get memories by a specific user
router.get("/user/:userId", getUserMemories);

export default router;
