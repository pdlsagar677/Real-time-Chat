import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, Check } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
        {/* Left Column - Visual */}
        <div className="hidden md:block bg-gradient-to-br from-gray-900 to-black p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          
          <div className="relative z-10 h-full flex flex-col justify-center text-white">
            <div className="max-w-sm">
              {/* Brand */}
              <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-lg"></div>
                </div>
                <span className="text-3xl font-bold tracking-tight">nexus</span>
              </div>

              <h2 className="text-4xl font-bold mb-6">Welcome Back</h2>
              <p className="text-gray-300 text-lg mb-12">
                Sign in to continue your conversations and reconnect with your community.
              </p>

              {/* Features List */}
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Instant Access</h3>
                    <p className="text-gray-400 text-sm">Pick up right where you left off with all your conversations</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <div className="w-5 h-5">
                      <div className="w-3 h-3 bg-white rounded-full ml-1 mt-1"></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Stay Connected</h3>
                    <p className="text-gray-400 text-sm">Never miss important messages with real-time notifications</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <div className="w-6 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Lightning Fast</h3>
                    <p className="text-gray-400 text-sm">Messages delivered instantly, no delays or loading times</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">50K+</div>
                  <div className="text-xs text-gray-400">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">99.9%</div>
                  <div className="text-xs text-gray-400">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">24/7</div>
                  <div className="text-xs text-gray-400">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="bg-white p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            {/* Mobile Brand */}
            <div className="md:hidden flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-sm"></div>
              </div>
              <span className="text-2xl font-bold tracking-tight">nexus</span>
            </div>

            {/* Header */}
            <div className="mb-10">
              <h1 className="text-3xl font-bold mb-3">Sign In</h1>
              <p className="text-gray-600">
                Enter your credentials to access your account
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Email Address
                </label>
                <div className={`relative group ${focusedField === 'email' ? 'ring-2 ring-black/10 ring-offset-1 rounded-lg' : ''}`}>
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className={`w-5 h-5 ${focusedField === 'email' ? 'text-black' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="email"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-gray-300 transition-all duration-200 text-gray-900"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-800">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-sm text-gray-600 hover:text-black transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                
                <div className={`relative group ${focusedField === 'password' ? 'ring-2 ring-black/10 ring-offset-1 rounded-lg' : ''}`}>
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className={`w-5 h-5 ${focusedField === 'password' ? 'text-black' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-gray-300 transition-all duration-200 text-gray-900"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className="flex items-center gap-3 group"
                >
                  <div className={`w-5 h-5 flex items-center justify-center rounded border transition-all duration-200 ${
                    rememberMe 
                      ? 'bg-black border-black' 
                      : 'bg-white border-gray-300 group-hover:border-gray-400'
                  }`}>
                    {rememberMe && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                    Remember me
                  </span>
                </button>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-gray-600 hover:text-black transition-colors font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-4 bg-black text-white rounded-lg font-medium hover:bg-gray-900 active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

           

           

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-black font-semibold hover:underline">
                  Create account
                </Link>
              </p>
            </div>

            {/* Security Note */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Lock className="w-3 h-3 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">
                    Your login is secured with end-to-end encryption. We never store your password in plain text.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;