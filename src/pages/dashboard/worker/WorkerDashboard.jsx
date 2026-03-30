import { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { formatCurrency } from '../../../utils/helpers';
import { Search, ScanLine, CheckCircle, Send, KeyRound, Users, Ticket, AlertCircle, ArrowRight } from 'lucide-react';

export default function WorkerDashboard() {
  const { currentUser, events, bookings, sendOTP, verifyOTP, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const workerSession = currentUser?.workerSession;
  const event = useMemo(() => events.find(e => e.id === workerSession?.eventId), [events, workerSession]);
  const eventBookings = useMemo(() => bookings.filter(b => b.eventId === workerSession?.eventId), [bookings, workerSession]);
  const verifiedCount = useMemo(() => eventBookings.filter(b => b.isVerified).length, [eventBookings]);

  const filteredBookings = useMemo(() => {
    if (!search) return eventBookings;
    return eventBookings.filter(b =>
      b.guestName.toLowerCase().includes(search.toLowerCase()) ||
      b.ticketId.includes(search)
    );
  }, [eventBookings, search]);

  const handleSendOTP = (booking) => {
    const otp = sendOTP(booking.id);
    setSelectedBooking(booking);
    setOtpSent(true);
    setOtpInput('');
    showToast(`OTP sent to ${booking.guestName}'s phone: ${otp}`, 'info');
  };

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      const result = verifyOTP(selectedBooking.id, otpInput);
      if (result.success) {
        showToast(`✅ ${selectedBooking.guestName} verified successfully!`, 'success');
        setSelectedBooking(null);
        setOtpSent(false);
        setOtpInput('');
      } else {
        showToast(result.error, 'error');
      }
      setVerifying(false);
    }, 800);
  };

  if (!event) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-gray-900">No active worker session</h2>
        <p className="text-gray-500 mt-2">Please login with a valid worker code.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Event Header */}
      <div className="bg-gradient-to-r from-dark to-dark-light rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <ScanLine className="w-5 h-5 text-primary-light" />
          <span className="text-sm font-medium text-gray-400">Staff Verification Mode</span>
        </div>
        <h1 className="text-xl font-bold">{event.title}</h1>
        <p className="text-sm text-gray-400 mt-1">{event.date} • {event.venue}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
          <p className="text-2xl font-bold text-gray-900">{eventBookings.length}</p>
          <p className="text-xs text-gray-500">Total Guests</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
          <p className="text-2xl font-bold text-primary">{verifiedCount}</p>
          <p className="text-xs text-gray-500">Verified</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
          <p className="text-2xl font-bold text-coral">{eventBookings.length - verifiedCount}</p>
          <p className="text-xs text-gray-500">Remaining</p>
        </div>
      </div>

      {/* OTP Verification Panel */}
      {selectedBooking && otpSent && (
        <div className="bg-white rounded-xl border-2 border-primary/30 p-6 animate-scale-in">
          <div className="text-center mb-4">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
              <KeyRound className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Verify: {selectedBooking.guestName}</h3>
            <p className="text-sm text-gray-500">Ticket: {selectedBooking.ticketId} • {selectedBooking.category}</p>
            <p className="text-xs text-primary mt-2">OTP has been sent to guest's phone</p>
          </div>
          <div className="flex gap-3 max-w-xs mx-auto">
            <input
              type="text"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-center text-lg font-mono tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <button
              onClick={handleVerify}
              disabled={otpInput.length !== 6 || verifying}
              className="px-5 py-3 bg-primary text-white font-semibold rounded-xl hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {verifying ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            </button>
          </div>
          <button onClick={() => { setSelectedBooking(null); setOtpSent(false); }} className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by guest name or ticket number..."
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      {/* Guest List */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-50">
          {filteredBookings.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No guests found</div>
          ) : (
            filteredBookings.map(b => (
              <div key={b.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors ${b.isVerified ? 'bg-green-50/30' : ''}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">{b.guestName}</p>
                    {b.isVerified && (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-coral">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="font-mono">{b.ticketId}</span>
                    <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded">{b.category}</span>
                    <span>Qty: {b.quantity}</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {b.isVerified ? (
                    <span className="px-3 py-1.5 bg-coral/10 text-coral text-xs font-semibold rounded-lg">
                      ✅ Checked In
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSendOTP(b)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:shadow-md transition-all"
                    >
                      <Send className="w-3.5 h-3.5" /> Send OTP
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
