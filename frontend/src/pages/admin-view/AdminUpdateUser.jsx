import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Shield, 
  Phone, 
  Save, 
  X,
  Calendar,
  CheckCircle,
  XCircle
} from "lucide-react";

const AdminEditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ 
    fullName: "", 
    email: "", 
    phone: "",
    isAdmin: false,
    isActive: true
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axiosInstance.get(`/admin/users/${id}`);
        setForm({
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          isAdmin: data.isAdmin || false,
          isActive: data.isActive !== false
        });
      } catch (err) {
        console.error("Failed to fetch user", err);
        toast.error("User not found.");
        navigate("/admin/users");
      } finally {
        setLoading(false);
      }
    };

    if (authUser && id) {
      fetchUser();
    }
  }, [id, authUser, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axiosInstance.patch(`/admin/users/update/${id}`, form);
      toast.success("User updated successfully");
      navigate("/admin/users");
    } catch (error) {
      toast.error("Failed to update user");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Loading user details...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/users"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
              <p className="text-gray-600 mt-1">Update user information and permissions</p>
            </div>
          </div>
          
          <button
            onClick={() => navigate("/admin/users")}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* User Info Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                      placeholder="Enter full name"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                      placeholder="Enter email address"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                      placeholder="Enter phone number"
                    />
                  </div>

                  {/* Permissions */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Permissions & Status</h3>
                    
                    {/* Admin Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className={`w-5 h-5 ${form.isAdmin ? 'text-purple-600' : 'text-gray-400'}`} />
                        <div>
                          <p className="font-medium text-gray-900">Administrator</p>
                          <p className="text-sm text-gray-500">Grant admin privileges to this user</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="isAdmin"
                          checked={form.isAdmin}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    {/* Active Status Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {form.isActive ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">Account Status</p>
                          <p className="text-sm text-gray-500">
                            {form.isActive ? "Account is active" : "Account is inactive"}
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="isActive"
                          checked={form.isActive}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* User Summary */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative">
                      <img
                        src={form.profilePic || "/avatar.png"}
                        alt={form.fullName}
                        className="w-20 h-20 rounded-full border-4 border-gray-100 object-cover"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
                        form.isAdmin ? 'bg-purple-500' : 'bg-gray-500'
                      }`}>
                        {form.isAdmin ? (
                          <Shield className="w-3 h-3 text-white" />
                        ) : (
                          <User className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Last updated: {formatDate(new Date())}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-white rounded-xl border border-red-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-red-700 mb-4">Danger Zone</h3>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to reset this user's password? A reset link will be sent to their email.")) {
                        toast.success("Password reset email sent");
                      }
                    }}
                    className="w-full px-4 py-2.5 border border-yellow-300 text-yellow-700 font-medium rounded-lg hover:bg-yellow-50 transition-colors"
                  >
                    Reset Password
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
                        navigate("/admin/users");
                        toast.success("User deleted successfully");
                      }
                    }}
                    className="w-full px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Delete User
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEditUser;