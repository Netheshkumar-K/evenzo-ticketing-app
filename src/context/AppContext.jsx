import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { mockUsers, events as defaultEvents } from '../data/mockData';

const AppContext = createContext(null);

const STORAGE_KEYS = {
  USER: 'evenzo_user',
  EVENTS: 'evenzo_events',
  BOOKINGS: 'evenzo_bookings',
  WORKERS: 'evenzo_workers',
};

function loadFromStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* ignore quota errors */ }
}

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => loadFromStorage(STORAGE_KEYS.USER, null));
  const [events, setEvents] = useState(() => loadFromStorage(STORAGE_KEYS.EVENTS, defaultEvents));
  const [bookings, setBookings] = useState(() => loadFromStorage(STORAGE_KEYS.BOOKINGS, []));
  const [workerSessions, setWorkerSessions] = useState(() => loadFromStorage(STORAGE_KEYS.WORKERS, []));
  const [toasts, setToasts] = useState([]);

  // Persist state
  useEffect(() => { saveToStorage(STORAGE_KEYS.USER, currentUser); }, [currentUser]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.EVENTS, events); }, [events]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.BOOKINGS, bookings); }, [bookings]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.WORKERS, workerSessions); }, [workerSessions]);

  // Auth
  const login = useCallback((email, password) => {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...safeUser } = user;
      setCurrentUser(safeUser);
      return { success: true, user: safeUser };
    }
    return { success: false, error: 'Invalid email or password' };
  }, []);

  const signup = useCallback((userData) => {
    const exists = mockUsers.find(u => u.email === userData.email);
    if (exists) return { success: false, error: 'Email already registered' };
    const newUser = {
      id: `USR-${Date.now()}`,
      ...userData,
      role: 'USER',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=00B894&color=fff&size=128`,
      createdAt: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    const { password: _, ...safeUser } = newUser;
    setCurrentUser(safeUser);
    return { success: true, user: safeUser };
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const upgradeToOrganizer = useCallback(() => {
    if (currentUser) {
      const updated = { ...currentUser, role: 'ORGANIZER' };
      setCurrentUser(updated);
    }
  }, [currentUser]);

  // Worker login
  const workerLogin = useCallback((workerCode) => {
    const event = events.find(e => e.workerCode === workerCode);
    if (event) {
      const session = { eventId: event.id, eventTitle: event.title, code: workerCode, loginAt: new Date().toISOString() };
      setCurrentUser({ id: `WKR-${Date.now()}`, name: 'Staff Member', role: 'WORKER', workerSession: session });
      return { success: true, event };
    }
    return { success: false, error: 'Invalid worker code' };
  }, [events]);

  // Events
  const addEvent = useCallback((eventData) => {
    const newEvent = {
      id: `EVT-${Date.now()}`,
      ...eventData,
      createdBy: currentUser?.id,
      organizerName: currentUser?.name,
      workerCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      sold: 0,
      attendees: [],
      status: 'Active',
      createdAt: new Date().toISOString(),
    };
    setEvents(prev => [newEvent, ...prev]);
    return newEvent;
  }, [currentUser]);

  const getMyEvents = useCallback(() => {
    return events.filter(e => e.createdBy === currentUser?.id);
  }, [events, currentUser]);

  // Bookings
  const createBooking = useCallback((eventId, category, quantity, guestName) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return { success: false, error: 'Event not found' };

    const ticketId = String(Math.floor(10000000 + Math.random() * 90000000));
    const price = event.price[category.toLowerCase()] || event.price.individual;
    const totalAmount = price * quantity;

    const booking = {
      id: `BK-${Date.now()}`,
      ticketId,
      eventId,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      eventVenue: event.venue,
      eventImage: event.image,
      userId: currentUser?.id,
      guestName: guestName || currentUser?.name,
      guestEmail: currentUser?.email,
      guestPhone: currentUser?.phone,
      category,
      quantity,
      unitPrice: price,
      totalAmount,
      status: 'Confirmed',
      paymentStatus: 'Paid',
      isVerified: false,
      otp: null,
      otpSentAt: null,
      bookedAt: new Date().toISOString(),
    };

    setBookings(prev => [booking, ...prev]);
    setEvents(prev => prev.map(e =>
      e.id === eventId ? { ...e, sold: (e.sold || 0) + quantity } : e
    ));
    return { success: true, booking };
  }, [events, currentUser]);

  const getMyBookings = useCallback(() => {
    return bookings.filter(b => b.userId === currentUser?.id);
  }, [bookings, currentUser]);

  const getEventBookings = useCallback((eventId) => {
    return bookings.filter(b => b.eventId === eventId);
  }, [bookings]);

  // OTP & Verification
  const sendOTP = useCallback((bookingId) => {
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    setBookings(prev => prev.map(b =>
      b.id === bookingId ? { ...b, otp, otpSentAt: new Date().toISOString() } : b
    ));
    return otp;
  }, []);

  const verifyOTP = useCallback((bookingId, enteredOtp) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return { success: false, error: 'Booking not found' };
    if (booking.isVerified) return { success: false, error: 'Already verified' };
    if (booking.otp === enteredOtp) {
      setBookings(prev => prev.map(b =>
        b.id === bookingId ? { ...b, isVerified: true, verifiedAt: new Date().toISOString() } : b
      ));
      return { success: true };
    }
    return { success: false, error: 'Invalid OTP' };
  }, [bookings]);

  // Refund
  const requestRefund = useCallback((bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return { success: false, error: 'Booking not found' };

    const eventDate = new Date(booking.eventDate);
    const now = new Date();
    const hoursUntilEvent = (eventDate - now) / (1000 * 60 * 60);

    let refundAmount = 0;
    let message = '';

    if (hoursUntilEvent > 48) {
      refundAmount = booking.totalAmount * 0.95;
      message = `Refund of ₹${refundAmount.toFixed(0)} will be credited in 3-5 business days (5% platform fee deducted)`;
    } else if (hoursUntilEvent > 24) {
      refundAmount = booking.totalAmount * 0.5;
      message = `Partial refund of ₹${refundAmount.toFixed(0)} (50%) will be credited in 3-5 business days`;
    } else {
      return { success: false, error: 'Cancellation not allowed within 24 hours of the event. No refund available.' };
    }

    setBookings(prev => prev.map(b =>
      b.id === bookingId ? { ...b, status: 'Cancelled', refundAmount, refundStatus: 'Processing' } : b
    ));
    return { success: true, refundAmount, message };
  }, [bookings]);

  // Toast notifications
  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const value = {
    currentUser,
    events,
    bookings,
    toasts,
    login,
    signup,
    logout,
    upgradeToOrganizer,
    workerLogin,
    addEvent,
    getMyEvents,
    createBooking,
    getMyBookings,
    getEventBookings,
    sendOTP,
    verifyOTP,
    requestRefund,
    showToast,
    removeToast,
    setEvents,
    setBookings,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
