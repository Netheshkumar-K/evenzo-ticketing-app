import EventCard from './EventCard';

export default function EventGrid({ events, emptyMessage = 'No events found' }) {
  if (events.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl">🎭</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{emptyMessage}</h3>
        <p className="text-sm text-gray-500">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 stagger-children">
      {events.map((event, index) => (
        <EventCard key={event.id} event={event} index={index} />
      ))}
    </div>
  );
}
