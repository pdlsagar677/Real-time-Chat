import { MessageSquare, Sparkles, Users, Send } from "lucide-react";

const NoChatSelected = () => {
  const features = [
    { icon: Sparkles, text: "End-to-end encryption", color: "text-blue-500" },
    { icon: Users, text: "Group conversations", color: "text-green-500" },
    { icon: Send, text: "Real-time messaging", color: "text-purple-500" },
  ];

  return (
    <div className="w-full flex-1 flex items-center justify-center bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-900/50 dark:to-gray-900 p-4">
      <div className="max-w-lg mx-auto text-center">
        {/* Animated Background Elements */}
        <div className="relative mb-12">
          {/* Floating dots */}
          <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse"></div>
          <div className="absolute -top-8 right-10 w-8 h-8 rounded-full bg-gradient-to-r from-green-500/10 to-blue-500/10 animate-pulse delay-300"></div>
          <div className="absolute -bottom-4 left-1/4 w-6 h-6 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 animate-pulse delay-500"></div>
          
          {/* Main Icon */}
          <div className="relative mx-auto w-32 h-32">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black dark:from-gray-800 dark:to-gray-900 rounded-3xl rotate-6 animate-pulse-slow"></div>
            <div className="absolute inset-2 bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl flex items-center justify-center">
              <MessageSquare className="w-16 h-16 text-gray-900 dark:text-white" />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="space-y-4 mb-10">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Welcome to Chatty
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-md mx-auto">
            Select a conversation or start a new one to begin messaging
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {feature.text}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-full border border-gray-200 dark:border-gray-700">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Click on a contact to start chatting
            </span>
          </div>
          
          {/* Quick Tips */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Quick tips:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">
                Press Ctrl + K to search
              </span>
              <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">
                Drag & drop files
              </span>
              <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">
                @mention users
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animation Keyframes */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: rotate(6deg); }
          50% { opacity: 0.8; transform: rotate(8deg); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NoChatSelected;