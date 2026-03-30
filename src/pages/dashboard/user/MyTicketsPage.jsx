import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { formatCurrency } from '../../../utils/helpers';
import RefundModal from '../../../components/booking/RefundModal';
import { Calendar, Clock, MapPin, Search, Filter, QrCode } from 'lucide-react';

export default function MyTicketsPage() {
  const { currentUser, bookings } = useApp();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [refundBooking, setRefundBooking] = useState(null);

  const myBookings = useMemo(() => {
    let filtered = bookings.filter(b => b.userId === currentUser?.id);
    if (filter === 'upcoming') filtered = filtered.filter(b => b.status === 'Confirmed' && new Date(b.eventDate) > new Date());
    else if (filter === 'past') filtered = filtered.filter(b => new Date(b.eventDate) <= new Date());
    else if (filter === 'cancelled') filtered = filtered.filter(b => b.status === 'Cancelled');
    if (search) filtered = filtered.filter(b => b.eventTitle.toLowerCase().includes(search.toLowerCase()) || b.ticketId.includes(search));
    return filtered;
  }, [bookings, currentUser, filter, search]);

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'past', label: 'Past' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  const statusColors = {
    Confirmed: 'bg-primary/10 text-primary',
    Cancelled: 'bg-red-100 text-red-600',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Tickets</h1>
        <p className="text-sm text-gray-500 mt-1">View and manage all your event tickets</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by event name or ticket ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === tab.key ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List */}
      {myBookings.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl">🎫</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No tickets found</h3>
          <p className="text-sm text-gray-500 mb-4">
            {filter === 'all' ? "You haven't booked any tickets yet." : `No ${filter} tickets.`}
          </p>
          <Link to="/" className="text-primary font-semibold text-sm hover:underline">Browse Events →</Link>
        </div>
      ) : (
        <div className="space-y-3 stagger-children">
          {myBookings.map(booking => (
            <div key={booking.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <img src={booking.eventImage} alt="" className="w-full sm:w-40 h-32 sm:h-auto object-cover" />
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link to={`/booking/ticket/${booking.id}`} className="text-base font-semibold text-gray-900 hover:text-primary transition-colors">
                        {booking.eventTitle}
                      </Link>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{booking.eventDate}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{booking.eventTime}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{booking.eventVenue}</span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${statusColors[booking.status] || 'bg-gray-100 text-gray-600'}`}>
                      {booking.isVerified ? '✅ Verified' : booking.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-500">ID: <span className="font-mono font-semibold text-gray-700">{booking.ticketId}</span></span>
                      <span className="text-gray-500">{booking.category} × {booking.quantity}</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(booking.totalAmount)}</span>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/booking/ticket/${booking.id}`} className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-1">
                        <QrCode className="w-3.5 h-3.5" /> View Ticket
                      </Link>
                      {booking.status === 'Confirmed' && new Date(booking.eventDate) > new Date() && (
                        <button onClick={() => setRefundBooking(booking)} className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors">
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {refundBooking && (
        <RefundModal booking={refundBooking} onClose={() => setRefundBooking(null)} />
      )}
    </div>
  );
}
