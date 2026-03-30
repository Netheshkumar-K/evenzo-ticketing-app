import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { formatCurrency, getSoldPercentage } from '../../../utils/helpers';
import { CalendarDays, TrendingUp, Ticket, DollarSign, Plus, BarChart3, ArrowRight, Users, Eye } from 'lucide-react';

export default function OrganizerDashboard() {
  const { currentUser, events, bookings } = useApp();

  const myEvents = useMemo(() => events.filter(e => e.createdBy === currentUser?.id), [events, currentUser]);
  const myBookings = useMemo(() => bookings.filter(b => myEvents.some(e => e.id === b.eventId)), [bookings, myEvents]);
  const totalRevenue = useMemo(() => myBookings.reduce((sum, b) => sum + b.totalAmount, 0), [myBookings]);
  const totalSold = useMemo(() => myBookings.length, [myBookings]);
  const verifiedCount = useMemo(() => myBookings.filter(b => b.isVerified).length, [myBookings]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organizer Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your events and track performance</p>
        </div>
        <Link to="/organizer/create" className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary to-primary-light text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5">
          <Plus className="w-4 h-4" /> Create Event
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: CalendarDays, label: 'Total Events', value: myEvents.length, color: 'bg-primary/10 text-primary' },
          { icon: Ticket, label: 'Tickets Sold', value: totalSold, color: 'bg-blue-50 text-secondary' },
          { icon: DollarSign, label: 'Total Revenue', value: formatCurrency(totalRevenue), color: 'bg-green-50 text-green-600' },
          { icon: Users, label: 'Verified Check-ins', value: verifiedCount, color: 'bg-amber-50 text-amber-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* My Events List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">My Events</h2>
        </div>
        {myEvents.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl">🎪</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No Events Yet</h3>
            <p className="text-sm text-gray-500 mb-4">Create your first event and start selling tickets!</p>
            <Link to="/organizer/create" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl">
              <Plus className="w-4 h-4" /> Create Event
            </Link>
          </div>
        ) : (
          <div className="space-y-3 stagger-children">
            {myEvents.map(event => {
              const eventBookings = bookings.filter(b => b.eventId === event.id);
              const eventRevenue = eventBookings.reduce((sum, b) => sum + b.totalAmount, 0);
              const soldPct = getSoldPercentage(event.sold, event.capacity);
              return (
                <div key={event.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <img src={event.image} alt="" className="w-full sm:w-48 h-36 sm:h-auto object-cover" />
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">{event.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{event.date} • {event.venue}</p>
                        </div>
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${event.status === 'Active' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'}`}>
                          {event.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mt-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-400">Tickets Sold</p>
                          <p className="text-sm font-bold text-gray-900">{event.sold} / {event.capacity}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Revenue</p>
                          <p className="text-sm font-bold text-gray-900">{formatCurrency(eventRevenue)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Worker Code</p>
                          <p className="text-sm font-mono font-bold text-primary">{event.workerCode}</p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mb-3">
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${soldPct > 90 ? 'bg-coral' : 'bg-primary'}`} style={{ width: `${soldPct}%` }} />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link to={`/organizer/event/${event.id}`} className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" /> Live Dashboard
                        </Link>
                        <Link to={`/organizer/report/${event.id}`} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1">
                          <BarChart3 className="w-3.5 h-3.5" /> View Report
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
