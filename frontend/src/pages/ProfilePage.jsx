import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Calendar, Shield, LogOut, Settings, CreditCard, Globe, Bell, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile, logout } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(authUser?.fullName || "");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
      toast.success("Profile picture updated successfully");
    };
  };

  const handleNameUpdate = async () => {
    if (!editName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    await updateProfile({ fullName: editName });
    setIsEditingName(false);
    toast.success("Name updated successfully");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-2">Manage your profile and account preferences</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 sticky top-8">
              {/* Profile Summary */}
              <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-200">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={selectedImg || authUser?.profilePic || "/avatar.png"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full cursor-pointer hover:bg-gray-800 transition-colors shadow-lg"
                  >
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUpdatingProfile}
                    />
                  </label>
                </div>
                <h2 className="font-semibold text-gray-900 text-lg">{authUser?.fullName}</h2>
                <p className="text-gray-500 text-sm mt-1">{authUser?.email}</p>
                <div className="flex flex-col items-center gap-2 mt-3">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    authUser?.isAdmin 
                      ? "bg-purple-100 text-purple-700" 
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {authUser?.isAdmin ? "Admin" : "Premium Member"}
                  </div>
                  
                  {/* Admin Dashboard Button */}
                  {authUser?.isAdmin && (
                    <button
                      onClick={() => (window.location.href = "/admin")}
                      className="mt-2 px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
                      style={{ minWidth: "140px" }}
                    >
                      Admin Dashboard
                    </button>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {[
                  { id: "profile", label: "Profile", icon: User },
                  { id: "security", label: "Security", icon: Shield },
                  { id: "notifications", label: "Notifications", icon: Bell },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === "admin") {
                        window.location.href = "/admin";
                      } else {
                        setActiveTab(item.id);
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeTab === item.id
                        ? "bg-black text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    } ${item.id === "admin" ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700" : ""}`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 mt-8 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
                  
                  {/* Admin Badge */}
                  {authUser?.isAdmin && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-6 h-6 text-purple-600" />
                        <div>
                          <h3 className="font-semibold text-purple-700">Administrator Account</h3>
                          <p className="text-sm text-purple-600">You have access to admin dashboard and special permissions.</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Personal Info Card */}
                  <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Personal Information
                    </h3>
                    
                    <div className="space-y-6">
                      {/* Name Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        {isEditingName ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                              autoFocus
                            />
                            <button
                              onClick={handleNameUpdate}
                              className="px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setIsEditingName(false);
                                setEditName(authUser?.fullName || "");
                              }}
                              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <p className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                              {authUser?.fullName}
                            </p>
                            <button
                              onClick={() => setIsEditingName(true)}
                              className="ml-4 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Email Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email Address
                        </label>
                        <div className="flex items-center justify-between">
                          <p className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                            {authUser?.email}
                          </p>
                          <button className="ml-4 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg opacity-50 cursor-not-allowed font-medium">
                            Edit
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          To change your email, please contact support
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Account Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-gray-900 to-black text-white p-6 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <Calendar className="w-5 h-5 text-gray-300" />
                        <span className="text-sm font-medium text-gray-300">Joined</span>
                      </div>
                      <div className="text-2xl font-bold">
                        {formatDate(authUser?.createdAt)}
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <Globe className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-600">Timezone</span>
                      </div>
                      <div className="text-xl font-semibold text-gray-900">
                        GMT {new Date().getTimezoneOffset() / -60}
                      </div>
                      <button className="mt-4 text-sm text-gray-600 hover:text-black transition-colors">
                        Update timezone
                      </button>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <Shield className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-gray-600">Status</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xl font-semibold text-gray-900">Active</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        {authUser?.isAdmin ? "Admin • Verified" : "Verified account"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
                <div className="space-y-6">
                  <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                    <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
                      Update Password
                    </button>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication</h3>
                    <p className="text-gray-600 mb-4">Add an extra layer of security to your account</p>
                    <button className="px-6 py-3 border border-black text-black rounded-lg hover:bg-gray-50 transition-colors font-medium">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
                <div className="space-y-6">
                  {["New Messages", "Group Notifications", "Email Updates", "Marketing Emails"].map((item) => (
                    <div key={item} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="font-medium">{item}</span>
                      <div className="relative">
                        <input type="checkbox" className="sr-only" id={item} />
                        <label
                          htmlFor={item}
                          className="block w-12 h-6 bg-gray-300 rounded-full cursor-pointer"
                        >
                          <span className="block w-5 h-5 bg-white rounded-full transform translate-x-1 transition-transform"></span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upload Progress Indicator */}
        {isUpdatingProfile && (
          <div className="fixed bottom-8 right-8 bg-black text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-pulse">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Updating profile...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;