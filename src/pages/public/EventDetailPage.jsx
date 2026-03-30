import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { formatCurrency, getSoldPercentage } from '../../utils/helpers';
import { Calendar, MapPin, Clock, Users, Minus, Plus, ArrowLeft, Share2, Heart, Tag, User, ShieldCheck } from 'lucide-react';

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events, currentUser, createBooking, showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('individual');
  const [quantity, setQuantity] = useState(1);
  const [booking, setBooking] = useState(false);
  const [liked, setLiked] = useState(false);

  const event = useMemo(() => events.find(e => e.id === id), [events, id]);

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
        <p className="text-gray-500 mb-6">The event you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="text-primary font-semibold hover:underline">← Back to Home</Link>
      </div>
    );
  }

  const soldPct = getSoldPercentage(event.sold, event.capacity);
  const remaining = event.capacity - event.sold;
  const unitPrice = event.price[selectedCategory] || event.price.individual;
  const totalPrice = unitPrice * quantity;

  const categories = [
    { key: 'individual', label: 'Individual', desc: 'Single entry pass' },
    { key: 'combo', label: 'Combo (2)', desc: 'For couples & friends' },
    { key: 'group', label: 'Group (5)', desc: 'Best value for groups' },
  ];

  const handleBook = () => {
    if (!currentUser) {
      showToast('Please login to book tickets', 'warning');
      navigate('/login');
      return;
    }
    setBooking(true);
    setTimeout(() => {
      const result = createBooking(event.id, selectedCategory, quantity, currentUser.name);
      if (result.success) {
        showToast('Ticket booked successfully! 🎉', 'success');
        navigate(`/booking/ticket/${result.booking.id}`);
      } else {
        showToast(result.error, 'error');
      }
      setBooking(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute top-4 left-4">
          <button onClick={() => navigate(-1)} className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <button onClick={() => setLiked(!liked)} className={`p-2.5 backdrop-blur-sm rounded-xl transition-colors ${liked ? 'bg-coral text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}>
            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
          </button>
        </div>
        <div className="absolute bottom-6 left-4 sm:left-8">
          <span className="px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg">{event.category}</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Event Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" />{event.date}</span>
                <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" />{event.time}</span>
                <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-coral" />{event.venue}</span>
              </div>
            </div>

            {/* Organizer */}
            <div className="flex items-center gap-3 p-4 bg-surface rounded-xl border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Organized by {event.organizerName || 'Evenzo Organizer'}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-primary" /> Verified Organizer</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Event</h3>
              <p className="text-gray-600 leading-relaxed">{event.description}</p>
            </div>

            {/* Capacity */}
            <div className="p-4 bg-surface rounded-xl border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" /> Availability
                </span>
                <span className={`text-sm font-semibold ${remaining < 50 ? 'text-coral' : 'text-primary'}`}>
                  {remaining} spots left
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-1000 ${soldPct > 90 ? 'bg-coral' : 'bg-primary'}`} style={{ width: `${soldPct}%` }} />
              </div>
              <p className="text-xs text-gray-500 mt-1">{event.sold} of {event.capacity} tickets booked</p>
            </div>
          </div>

          {/* Right - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary-light p-5 text-white">
                <p className="text-sm font-medium opacity-90">Starting from</p>
                <p className="text-3xl font-bold">{formatCurrency(event.price.individual)}</p>
              </div>

              <div className="p-5 space-y-5">
                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Tag className="w-4 h-4 inline mr-1" /> Select Category
                  </label>
                  <div className="space-y-2">
                    {categories.map(cat => (
                      <button
                        key={cat.key}
                        onClick={() => setSelectedCategory(cat.key)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left ${
                          selectedCategory === cat.key
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{cat.label}</p>
                          <p className="text-xs text-gray-500">{cat.desc}</p>
                        </div>
                        <p className="text-sm font-bold text-gray-900">
                          {formatCurrency(event.price[cat.key] || event.price.individual)}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                      className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="p-4 bg-surface rounded-xl space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{formatCurrency(unitPrice)} × {quantity}</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Platform fee</span>
                    <span>{formatCurrency(Math.round(totalPrice * 0.02))}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between text-base font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(totalPrice + Math.round(totalPrice * 0.02))}</span>
                  </div>
                </div>

                {/* Book Button */}
                <button
                  onClick={handleBook}
                  disabled={booking || remaining === 0}
                  className="w-full py-3.5 bg-gradient-to-r from-primary to-primary-light text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {booking ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing Payment...
                    </>
                  ) : remaining === 0 ? (
                    'Sold Out'
                  ) : (
                    `Book Now — ${formatCurrency(totalPrice + Math.round(totalPrice * 0.02))}`
                  )}
                </button>

                <p className="text-xs text-center text-gray-400">
                  🔒 Secure UPI payment · Instant ticket delivery
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
