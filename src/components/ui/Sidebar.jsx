import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard, Ticket, History, User, Plus, BarChart3, Building2,
  Users, ScanLine, Search, Shield, Settings, ChevronLeft, ChevronRight,
  CalendarDays, CreditCard, FileText, QrCode
} from 'lucide-react';
import { useState } from 'react';

const menuConfig = {
  USER: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/dashboard/tickets', icon: Ticket, label: 'My Tickets' },
    { to: '/dashboard/history', icon: History, label: 'Booking History' },
    { to: '/dashboard/profile', icon: User, label: 'Profile' },
    { type: 'divider' },
    { to: '/organizer/create', icon: Plus, label: 'Create Event', highlight: true },
  ],
  ORGANIZER: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/organizer', icon: CalendarDays, label: 'My Events' },
    { to: '/organizer/create', icon: Plus, label: 'Create Event', highlight: true },
    { to: '/organizer/bank', icon: CreditCard, label: 'Bank Details' },
    { type: 'divider' },
    { to: '/dashboard/tickets', icon: Ticket, label: 'My Tickets' },
    { to: '/dashboard/profile', icon: User, label: 'Profile' },
  ],
  WORKER: [
    { to: '/worker', icon: ScanLine, label: 'Scan & Verify', end: true },
    { to: '/worker/search', icon: Search, label: 'Search Guests' },
    { to: '/worker/list', icon: Users, label: 'Guest List' },
  ],
  ADMIN: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/events', icon: CalendarDays, label: 'All Events' },
    { to: '/admin/users', icon: Users, label: 'All Users' },
    { to: '/admin/revenue', icon: BarChart3, label: 'Revenue' },
    { type: 'divider' },
    { to: '/dashboard/profile', icon: User, label: 'Profile' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ],
};

export default function Sidebar() {
  const { currentUser } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const role = currentUser?.role || 'USER';
  const menu = menuConfig[role] || menuConfig.USER;

  return (
    <aside className={`sticky top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-64'}`}>
      {/* User card */}
      {!collapsed && (
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <img
              src={currentUser?.avatar || 'https://ui-avatars.com/api/?name=U&background=ccc&color=fff'}
              alt=""
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-primary/20"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{currentUser?.name || 'Guest'}</p>
              <p className="text-xs text-primary font-medium">{role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menu.map((item, index) => {
          if (item.type === 'divider') {
            return <div key={index} className="my-3 border-t border-gray-100" />;
          }
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : item.highlight
                    ? 'text-primary hover:bg-primary/5'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } ${collapsed ? 'justify-center' : ''}`
              }
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${item.highlight ? 'group-hover:scale-110 transition-transform' : ''}`} />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.highlight && (
                <span className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse-green" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-3 border-t border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}
