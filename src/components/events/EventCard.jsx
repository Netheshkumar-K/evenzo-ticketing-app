import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, TrendingUp } from 'lucide-react';
import { formatCurrency, getSoldPercentage } from '../../utils/helpers';

export default function EventCard({ event, index = 0 }) {
  const soldPct = getSoldPercentage(event.sold, event.capacity);
  const isFastFilling = soldPct > 70;
  const isSoldOut = soldPct >= 100;

  return (
    <Link
      to={`/event/${event.id}`}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500 hover:-translate-y-1 flex flex-col"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {event.trending && (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-coral text-white text-xs font-semibold rounded-lg shadow-md">
              <TrendingUp className="w-3 h-3" /> Trending
            </span>
          )}
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-lg">
            {event.category}
          </span>
        </div>

        {isFastFilling && !isSoldOut && (
          <span className="absolute top-3 right-3 px-2.5 py-1 bg-amber-500 text-white text-xs font-semibold rounded-lg animate-pulse shadow-md">
            ⚡ Fast Filling
          </span>
        )}
        {isSoldOut && (
          <span className="absolute top-3 right-3 px-2.5 py-1 bg-red-500 text-white text-xs font-semibold rounded-lg shadow-md">
            Sold Out
          </span>
        )}

        {/* Price */}
        <div className="absolute bottom-3 right-3">
          <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-gray-900 text-sm font-bold rounded-lg shadow-md">
            {formatCurrency(event.price.individual)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col">
        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {event.title}
        </h3>

        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
            <span>{event.date} • {event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4 text-coral flex-shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        {/* Capacity bar */}
        <div className="mt-auto pt-3 border-t border-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> {event.sold}/{event.capacity}
            </span>
            <span className="font-medium">{soldPct}% booked</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                soldPct > 90 ? 'bg-coral' : soldPct > 60 ? 'bg-amber-400' : 'bg-primary'
              }`}
              style={{ width: `${soldPct}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
