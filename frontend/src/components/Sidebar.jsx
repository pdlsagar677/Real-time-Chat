import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search, MoreVertical, Circle, CircleDot } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    // Ensure users is an array before filtering
    const usersArray = Array.isArray(users) ? users : [];
    const onlineUsersArray = Array.isArray(onlineUsers) ? onlineUsers : [];

    let filtered = usersArray;
    
    // Apply online filter
    if (showOnlineOnly) {
      filtered = filtered.filter((user) => 
        user && user._id && onlineUsersArray.includes(user._id)
      );
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((user) => 
        user && (
          (user.fullName && user.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      );
    }

    setFilteredUsers(filtered);
  }, [users, onlineUsers, showOnlineOnly, searchQuery]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Messages</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {filteredUsers.length} conversations
            </p>
          </div>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 focus:border-transparent transition-all text-gray-900 dark:text-white"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowOnlineOnly(!showOnlineOnly)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium ${
              showOnlineOnly
                ? "bg-gray-900 dark:bg-gray-800 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {showOnlineOnly ? (
              <CircleDot className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-gray-400" />
            )}
            Online
          </button>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {Array.isArray(onlineUsers) ? onlineUsers.length - 1 : 0} online
          </span>
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-3">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Recent Conversations
          </h3>
          
          <div className="space-y-1">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                if (!user || !user._id) return null;
                
                const isOnline = Array.isArray(onlineUsers) && onlineUsers.includes(user._id);
                const isSelected = selectedUser?._id === user._id;
                
                return (
                  <button
                    key={user._id}
                    onClick={() => setSelectedUser(user)}
                    className={`w-full p-3 rounded-xl transition-all duration-200 flex items-center gap-3 group ${
                      isSelected
                        ? "bg-gray-100 dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700"
                        : "hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full overflow-hidden ${
                        isOnline ? 'ring-2 ring-green-500' : 'ring-1 ring-gray-200 dark:ring-gray-700'
                      }`}>
                        <img
                          src={user.profilePic || "/avatar.png"}
                          alt={user.fullName || "User"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/avatar.png";
                          }}
                        />
                      </div>
                      {isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-medium truncate ${
                          isSelected 
                            ? 'text-gray-900 dark:text-white' 
                            : 'text-gray-900 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white'
                        }`}>
                          {user.fullName || "Unknown User"}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          12:30
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className={`text-sm truncate ${
                          isSelected 
                            ? 'text-gray-600 dark:text-gray-400' 
                            : 'text-gray-500 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400'
                        }`}>
                          {isOnline ? "Online • Active now" : "Last seen recently"}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Users className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-gray-900 dark:text-white font-medium mb-2">
                  {searchQuery ? "No results found" : "No conversations"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {searchQuery
                    ? "Try searching with a different name"
                    : showOnlineOnly
                    ? "No contacts are currently online"
                    : "Start a new conversation to see it here"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Status */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Active</span>
          </div>
          <span className="font-medium">
            {Array.isArray(users) ? users.length : 0} contacts
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;