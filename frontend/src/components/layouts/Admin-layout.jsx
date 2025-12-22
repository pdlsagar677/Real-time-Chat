import { useState, useEffect } from "react";
import { NavLink, Outlet, Navigate, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Image as BannerIcon,
  BarChart3,
  Settings,
  Shield,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

const AdminLayout = () => {
  const { authUser, isCheckingAuth, logout } = useAuthStore();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState("home");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const tabs = [
    { key: "home", label: "Dashboard", icon: Home, path: "/admin/home" },
    { key: "users", label: "Users", icon: Users, path: "/admin/users" },
    { key: "analytics", label: "Analytics", icon: BarChart3, path: "/admin/analytics" },
    { key: "banner", label: "Banner", icon: BannerIcon, path: "/admin/banner" },
    { key: "settings", label: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  const stats = [
    { label: "Total Users", value: "1,234", change: "+12%", icon: <Users className="w-5 h-5" />, color: "bg-blue-500" },
    { label: "Active Today", value: "856", change: "+8%", icon: <Users className="w-5 h-5" />, color: "bg-green-500" },
    { label: "New Messages", value: "342", change: "+23%", icon: <Bell className="w-5 h-5" />, color: "bg-purple-500" },
    { label: "Storage Used", value: "78%", change: "+5%", icon: <BarChart3 className="w-5 h-5" />, color: "bg-orange-500" },
  ];

  const recentActivities = [
    { user: "John Doe", action: "created new account", time: "5 min ago" },
    { user: "Sarah Smith", action: "updated profile", time: "15 min ago" },
    { user: "Mike Johnson", action: "sent message", time: "25 min ago" },
    { user: "Emily Brown", action: "joined group", time: "1 hour ago" },
    { user: "Alex Wilson", action: "changed password", time: "2 hours ago" },
  ];

  useEffect(() => {
    const currentTab = tabs.find((tab) =>
      location.pathname.startsWith(tab.path)
    );
    if (currentTab) {
      setSelectedTab(currentTab.key);
    }
  }, [location.pathname]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!authUser?.isAdmin) return <Navigate to="/" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
            <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
            <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              <Shield className="w-4 h-4" />
              <span>Administrator</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarCollapsed ? "w-20" : "w-64"
          } bg-white border-r border-gray-200 h-[calc(100vh-73px)] transition-all duration-300`}
        >
          <div className="p-4 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <NavLink
                  key={tab.key}
                  to={tab.path}
                  onClick={() => setSelectedTab(tab.key)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                     ${
                       isActive
                         ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border-l-4 border-blue-500"
                         : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                     }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-5 h-5 ${
                          isActive ? "text-blue-500" : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`font-medium ${
                          isSidebarCollapsed ? "hidden" : ""
                        }`}
                      >
                        {tab.label}
                      </span>
                    </>
                  )}
                </NavLink>
              );
            })}

            <button
              onClick={logout}
              className={`mt-8 flex items-center gap-3 p-3 w-full text-left hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors ${
                isSidebarCollapsed ? "justify-center" : ""
              }`}
            >
              <LogOut className="w-5 h-5 text-gray-400" />
              <span className={`${isSidebarCollapsed ? "hidden" : ""}`}>
                Sign Out
              </span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {location.pathname === "/admin" ||
          location.pathname === "/admin/home" ? (
            <>
              <h1 className="text-3xl font-bold mb-6">
                Welcome back, {authUser?.fullName?.split(" ")[0] || "Admin"}!
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border p-6 shadow-sm"
                  >
                    <div className="flex justify-between mb-4">
                      <div className={`p-2 ${stat.color} rounded-lg`}>
                        {stat.icon}
                      </div>
                      <span className="text-sm font-medium text-green-600">
                        {stat.change}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
