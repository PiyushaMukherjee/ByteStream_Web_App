import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, MessageCircle, Send, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import useAuthUser from "../hooks/useAuthUser";
import PageLoader from "../components/PageLoader";
import { getMemories, createMemory, toggleLikeMemory, addComment, deleteMemory } from "../lib/api";

const MemoriesPage = () => {
  const [newMemory, setNewMemory] = useState({ content: "", image: null });
  const [commentText, setCommentText] = useState("");
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [selectedMemoryForLikes, setSelectedMemoryForLikes] = useState(null);
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  // Get memories from API
  const { data: memories = [], isLoading } = useQuery({
    queryKey: ["memories"],
    queryFn: getMemories,
  });

  const createMemoryMutation = useMutation({
    mutationFn: createMemory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memories"] });
      setNewMemory({ content: "", image: null });
      toast.success("Memory posted successfully!");
    },
    onError: () => {
      toast.error("Failed to post memory");
    }
  });

  const likeMemoryMutation = useMutation({
    mutationFn: toggleLikeMemory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memories"] });
    }
  });

  const commentMemoryMutation = useMutation({
    mutationFn: ({ memoryId, content }) => addComment(memoryId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memories"] });
      setCommentText("");
      setSelectedMemory(null);
      toast.success("Comment added successfully!");
    },
    onError: () => {
      toast.error("Failed to add comment");
    }
  });

  const deleteMemoryMutation = useMutation({
    mutationFn: deleteMemory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memories"] });
      toast.success("Memory deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete memory");
    }
  });

  const handleSubmitMemory = (e) => {
    e.preventDefault();
    if (!newMemory.content.trim()) {
      toast.error("Please write something to share!");
      return;
    }
    createMemoryMutation.mutate(newMemory);
  };

  const handleLike = (memoryId) => {
    likeMemoryMutation.mutate(memoryId);
  };

  const handleComment = (memoryId) => {
    if (!commentText.trim()) {
      toast.error("Please write a comment!");
      return;
    }
    commentMemoryMutation.mutate({ memoryId, content: commentText });
  };

  const handleShowLikes = (memory) => {
    setSelectedMemoryForLikes(memory);
    setShowLikesModal(true);
  };

  const handleCloseLikesModal = () => {
    setShowLikesModal(false);
    setSelectedMemoryForLikes(null);
  };

  const isLiked = (memory) => {
    return memory.likes.includes(authUser?._id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-base-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Memories</h1>
          <p className="text-base-content opacity-70">
            Share your language learning journey with friends
          </p>
        </div>

        {/* Create Memory Section */}
        <div className="card bg-base-200 mb-8">
          <div className="card-body">
            <h3 className="card-title mb-4">Share a Memory</h3>
            <form onSubmit={handleSubmitMemory}>
              <textarea
                className="textarea textarea-bordered w-full h-24 mb-4"
                placeholder="What's on your mind? Share your language learning experience..."
                value={newMemory.content}
                onChange={(e) => setNewMemory({ ...newMemory, content: e.target.value })}
              />
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  {/* Photo upload option removed */}
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={createMemoryMutation.isPending}
                >
                  {createMemoryMutation.isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Posting...
                    </>
                  ) : (
                    "Post Memory"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Memories Feed */}
        <div className="space-y-6">
          {memories.map((memory) => (
            <div key={memory._id} className="card bg-base-200">
              <div className="card-body">
                {/* Memory Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <img 
                        src={memory.user.profilePic} 
                        alt={memory.user.fullName}
                        onError={(e) => {
                          e.target.src = `https://api.dicebear.com/9.x/lorelei/svg?seed=${memory.user._id}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{memory.user.fullName}</h4>
                    <p className="text-sm opacity-70">{formatDate(memory.createdAt)}</p>
                  </div>
                </div>

                {/* Memory Content */}
                <p className="mb-4">{memory.content}</p>

                {/* Memory Image (if any) */}
                {memory.image && (
                  <div className="mb-4">
                    <img src={memory.image} alt="Memory" className="rounded-lg max-w-full" />
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={() => handleLike(memory._id)}
                    className={`flex items-center gap-2 btn btn-ghost btn-sm ${
                      isLiked(memory) ? "text-red-500" : ""
                    }`}
                  >
                    <Heart className={`size-4 ${isLiked(memory) ? "fill-current" : ""}`} />
                    <span>{memory.likes.length}</span>
                  </button>
                  {memory.likes.length > 0 && (
                    <button
                      onClick={() => handleShowLikes(memory)}
                      className="text-sm text-base-content opacity-70 hover:opacity-100 transition-opacity"
                    >
                      {memory.likes.length === 1 ? "1 like" : `${memory.likes.length} likes`}
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedMemory(selectedMemory === memory._id ? null : memory._id)}
                    className="flex items-center gap-2 btn btn-ghost btn-sm"
                  >
                    <MessageCircle className="size-4" />
                    <span>{memory.comments.length}</span>
                  </button>
                </div>

                {/* Comments Section */}
                {selectedMemory === memory._id && (
                  <div className="border-t pt-4">
                    {/* Add Comment */}
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        className="input input-bordered flex-1"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleComment(memory._id)}
                      />
                      <button
                        onClick={() => handleComment(memory._id)}
                        className="btn btn-primary btn-sm"
                        disabled={commentMemoryMutation.isPending}
                      >
                        <Send className="size-4" />
                      </button>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-3">
                      {memory.comments.map((comment) => (
                        <div key={comment._id} className="flex gap-3">
                          <div className="avatar">
                            <div className="w-8 rounded-full">
                              <img 
                                src={comment.user.profilePic} 
                                alt={comment.user.fullName}
                                onError={(e) => {
                                  e.target.src = `https://api.dicebear.com/9.x/lorelei/svg?seed=${comment.user._id}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex-1 bg-base-300 rounded-lg p-3">
                            <div className="flex justify-between items-start mb-1">
                              <h5 className="font-semibold text-sm">{comment.user.fullName}</h5>
                              <span className="text-xs opacity-70">{formatDate(comment.createdAt)}</span>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {memories.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Heart className="size-16 mx-auto mb-4 text-primary opacity-50" />
              <h3 className="font-semibold text-lg mb-2">No memories yet</h3>
              <p className="text-base-content opacity-70 mb-6">
                Be the first to share your language learning journey!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Likes Modal */}
      {showLikesModal && selectedMemoryForLikes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-200 rounded-lg max-w-md w-full max-h-96 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-base-300">
              <h3 className="text-lg font-semibold">Likes</h3>
              <button
                onClick={handleCloseLikesModal}
                className="btn btn-ghost btn-sm btn-circle"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-80">
              {selectedMemoryForLikes.likes.length === 0 ? (
                <p className="text-center text-base-content opacity-70 py-8">
                  No likes yet
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedMemoryForLikes.likes.map((user) => (
                    <div key={user._id} className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-10 rounded-full">
                          <img 
                            src={user.profilePic || `https://api.dicebear.com/9.x/lorelei/svg?seed=${user._id}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`} 
                            alt={user.fullName}
                            onError={(e) => {
                              e.target.src = `https://api.dicebear.com/9.x/lorelei/svg?seed=${user._id}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{user.fullName}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoriesPage;
