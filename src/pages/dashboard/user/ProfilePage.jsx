import { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { User, Mail, Phone, Shield, Camera, Save, Star } from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, upgradeToOrganizer, showToast } = useApp();
  const [form, setForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
  });

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Profile updated successfully!', 'success');
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your personal information</p>
      </div>

      {/* Avatar */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <img src={currentUser?.avatar} alt="" className="w-20 h-20 rounded-2xl object-cover ring-4 ring-primary/10" />
            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary text-white rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{currentUser?.name}</h3>
            <p className="text-sm text-gray-500">{currentUser?.email}</p>
            <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
              <Shield className="w-3 h-3" /> {currentUser?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <h3 className="text-base font-semibold text-gray-900">Personal Information</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="tel" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
        </div>

        <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:shadow-md transition-all">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </form>

      {/* Upgrade to Organizer */}
      {currentUser?.role === 'USER' && (
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-primary/20 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Star className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">Become an Organizer</h3>
              <p className="text-sm text-gray-600 mb-4">Create and manage your own events, sell tickets, and grow your audience.</p>
              <button onClick={() => { upgradeToOrganizer(); showToast('You are now an Organizer! 🎉', 'success'); }}
                className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:shadow-md transition-all">
                Upgrade to Organizer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
