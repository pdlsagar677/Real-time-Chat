import { useState } from "react";
import { useThemeStore, THEMES } from "../store/useThemeStore";
import { 
  Palette, 
  Monitor, 
  Moon, 
  Sun, 
  Check, 
  MessageSquare,
  Send,
  Zap,
  Globe,
  Bell,
  Shield,
  Download,
  Upload
} from "lucide-react";
import toast from "react-hot-toast";

const SettingsPage = () => {
  const { theme, currentTheme, setTheme } = useThemeStore();
  const [activeSection, setActiveSection] = useState("appearance");
  const [autoTheme, setAutoTheme] = useState(false);

  const PREVIEW_MESSAGES = [
    { 
      id: 1, 
      content: "Hey! How's your day going?", 
      isSent: false,
      time: "10:30 AM",
      avatar: "JD"
    },
    { 
      id: 2, 
      content: "Great! Just finished implementing the new design system.", 
      isSent: true,
      time: "10:32 AM",
      avatar: "ME"
    },
    { 
      id: 3, 
      content: "That's awesome! Can't wait to see it in action.", 
      isSent: false,
      time: "10:33 AM",
      avatar: "JD"
    },
    { 
      id: 4, 
      content: "Sure, I'll share the preview link shortly.", 
      isSent: true,
      time: "10:35 AM",
      avatar: "ME"
    },
  ];

  const handleThemeChange = (themeKey) => {
    setTheme(themeKey);
    toast.success(`Theme changed to ${THEMES[themeKey].name}`);
  };

  const handleExportSettings = () => {
    const settings = { theme, autoTheme };
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'nexus-settings.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success("Settings exported successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Customize your Nexus experience to match your style
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
              <nav className="space-y-2">
                {[
                  { id: "appearance", label: "Appearance", icon: Palette },
                  { id: "general", label: "General", icon: Monitor },
                  { id: "notifications", label: "Notifications", icon: Bell },
                  { id: "privacy", label: "Privacy & Security", icon: Shield },
                  { id: "language", label: "Language & Region", icon: Globe },
                  { id: "performance", label: "Performance", icon: Zap },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeSection === item.id
                        ? "bg-black dark:bg-white text-white dark:text-black font-medium"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* Import/Export */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleExportSettings}
                    className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <Upload className="w-4 h-4" />
                    Import
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeSection === "appearance" && (
              <div className="space-y-8">
                {/* Theme Selection */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Theme & Appearance
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Choose a theme that matches your style
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setAutoTheme(!autoTheme)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          autoTheme
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <Monitor className="w-4 h-4" />
                        <span className="text-sm font-medium">Auto</span>
                      </button>
                      <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        <Sun className="w-5 h-5" />
                      </button>
                      <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        <Moon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Theme Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Object.entries(THEMES).map(([key, themeData]) => (
                      <button
                        key={key}
                        onClick={() => handleThemeChange(key)}
                        className={`group relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                          theme === key
                            ? "border-black dark:border-white shadow-lg"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                      >
                        {theme === key && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center z-10">
                            <Check className="w-3 h-3 text-white dark:text-black" />
                          </div>
                        )}
                        
                        <div className="space-y-4">
                          {/* Theme Preview */}
                          <div 
                            className="h-32 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                            style={{
                              background: `linear-gradient(135deg, ${themeData.colors.base} 0%, ${themeData.colors.neutral} 100%)`
                            }}
                          >
                            <div className="h-full p-3 grid grid-cols-4 gap-2">
                              <div 
                                className="rounded-lg" 
                                style={{ backgroundColor: themeData.colors.primary }}
                              />
                              <div 
                                className="rounded-lg" 
                                style={{ backgroundColor: themeData.colors.secondary }}
                              />
                              <div 
                                className="rounded-lg" 
                                style={{ backgroundColor: themeData.colors.accent }}
                              />
                              <div 
                                className="rounded-lg" 
                                style={{ backgroundColor: themeData.colors.neutral }}
                              />
                            </div>
                          </div>
                          
                          {/* Theme Info */}
                          <div className="text-left">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {themeData.name}
                              </span>
                              <div className={`w-2 h-2 rounded-full ${themeData.dark ? 'bg-gray-700' : 'bg-gray-300'}`} />
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              {["primary", "secondary", "accent"].map((color, i) => (
                                <div
                                  key={color}
                                  className="w-3 h-3 rounded-full border border-gray-200 dark:border-gray-700"
                                  style={{ backgroundColor: themeData.colors[color] }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Live Preview
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      See how your selected theme looks in a real chat
                    </p>
                  </div>

                  <div className="p-6">
                    <div className="max-w-2xl mx-auto">
                      {/* Mock Chat UI */}
                      <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                        {/* Chat Header */}
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-lg"
                                style={{ backgroundColor: currentTheme.colors.primary }}
                              >
                                JD
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                  John Doe
                                </h3>
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Online • Typing...
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Today
                            </div>
                          </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="p-6 space-y-4 min-h-[300px] max-h-[300px] overflow-y-auto bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                          {PREVIEW_MESSAGES.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                            >
                              <div className="flex gap-3 max-w-[80%]">
                                {!message.isSent && (
                                  <div 
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0 mt-1"
                                    style={{ backgroundColor: currentTheme.colors.primary }}
                                  >
                                    {message.avatar}
                                  </div>
                                )}
                                <div
                                  className={`rounded-2xl p-4 shadow-sm ${
                                    message.isSent
                                      ? "rounded-br-none"
                                      : "rounded-bl-none"
                                  }`}
                                  style={{
                                    backgroundColor: message.isSent
                                      ? currentTheme.colors.primary
                                      : currentTheme.colors.neutral,
                                    color: message.isSent ? 'white' : 'inherit'
                                  }}
                                >
                                  <p className="text-sm">{message.content}</p>
                                  <p
                                    className={`text-xs mt-2 ${
                                      message.isSent
                                        ? "text-white/70"
                                        : "text-gray-500 dark:text-gray-400"
                                    }`}
                                  >
                                    {message.time}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Chat Input */}
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 relative">
                              <input
                                type="text"
                                className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-gray-300 dark:focus:border-gray-500 transition-colors text-gray-900 dark:text-white"
                                placeholder="Type your message..."
                                value="This is a live preview of your theme"
                                readOnly
                              />
                              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                <MessageSquare className="w-5 h-5 text-gray-400" />
                              </div>
                            </div>
                            <button
                              className="p-3 rounded-xl shadow-lg transition-transform hover:scale-105"
                              style={{ backgroundColor: currentTheme.colors.primary }}
                            >
                              <Send className="w-5 h-5 text-white" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other Sections */}
            {activeSection !== "appearance" && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
                </h2>
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    {activeSection === "general" && <Monitor className="w-8 h-8 text-gray-400" />}
                    {activeSection === "notifications" && <Bell className="w-8 h-8 text-gray-400" />}
                    {activeSection === "privacy" && <Shield className="w-8 h-8 text-gray-400" />}
                    {activeSection === "language" && <Globe className="w-8 h-8 text-gray-400" />}
                    {activeSection === "performance" && <Zap className="w-8 h-8 text-gray-400" />}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Coming Soon
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    This section is under development
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;