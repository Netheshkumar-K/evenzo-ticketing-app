import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import EventGrid from '../../components/events/EventGrid';
import CategoryFilter from '../../components/events/CategoryFilter';
import { Search, ArrowRight, Sparkles, Ticket, Users, Calendar, TrendingUp, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const { events } = useApp();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = !searchQuery || 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [events, searchQuery, selectedCategory]);

  const trendingEvents = useMemo(() => events.filter(e => e.trending), [events]);

  const stats = useMemo(() => ({
    totalEvents: events.length,
    totalSold: events.reduce((sum, e) => sum + (e.sold || 0), 0),
    totalCapacity: events.reduce((sum, e) => sum + e.capacity, 0),
  }), [events]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-dark via-dark-light to-[#0a3d62] overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6 animate-fade-in">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/20 border border-primary/30 text-primary-light text-xs font-semibold rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                #1 Event Platform in India
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fade-in-up">
              Discover & Book<br />
              <span className="gradient-text">Amazing Events</span><br />
              Near You
            </h1>
            <p className="text-lg text-gray-400 max-w-xl mb-8 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              From music festivals to tech summits, discover events that match your passion. 
              Create, book, and manage — all in one place.
            </p>

            {/* Search bar */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events, venues, artists..."
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
              <Link
                to="/?section=events"
                className="px-6 py-4 bg-gradient-to-r from-primary to-primary-light text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                Explore Events <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Floating stats */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <div className="glass rounded-xl p-4 text-center bg-white/5 border-white/10">
              <p className="text-2xl font-bold text-white">{stats.totalEvents}+</p>
              <p className="text-xs text-gray-400 mt-1">Live Events</p>
            </div>
            <div className="glass rounded-xl p-4 text-center bg-white/5 border-white/10">
              <p className="text-2xl font-bold text-white">{(stats.totalSold / 1000).toFixed(1)}K</p>
              <p className="text-xs text-gray-400 mt-1">Tickets Sold</p>
            </div>
            <div className="glass rounded-xl p-4 text-center bg-white/5 border-white/10">
              <p className="text-2xl font-bold text-white">4.9★</p>
              <p className="text-xs text-gray-400 mt-1">User Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      {trendingEvents.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-coral" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Trending Now 🔥</h2>
                <p className="text-sm text-gray-500">Most popular events this week</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {trendingEvents.map((event, i) => (
              <Link key={event.id} to={`/event/${event.id}`} className="group relative rounded-2xl overflow-hidden h-64 flex items-end">
                <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="relative p-5 w-full">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-coral text-white text-xs font-semibold rounded-md mb-2">
                    <TrendingUp className="w-3 h-3" /> Trending
                  </span>
                  <h3 className="text-lg font-bold text-white mb-1">{event.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {event.date}</span>
                    <span>•</span>
                    <span>{event.price.individual ? `₹${event.price.individual}` : 'Free'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All Events Section */}
      <section id="events" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
            <p className="text-sm text-gray-500 mt-1">{filteredEvents.length} events available</p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
        </div>

        {/* Events Grid */}
        <EventGrid events={filteredEvents} emptyMessage="No events match your search" />
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary via-primary-dark to-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Host Your Own Event?</h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Create your event, sell tickets, and manage everything with our powerful organizer tools.
          </p>
          <Link to="/login" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-semibold rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            Get Started <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
