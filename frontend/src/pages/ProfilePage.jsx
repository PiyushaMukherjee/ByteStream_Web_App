import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Heart, MessageCircle, Users, Globe, Star, UserPlus, UserCheck } from "lucide-react";
import { Link } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import PageLoader from "../components/PageLoader";
import { getUserFriends, getRecommendedUsers } from "../lib/api";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser } = useAuthUser();
  const [activeTab, setActiveTab] = useState("friends");

  // Get user's friends
  const { data: friends = [], isLoading: friendsLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  // Get recommended users to find mutual friends
  const { data: recommendedUsers = [], isLoading: recommendedLoading } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: getRecommendedUsers,
  });

  // Mock data for languages and hobbies - you can extend the user model to include these
  const userLanguages = ["English", "Spanish", "French"];
  const userHobbies = ["Reading", "Traveling", "Cooking", "Photography"];

  // Calculate mutual friends
  const mutualFriends = recommendedUsers.filter(user => 
    friends.some(friend => friend._id === user._id)
  );

  if (friendsLoading || recommendedLoading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-base-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="card bg-base-200 mb-8">
          <div className="card-body">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="avatar">
                <div className="w-32 h-32 rounded-full ring-4 ring-primary/20">
                  <img 
                    src={authUser?.profilePic} 
                    alt={authUser?.fullName}
                    onError={(e) => {
                      e.target.src = `https://api.dicebear.com/9.x/lorelei/svg?seed=${authUser?._id}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
                    }}
                  />
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{authUser?.fullName}</h1>
                <p className="text-base-content opacity-70 mb-4">Language Learning Enthusiast</p>
                
                {/* Stats */}
                <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{friends.length}</div>
                    <div className="text-sm opacity-70">Friends</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">{userLanguages.length}</div>
                    <div className="text-sm opacity-70">Languages</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{userHobbies.length}</div>
                    <div className="text-sm opacity-70">Hobbies</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <button className="btn btn-primary btn-sm">
                    <MessageCircle className="size-4 mr-2" />
                    Edit Profile
                  </button>
                  <Link to="/memories" className="btn btn-outline btn-sm">
                    <Heart className="size-4 mr-2" />
                    My Memories
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Languages & Hobbies Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Languages */}
          <div className="card bg-base-200">
            <div className="card-body">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="size-5 text-primary" />
                <h3 className="text-lg font-semibold">Languages</h3>
              </div>
              <div className="space-y-3">
                {userLanguages.map((language, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-base-300 rounded-lg">
                    <span className="font-medium">{language}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`size-4 ${star <= 3 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hobbies */}
          <div className="card bg-base-200">
            <div className="card-body">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="size-5 text-secondary" />
                <h3 className="text-lg font-semibold">Hobbies & Interests</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {userHobbies.map((hobby, index) => (
                  <span 
                    key={index} 
                    className="badge badge-outline badge-lg"
                  >
                    {hobby}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Friends & Mutual Friends Tabs */}
        <div className="card bg-base-200">
          <div className="card-body">
            {/* Tab Navigation */}
            <div className="tabs tabs-boxed mb-6">
              <button 
                className={`tab ${activeTab === 'friends' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('friends')}
              >
                <Users className="size-4 mr-2" />
                Friends ({friends.length})
              </button>
              <button 
                className={`tab ${activeTab === 'mutual' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('mutual')}
              >
                <UserCheck className="size-4 mr-2" />
                Mutual Friends ({mutualFriends.length})
              </button>
            </div>

            {/* Friends Tab */}
            {activeTab === 'friends' && (
              <div>
                {friends.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="size-16 mx-auto mb-4 text-primary opacity-50" />
                    <h3 className="font-semibold text-lg mb-2">No friends yet</h3>
                    <p className="text-base-content opacity-70 mb-6">
                      Start connecting with other language learners!
                    </p>
                    <Link to="/" className="btn btn-primary">
                      Find Friends
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {friends.map((friend) => (
                      <div key={friend._id} className="card bg-base-300">
                        <div className="card-body p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="avatar">
                              <div className="w-12 h-12 rounded-full">
                                <img 
                                  src={friend.profilePic} 
                                  alt={friend.fullName}
                                  onError={(e) => {
                                    e.target.src = `https://api.dicebear.com/9.x/lorelei/svg?seed=${friend._id}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
                                  }}
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{friend.fullName}</h4>
                              <p className="text-sm opacity-70">Language Partner</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Link 
                              to={`/chat/${friend._id}`} 
                              className="btn btn-primary btn-sm flex-1"
                            >
                              <MessageCircle className="size-4 mr-1" />
                              Chat
                            </Link>
                            <button className="btn btn-outline btn-sm">
                              <UserPlus className="size-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Mutual Friends Tab */}
            {activeTab === 'mutual' && (
              <div>
                {mutualFriends.length === 0 ? (
                  <div className="text-center py-12">
                    <UserCheck className="size-16 mx-auto mb-4 text-secondary opacity-50" />
                    <h3 className="font-semibold text-lg mb-2">No mutual friends yet</h3>
                    <p className="text-base-content opacity-70 mb-6">
                      As you make more friends, you'll see mutual connections here
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mutualFriends.map((friend) => (
                      <div key={friend._id} className="card bg-base-300">
                        <div className="card-body p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="avatar">
                              <div className="w-12 h-12 rounded-full">
                                <img 
                                  src={friend.profilePic} 
                                  alt={friend.fullName}
                                  onError={(e) => {
                                    e.target.src = `https://api.dicebear.com/9.x/lorelei/svg?seed=${friend._id}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
                                  }}
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{friend.fullName}</h4>
                              <p className="text-sm opacity-70">Mutual Friend</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Link 
                              to={`/chat/${friend._id}`} 
                              className="btn btn-primary btn-sm flex-1"
                            >
                              <MessageCircle className="size-4 mr-1" />
                              Chat
                            </Link>
                            <button className="btn btn-outline btn-sm">
                              <UserPlus className="size-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
