import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { formatCurrency } from '../../../utils/helpers';
import { Ticket, Calendar, TrendingUp, Plus, ArrowRight, Clock } from 'lucide-react';

export default function UserDashboard() {
  const { currentUser, bookings, events } = useApp();

  const myBookings = useMemo(() => bookings.filter(b => b.userId === currentUser?.id), [bookings, currentUser]);
  const upcomingBookings = useMemo(() => myBookings.filter(b => b.status === 'Confirmed' && new Date(b.eventDate) > new Date()), [myBookings]);
  const pastBookings = useMemo(() => myBookings.filter(b => b.status !== 'Confirmed' || new Date(b.eventDate) <= new Date()), [myBookings]);
  const totalSpent = useMemo(() => myBookings.reduce((sum, b) => sum + b.totalAmount, 0), [myBookings]);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary to-primary-light rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="relative">
          <p className="text-white/80 text-sm mb-1">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, {currentUser?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-white/80 text-sm">Here's a summary of your event activity.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Ticket, label: 'Total Bookings', value: myBookings.length, color: 'bg-primary/10 text-primary' },
          { icon: Calendar, label: 'Upcoming', value: upcomingBookings.length, color: 'bg-blue-50 text-secondary' },
          { icon: Clock, label: 'Past Events', value: pastBookings.length, color: 'bg-amber-50 text-amber-600' },
          { icon: TrendingUp, label: 'Total Spent', value: formatCurrency(totalSpent), color: 'bg-red-50 text-coral' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Upcoming Tickets */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Upcoming Tickets</h2>
          <Link to="/dashboard/tickets" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {upcomingBookings.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl">🎫</div>
            <p className="text-gray-500 text-sm mb-4">No upcoming tickets. Start exploring events!</p>
            <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:shadow-md transition-all">
              Browse Events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingBookings.slice(0, 3).map(booking => (
              <Link key={booking.id} to={`/booking/ticket/${booking.id}`}
                className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-primary/20 transition-all group">
                <img src={booking.eventImage} alt="" className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">{booking.eventTitle}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" /> {booking.eventDate} • {booking.eventTime}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-mono text-gray-400">{booking.ticketId}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">{booking.status}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Create Event CTA */}
      {currentUser?.role === 'USER' && (
        <div className="bg-gradient-to-r from-dark to-dark-light rounded-2xl p-6 sm:p-8 text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold mb-1">Want to Host Events?</h3>
            <p className="text-gray-400 text-sm">Become an organizer and start creating amazing events.</p>
          </div>
          <Link to="/organizer/create" className="flex-shrink-0 px-5 py-3 bg-primary text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Event
          </Link>
        </div>
      )}
    </div>
  );
}
