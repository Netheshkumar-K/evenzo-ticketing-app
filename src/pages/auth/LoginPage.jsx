import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Zap, Shield } from 'lucide-react';

export default function LoginPage() {
  const { login, showToast } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        showToast(`Welcome back, ${result.user.name}! 🎉`, 'success');
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
      setLoading(false);
    }, 800);
  };

  const quickLogin = (email, password) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-dark via-dark-light to-[#0a3d62] p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
              <span className="text-white font-bold text-xl">e</span>
            </div>
            <span className="text-2xl font-bold text-white">evenzo<span className="text-coral">.</span></span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Welcome Back to<br />
            <span className="gradient-text">Amazing Events</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-md">
            Book tickets, create events, and manage everything from one powerful platform.
          </p>
        </div>

        <div className="relative space-y-4">
          <div className="flex items-center gap-3 text-gray-300">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-light" />
            </div>
            <div>
              <p className="font-medium text-white text-sm">Instant QR Tickets</p>
              <p className="text-xs text-gray-400">Get your tickets immediately after booking</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-light" />
            </div>
            <div>
              <p className="font-medium text-white text-sm">Secure Verification</p>
              <p className="text-xs text-gray-400">OTP-based on-spot entry verification</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-500">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 animate-fade-in">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-primary to-primary-light text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary font-semibold hover:underline">Sign Up</Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link to="/worker-login" className="text-sm text-secondary font-medium hover:underline">
              🔧 Staff / Worker Login
            </Link>
          </div>

          {/* Quick login hints */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Login (Demo)</p>
            <div className="space-y-2">
              <button onClick={() => quickLogin('arun@test.com', 'password123')} className="w-full text-left px-3 py-2 bg-white rounded-lg border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-all text-sm">
                <span className="font-medium text-gray-700">👤 Normal User</span>
                <span className="text-gray-400 ml-2">— arun@test.com</span>
              </button>
              <button onClick={() => quickLogin('priya@test.com', 'password123')} className="w-full text-left px-3 py-2 bg-white rounded-lg border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-all text-sm">
                <span className="font-medium text-gray-700">🎪 Organizer</span>
                <span className="text-gray-400 ml-2">— priya@test.com</span>
              </button>
              <button onClick={() => quickLogin('admin@evenzo.com', 'admin123')} className="w-full text-left px-3 py-2 bg-white rounded-lg border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-all text-sm">
                <span className="font-medium text-gray-700">🛡️ Admin</span>
                <span className="text-gray-400 ml-2">— admin@evenzo.com</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
