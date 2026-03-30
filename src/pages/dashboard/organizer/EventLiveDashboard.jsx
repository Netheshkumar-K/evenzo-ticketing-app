import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { formatCurrency } from '../../../utils/helpers';
import { Search, Download, Copy, RefreshCw, Users, Ticket, DollarSign, CheckCircle, ArrowLeft } from 'lucide-react';

export default function EventLiveDashboard() {
  const { id } = useParams();
  const { events, bookings, showToast } = useApp();
  const [search, setSearch] = useState('');

  const event = useMemo(() => events.find(e => e.id === id), [events, id]);
  const eventBookings = useMemo(() => bookings.filter(b => b.eventId === id), [bookings, id]);
  const filteredBookings = useMemo(() => {
    if (!search) return eventBookings;
    return eventBookings.filter(b =>
      b.guestName.toLowerCase().includes(search.toLowerCase()) ||
      b.ticketId.includes(search) ||
      b.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [eventBookings, search]);

  const revenue = useMemo(() => eventBookings.reduce((sum, b) => sum + b.totalAmount, 0), [eventBookings]);
  const verifiedCount = useMemo(() => eventBookings.filter(b => b.isVerified).length, [eventBookings]);

  if (!event) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">Event not found</h2>
        <Link to="/organizer" className="text-primary mt-4 inline-block">← Back</Link>
      </div>
    );
  }

  const copyWorkerCode = () => {
    navigator.clipboard.writeText(event.workerCode);
    showToast('Worker code copied!', 'info');
  };

  const downloadCSV = () => {
    const headers = 'Ticket ID,Guest Name,Category,Quantity,Amount,Status,Verified\n';
    const rows = eventBookings.map(b =>
      `${b.ticketId},${b.guestName},${b.category},${b.quantity},${b.totalAmount},${b.status},${b.isVerified ? 'Yes' : 'No'}`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title.replace(/\s+/g, '_')}_bookings.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV downloaded!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link to="/organizer" className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 mt-1">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">{event.title}</h1>
          <p className="text-sm text-gray-500">{event.date} • {event.venue}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: Ticket, label: 'Tickets Sold', value: eventBookings.length, color: 'text-primary bg-primary/10' },
          { icon: DollarSign, label: 'Revenue', value: formatCurrency(revenue), color: 'text-green-600 bg-green-50' },
          { icon: Users, label: 'Capacity', value: `${event.sold}/${event.capacity}`, color: 'text-secondary bg-blue-50' },
          { icon: CheckCircle, label: 'Verified', value: verifiedCount, color: 'text-amber-600 bg-amber-50' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-100">
            <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center mb-2`}>
              <s.icon className="w-4 h-4" />
            </div>
            <p className="text-lg font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Worker Code */}
      <div className="bg-gradient-to-r from-dark to-dark-light rounded-xl p-5 flex items-center justify-between text-white">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Worker Code</p>
          <p className="text-2xl font-mono font-bold tracking-widest">{event.workerCode}</p>
          <p className="text-xs text-gray-400 mt-1">Share this code with your staff for on-spot verification</p>
        </div>
        <button onClick={copyWorkerCode} className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
          <Copy className="w-5 h-5" />
        </button>
      </div>

      {/* Search & Download */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, ticket ID, or category..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <button onClick={downloadCSV} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:shadow-md transition-all">
          <Download className="w-4 h-4" /> Download CSV
        </button>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-semibold">Ticket ID</th>
                <th className="text-left px-5 py-3 font-semibold">Guest Name</th>
                <th className="text-left px-5 py-3 font-semibold">Category</th>
                <th className="text-left px-5 py-3 font-semibold">Qty</th>
                <th className="text-left px-5 py-3 font-semibold">Amount</th>
                <th className="text-left px-5 py-3 font-semibold">Status</th>
                <th className="text-center px-5 py-3 font-semibold">Verified</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBookings.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">No bookings found</td></tr>
              ) : (
                filteredBookings.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-semibold text-gray-900">{b.ticketId}</td>
                    <td className="px-5 py-3.5 font-medium text-gray-900">{b.guestName}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-md">{b.category}</span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{b.quantity}</td>
                    <td className="px-5 py-3.5 font-semibold text-gray-900">{formatCurrency(b.totalAmount)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${b.status === 'Confirmed' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{b.status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      {b.isVerified ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-coral/10">
                          <CheckCircle className="w-5 h-5 text-coral fill-coral/20" />
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
