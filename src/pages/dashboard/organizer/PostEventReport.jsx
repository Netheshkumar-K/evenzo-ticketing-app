import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { formatCurrency } from '../../../utils/helpers';
import { ArrowLeft, Users, Ticket, DollarSign, CheckCircle, BarChart3, Download } from 'lucide-react';

export default function PostEventReport() {
  const { id } = useParams();
  const { events, bookings } = useApp();

  const event = useMemo(() => events.find(e => e.id === id), [events, id]);
  const eventBookings = useMemo(() => bookings.filter(b => b.eventId === id), [bookings, id]);
  const revenue = useMemo(() => eventBookings.reduce((sum, b) => sum + b.totalAmount, 0), [eventBookings]);
  const verifiedCount = useMemo(() => eventBookings.filter(b => b.isVerified).length, [eventBookings]);
  const categoryBreakdown = useMemo(() => {
    const counts = {};
    eventBookings.forEach(b => { counts[b.category] = (counts[b.category] || 0) + 1; });
    return Object.entries(counts).map(([name, count]) => ({ name, count, percentage: Math.round((count / (eventBookings.length || 1)) * 100) }));
  }, [eventBookings]);

  if (!event) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">Event not found</h2>
        <Link to="/organizer" className="text-primary mt-4 inline-block">← Back</Link>
      </div>
    );
  }

  const attendanceRate = eventBookings.length > 0 ? Math.round((verifiedCount / eventBookings.length) * 100) : 0;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/organizer" className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Post-Event Report</h1>
          <p className="text-sm text-gray-500">{event.title}</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Ticket, label: 'Total Booked', value: eventBookings.length, color: 'text-primary bg-primary/10' },
          { icon: CheckCircle, label: 'Actual Attendees', value: verifiedCount, color: 'text-green-600 bg-green-50' },
          { icon: DollarSign, label: 'Total Revenue', value: formatCurrency(revenue), color: 'text-blue-600 bg-blue-50' },
          { icon: Users, label: 'Attendance Rate', value: `${attendanceRate}%`, color: 'text-amber-600 bg-amber-50' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-gray-100">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Booked vs Attended */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" /> Tickets Booked vs Actual Attendees
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-gray-600">Tickets Booked</span>
              <span className="font-semibold">{eventBookings.length} / {event.capacity}</span>
            </div>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${Math.round((eventBookings.length / event.capacity) * 100)}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-gray-600">Actual Attendees (Verified)</span>
              <span className="font-semibold">{verifiedCount} / {eventBookings.length}</span>
            </div>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-coral rounded-full transition-all duration-1000" style={{ width: `${attendanceRate}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Category Breakdown</h3>
        {categoryBreakdown.length === 0 ? (
          <p className="text-sm text-gray-400">No bookings data available</p>
        ) : (
          <div className="space-y-3">
            {categoryBreakdown.map(cat => (
              <div key={cat.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{cat.name}</span>
                  <span className="text-gray-500">{cat.count} tickets ({cat.percentage}%)</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: `${cat.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="flex items-center gap-2 px-5 py-3 bg-primary text-white font-semibold rounded-xl hover:shadow-md transition-all">
        <Download className="w-4 h-4" /> Download Full Report
      </button>
    </div>
  );
}
