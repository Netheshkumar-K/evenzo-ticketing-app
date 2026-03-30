import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { KeyRound, ArrowRight, ScanLine, Shield } from 'lucide-react';

export default function WorkerLoginPage() {
  const { workerLogin, showToast } = useApp();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const result = workerLogin(code.toUpperCase());
      if (result.success) {
        showToast(`Logged in as Staff for "${result.event.title}"`, 'success');
        navigate('/worker');
      } else {
        setError(result.error);
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-gray-50 to-surface p-6">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-dark to-dark-light p-8 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4">
              <ScanLine className="w-8 h-8 text-primary-light" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">Staff Login</h2>
            <p className="text-gray-400 text-sm">Enter the worker code provided by the event organizer</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 animate-fade-in">{error}</div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Worker Code</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g., NEON25"
                    required
                    maxLength={10}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-center text-lg"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-400">The organizer will share this code with you</p>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-dark to-dark-light text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Start Verification <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <div className="mt-6 flex items-center gap-2 p-3 bg-primary/5 rounded-xl">
              <Shield className="w-4 h-4 text-primary flex-shrink-0" />
              <p className="text-xs text-gray-600">
                Worker access is limited to ticket verification only. No payment or bank details are accessible.
              </p>
            </div>

            {/* Demo codes */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Demo Worker Codes</p>
              <div className="grid grid-cols-2 gap-2">
                {['NEON25', 'LOL25', 'TECH25', 'FOOD25'].map(c => (
                  <button key={c} onClick={() => setCode(c)}
                    className="px-3 py-1.5 bg-white rounded-lg border border-gray-100 text-xs font-mono text-gray-600 hover:border-primary/30 hover:bg-primary/5 transition-all">
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
