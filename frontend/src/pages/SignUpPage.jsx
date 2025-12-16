import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, User, Check } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }
    if (!acceptedTerms) {
      toast.error("Please accept terms and conditions");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      signup(formData);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
        {/* Left Column - Form */}
        <div className="bg-white p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            {/* Header */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-sm"></div>
                </div>
                <span className="text-2xl font-bold tracking-tight">Chatty</span>
              </div>
              <h1 className="text-3xl font-bold mb-3">Create Account</h1>
              <p className="text-gray-600">
                Join thousands of users connecting worldwide
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Full Name
                </label>
                <div className={`relative group ${focusedField === 'fullName' ? 'ring-2 ring-black/10 ring-offset-1 rounded-lg' : ''}`}>
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className={`w-5 h-5 ${focusedField === 'fullName' ? 'text-black' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-gray-300 transition-all duration-200 text-gray-900"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    onFocus={() => setFocusedField('fullName')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>

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
                    placeholder="Create a strong password"
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

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Password strength</span>
                      <span className="font-medium">
                        {passwordStrength < 50 ? 'Weak' : passwordStrength < 75 ? 'Good' : 'Strong'}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          passwordStrength < 50 ? 'bg-red-500' : 
                          passwordStrength < 75 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span>8+ characters</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span>Uppercase</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full (/[0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300')`} />
                        <span>Number</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full (/[^A-Za-z0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300')`} />
                        <span>Special</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <button
                  type="button"
                  onClick={() => setAcceptedTerms(!acceptedTerms)}
                  className={`w-5 h-5 mt-0.5 flex items-center justify-center rounded border transition-all duration-200 ${
                    acceptedTerms 
                      ? 'bg-black border-black' 
                      : 'bg-white border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {acceptedTerms && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
                <div>
                  <p className="text-sm text-gray-700">
                    I agree to the{" "}
                    <button type="button" className="text-black font-medium hover:underline">
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button type="button" className="text-black font-medium hover:underline">
                      Privacy Policy
                    </button>
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSigningUp}
                className="w-full py-4 bg-black text-white rounded-lg font-medium hover:bg-gray-900 active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSigningUp ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

          

            

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-black font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Visual */}
        <div className="hidden md:block bg-gradient-to-br from-gray-900 to-black p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          
          <div className="relative z-10 h-full flex flex-col justify-center text-white">
            <div className="max-w-sm">
              <div className="mb-10">
                <div className="w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center mb-6">
                  <div className="w-8 h-8 bg-white rounded-lg"></div>
                </div>
                <h2 className="text-4xl font-bold mb-4">Welcome to Chatty</h2>
                <p className="text-gray-300 text-lg">
                  Join our community of thousands connecting worldwide. Secure, fast, and private messaging.
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-6 mt-12">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-6 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">End-to-End Encryption</h3>
                    <p className="text-gray-400 text-sm">Your conversations are secured with military-grade encryption</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <div className="w-6 h-6 border-2 border-white rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Global Community</h3>
                    <p className="text-gray-400 text-sm">Connect with people from all around the world</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <div className="w-6 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Lightning Fast</h3>
                    <p className="text-gray-400 text-sm">Real-time messaging with no delays or lag</p>
                  </div>
                </div>
              </div>

             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;