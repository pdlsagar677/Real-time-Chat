import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { 
  Users, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Shield,
  ShieldOff,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Filter
} from "lucide-react";

export const AdminUsers = () => {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    if (!authUser) {
      navigate("/login");
    } else if (!authUser.isAdmin) {
      navigate("/");
    } else {
      getAllUsersData();
    }
  }, [authUser, navigate]);

  const getAllUsersData = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/admin/users");
      setUsers(data);
      toast.success("Users loaded successfully");
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id, userName) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete ${userName}?`);
    if (!isConfirmed) return;

    try {
      await axiosInstance.delete(`/admin/users/delete/${id}`);
      setUsers((prev) => prev.filter((user) => user._id !== id));
      toast.success("User deleted successfully!");
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("Failed to delete user");
    }
  };

  const toggleAdminStatus = async (id, currentStatus, userName) => {
    try {
      await axiosInstance.put(`/admin/users/${id}`, { 
        isAdmin: !currentStatus 
      });
      
      setUsers(users.map(user => 
        user._id === id 
          ? { ...user, isAdmin: !currentStatus }
          : user
      ));
      
      toast.success(
        currentStatus 
          ? `${userName} demoted from admin` 
          : `${userName} promoted to admin`
      );
    } catch (err) {
      console.error("Error updating admin status:", err);
      toast.error("Failed to update user");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.includes(searchQuery);
    
    const matchesFilter = 
      selectedFilter === "all" ||
      (selectedFilter === "admin" && user.isAdmin) ||
      (selectedFilter === "user" && !user.isAdmin);
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">Manage all users in the system</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              {users.length} total users
            </span>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>
          
          <div className="flex gap-2">
            {["all", "admin", "user"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                  selectedFilter === filter
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No users found
            </h3>
            <p className="text-gray-600">
              {searchQuery 
                ? "Try a different search term" 
                : "No users match the selected filter"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  {/* User Info */}
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img
                        src={user.profilePic || "/avatar.png"}
                        alt={user.fullName || "User"}
                        className="w-14 h-14 rounded-full border-2 border-gray-200 object-cover"
                      />
                      {user.isAdmin && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                          <Shield className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">
                          {user.fullName || "Unknown User"}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.isAdmin 
                            ? "bg-purple-100 text-purple-700" 
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {user.isAdmin ? "Admin" : "User"}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${
                          user.isActive !== false 
                            ? "bg-green-100 text-green-700" 
                            : "bg-red-100 text-red-700"
                        }`}>
                          {user.isActive !== false ? (
                            <><CheckCircle className="w-3 h-3" /> Active</>
                          ) : (
                            <><XCircle className="w-3 h-3" /> Inactive</>
                          )}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-3 h-3" />
                          <span>{user.email || "No email"}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-3 h-3" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          <span>Joined {formatDate(user.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleAdminStatus(user._id, user.isAdmin, user.fullName)}
                      className={`p-2 rounded-lg transition-colors ${
                        user.isAdmin
                          ? "bg-purple-100 text-purple-600 hover:bg-purple-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      title={user.isAdmin ? "Remove Admin" : "Make Admin"}
                    >
                      {user.isAdmin ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                    </button>
                    
                    <button
                      onClick={() => navigate(`/admin/users/${user._id}/edit`)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      title="Edit User"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => deleteUser(user._id, user.fullName)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};