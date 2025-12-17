import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { 
  LogOut, 
  MessageSquare, 
  Settings, 
  User, 
  ChevronDown,
  Search,
  Bell,
  Moon,
  Sun,
  X
} from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const { theme, currentTheme } = useThemeStore();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    { id: 1, message: "New message from John", time: "5 min ago", unread: true },
    { id: 2, message: "Meeting at 3 PM", time: "1 hour ago", unread: true },
    { id: 3, message: "Profile updated successfully", time: "2 hours ago", unread: false },
  ]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getUnreadCount = () => {
    return notifications.filter(n => n.unread).length;
  };

  const navItems = [
    { path: "/", label: "Chats", icon: MessageSquare },
    { path: "/groups", label: "Groups" },
    { path: "/contacts", label: "Contacts" },
    { path: "/archive", label: "Archive" },
  ];

  return (
    <>
      <header
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg"
            : "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section - Logo & Navigation */}
            <div className="flex items-center">
              {/* Logo */}
              <Link 
                to="/" 
                className="flex items-center gap-3 group"
                style={{ color: currentTheme.colors.primary }}
              >
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: currentTheme.colors.primary }}
                >
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div className="hidden md:block">
                  <h1 className="text-xl font-bold tracking-tight">Chatty</h1>
                  <p className="text-xs opacity-70">secure messaging</p>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1 ml-10">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      location.pathname === item.path
                        ? "text-white"
                        : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    }`}
                    style={
                      location.pathname === item.path
                        ? { backgroundColor: currentTheme.colors.primary }
                        : {}
                    }
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Center Section - Search (Desktop) */}
            <div className="hidden lg:block flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages, contacts, or groups..."
                  className="w-full pl-12 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-gray-300 dark:focus:border-gray-600 transition-colors"
                />
              </div>
            </div>

            {/* Right Section - User Actions */}
            <div className="flex items-center gap-3">
              {/* Search Button (Mobile) */}
              <button className="lg:hidden p-2 text-gray-600 dark:text-gray-400">
                <Search className="w-5 h-5" />
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {getUnreadCount() > 0 && (
                    <span 
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-medium flex items-center justify-center text-white animate-pulse"
                      style={{ backgroundColor: currentTheme.colors.error }}
                    >
                      {getUnreadCount()}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowNotifications(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            Notifications
                          </h3>
                          <button 
                            onClick={() => setShowNotifications(false)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-4 border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                                notification.unread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                              }`}
                            >
                              <p className="text-sm text-gray-900 dark:text-white">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center">
                            <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 dark:text-gray-400">No notifications</p>
                          </div>
                        )}
                      </div>
                      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <button 
                          className="text-sm font-medium w-full text-center"
                          style={{ color: currentTheme.colors.primary }}
                        >
                          Mark all as read
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Theme Toggle */}
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                {theme === 'midnight' || theme === 'carbon' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              {/* User Menu */}
              {authUser && (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 pl-3 pr-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <div className="relative">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium overflow-hidden"
                        style={{ backgroundColor: currentTheme.colors.primary }}
                      >
                        {authUser.profilePic ? (
                          <img 
                            src={authUser.profilePic} 
                            alt={authUser.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          authUser.fullName?.charAt(0).toUpperCase() || "U"
                        )}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 bg-green-500"></div>
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {authUser.fullName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Online
                      </p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
                      showUserMenu ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                        {/* User Info */}
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium overflow-hidden"
                              style={{ backgroundColor: currentTheme.colors.primary }}
                            >
                              {authUser.profilePic ? (
                                <img 
                                  src={authUser.profilePic} 
                                  alt={authUser.fullName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                authUser.fullName?.charAt(0).toUpperCase() || "U"
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {authUser.fullName}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {authUser.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <Link
                            to="/profile"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors text-gray-700 dark:text-gray-300"
                          >
                            <User className="w-4 h-4" />
                            <span>Profile</span>
                          </Link>
                          <Link
                            to="/settings"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors text-gray-700 dark:text-gray-300"
                          >
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                          </Link>
                          <button
                            onClick={() => {
                              logout();
                              setShowUserMenu(false);
                            }}
                            className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <div className="w-6 h-6 flex flex-col justify-center gap-1">
                  <span className={`h-0.5 w-full bg-current transition-transform ${
                    showMobileMenu ? 'rotate-45 translate-y-1.5' : ''
                  }`} />
                  <span className={`h-0.5 w-full bg-current transition-opacity ${
                    showMobileMenu ? 'opacity-0' : ''
                  }`} />
                  <span className={`h-0.5 w-full bg-current transition-transform ${
                    showMobileMenu ? '-rotate-45 -translate-y-1.5' : ''
                  }`} />
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {showMobileMenu && (
            <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-800">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-gray-300 dark:focus:border-gray-600"
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setShowMobileMenu(false)}
                    className={`px-4 py-3 rounded-lg text-center font-medium transition-colors ${
                      location.pathname === item.path
                        ? "text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    style={
                      location.pathname === item.path
                        ? { backgroundColor: currentTheme.colors.primary }
                        : {}
                    }
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Notifications Overlay */}
      {showNotifications && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setShowNotifications(false)}
        />
      )}
    </>
  );
};

export default Navbar;