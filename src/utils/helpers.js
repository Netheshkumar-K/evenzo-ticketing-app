export function generateTicketId() {
  return String(Math.floor(10000000 + Math.random() * 90000000));
}

export function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function generateWorkerCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(timeStr) {
  return timeStr;
}

export function getHoursUntilEvent(eventDate) {
  const now = new Date();
  const event = new Date(eventDate);
  return (event - now) / (1000 * 60 * 60);
}

export function isRefundEligible(eventDate) {
  const hours = getHoursUntilEvent(eventDate);
  return hours > 24;
}

export function getRefundAmount(ticketPrice, eventDate) {
  const hours = getHoursUntilEvent(eventDate);
  if (hours > 48) return { amount: ticketPrice * 0.95, type: 'full', message: '95% refund (5% platform fee)' };
  if (hours > 24) return { amount: ticketPrice * 0.5, type: 'partial', message: '50% refund (late cancellation)' };
  return { amount: 0, type: 'none', message: 'No refund (within 24 hours)' };
}

export function getEventStatus(eventDate) {
  const hours = getHoursUntilEvent(eventDate);
  if (hours < 0) return 'Past';
  if (hours < 24) return 'Today';
  if (hours < 72) return 'Upcoming';
  return 'Active';
}

export function getSoldPercentage(sold, capacity) {
  return Math.min(Math.round((sold / capacity) * 100), 100);
}

export function truncateText(text, maxLength = 80) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getInitials(name) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
