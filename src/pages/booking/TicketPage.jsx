import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { QRCodeSVG } from 'qrcode.react';
import { formatCurrency } from '../../utils/helpers';
import { Calendar, Clock, MapPin, Download, Share2, ArrowLeft, CheckCircle, Ticket } from 'lucide-react';

export default function TicketPage() {
  const { id } = useParams();
  const { bookings } = useApp();
  const booking = useMemo(() => bookings.find(b => b.id === id), [bookings, id]);

  if (!booking) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ticket Not Found</h2>
        <p className="text-gray-500 mb-6">Unable to find this booking.</p>
        <Link to="/dashboard" className="text-primary font-semibold hover:underline">← Back to Dashboard</Link>
      </div>
    );
  }

  const statusColors = {
    Confirmed: 'bg-primary/10 text-primary',
    Cancelled: 'bg-red-100 text-red-600',
    Used: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="min-h-screen bg-surface py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Success banner */}
        <div className="text-center mb-6 animate-fade-in-up">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Booking Confirmed!</h1>
          <p className="text-gray-500 text-sm">Your ticket has been generated successfully</p>
        </div>

        {/* Ticket Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-up" style={{animationDelay: '0.15s'}}>
          {/* Ticket Header */}
          <div className="bg-gradient-to-r from-primary to-primary-light p-6 text-white text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Ticket className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">Event Ticket</span>
            </div>
            <h2 className="text-xl font-bold">{booking.eventTitle}</h2>
          </div>

          {/* QR Code Section */}
          <div className="ticket-edge bg-white py-8 flex flex-col items-center border-b border-dashed border-gray-200">
            <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-100">
              <QRCodeSVG
                value={JSON.stringify({ ticketId: booking.ticketId, bookingId: booking.id, event: booking.eventTitle })}
                size={180}
                level="H"
                includeMargin
                fgColor="#1A1A2E"
              />
            </div>
            <p className="mt-4 text-xs text-gray-400">Scan this QR code at the venue entrance</p>
            <p className="mt-1 font-mono text-lg font-bold text-gray-900 tracking-widest">
              {booking.ticketId}
            </p>
          </div>

          {/* Ticket Details */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Guest Name</p>
                <p className="text-sm font-semibold text-gray-900">{booking.guestName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Category</p>
                <p className="text-sm font-semibold text-gray-900">{booking.category}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Quantity</p>
                <p className="text-sm font-semibold text-gray-900">{booking.quantity} ticket(s)</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Amount Paid</p>
                <p className="text-sm font-semibold text-primary">{formatCurrency(booking.totalAmount)}</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{booking.eventDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-primary" />
                <span>{booking.eventTime}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-coral" />
                <span>{booking.eventVenue}</span>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[booking.status] || statusColors.Confirmed}`}>
                {booking.status}
              </span>
              <span className="text-xs text-gray-400">
                Booked on {new Date(booking.bookedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-surface rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-surface rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>

        {/* Notification info */}
        <div className="mt-6 p-4 bg-white rounded-xl border border-gray-100 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          <p className="text-xs text-gray-500 text-center">
            📧 A PDF copy has been sent to <strong>{booking.guestEmail}</strong><br />
            📱 SMS/WhatsApp confirmation: <strong>Booking Confirmed</strong>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-primary font-semibold hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
