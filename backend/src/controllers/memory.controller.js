import Memory from "../models/Memory.js";

// Get all memories from friends and current user
export async function getMemories(req, res) {
  try {
    const currentUser = req.user;
    
    // Get memories from current user and their friends
    const memories = await Memory.find({
      user: { $in: [currentUser._id, ...currentUser.friends] }
    })
    .populate("user", "fullName profilePic")
    .populate("comments.user", "fullName profilePic")
    .populate("likes", "fullName")
    .sort({ createdAt: -1 })
    .limit(50);

    res.status(200).json(memories);
  } catch (error) {
    console.error("Error in getMemories controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Create a new memory
export async function createMemory(req, res) {
  try {
    const { content, image } = req.body;
    const userId = req.user._id;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Content is required" });
    }

    const newMemory = await Memory.create({
      user: userId,
      content: content.trim(),
      image: image || null,
    });

    const populatedMemory = await Memory.findById(newMemory._id)
      .populate("user", "fullName profilePic")
      .populate("comments.user", "fullName profilePic")
      .populate("likes", "fullName");

    res.status(201).json(populatedMemory);
  } catch (error) {
    console.error("Error in createMemory controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Like/unlike a memory
export async function toggleLikeMemory(req, res) {
  try {
    const { memoryId } = req.params;
    const userId = req.user._id;

    const memory = await Memory.findById(memoryId);
    if (!memory) {
      return res.status(404).json({ message: "Memory not found" });
    }

    const isLiked = memory.likes.includes(userId);
    
    if (isLiked) {
      // Unlike
      memory.likes = memory.likes.filter(id => id.toString() !== userId.toString());
    } else {
      // Like
      memory.likes.push(userId);
    }

    await memory.save();

    const updatedMemory = await Memory.findById(memoryId)
      .populate("user", "fullName profilePic")
      .populate("comments.user", "fullName profilePic")
      .populate("likes", "fullName");

    res.status(200).json(updatedMemory);
  } catch (error) {
    console.error("Error in toggleLikeMemory controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Add a comment to a memory
export async function addComment(req, res) {
  try {
    const { memoryId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    const memory = await Memory.findById(memoryId);
    if (!memory) {
      return res.status(404).json({ message: "Memory not found" });
    }

    memory.comments.push({
      user: userId,
      content: content.trim(),
    });

    await memory.save();

    const updatedMemory = await Memory.findById(memoryId)
      .populate("user", "fullName profilePic")
      .populate("comments.user", "fullName profilePic")
      .populate("likes", "fullName");

    res.status(201).json(updatedMemory);
  } catch (error) {
    console.error("Error in addComment controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Delete a memory (only by the author)
export async function deleteMemory(req, res) {
  try {
    const { memoryId } = req.params;
    const userId = req.user._id;

    const memory = await Memory.findById(memoryId);
    if (!memory) {
      return res.status(404).json({ message: "Memory not found" });
    }

    // Check if user is the author
    if (memory.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You can only delete your own memories" });
    }

    await Memory.findByIdAndDelete(memoryId);
    res.status(200).json({ message: "Memory deleted successfully" });
  } catch (error) {
    console.error("Error in deleteMemory controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get memories by a specific user
export async function getUserMemories(req, res) {
  try {
    const { userId } = req.params;
    
    const memories = await Memory.find({ user: userId })
      .populate("user", "fullName profilePic")
      .populate("comments.user", "fullName profilePic")
      .populate("likes", "fullName")
      .sort({ createdAt: -1 });

    res.status(200).json(memories);
  } catch (error) {
    console.error("Error in getUserMemories controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
