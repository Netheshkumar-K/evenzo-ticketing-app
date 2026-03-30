import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { categories } from '../../../data/mockData';
import { ArrowLeft, ArrowRight, Upload, Check, Image, MapPin, Calendar, DollarSign, FileText } from 'lucide-react';

const steps = ['Basic Info', 'Date & Venue', 'Tickets & Pricing', 'Poster', 'Review'];

export default function CreateEventPage() {
  const { addEvent, upgradeToOrganizer, currentUser, showToast } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: '', description: '', category: 'Concert',
    date: '', time: '', venue: '',
    individual: '', combo: '', group: '', capacity: '',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop',
  });

  const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const canProceed = () => {
    if (step === 0) return form.title && form.description && form.category;
    if (step === 1) return form.date && form.time && form.venue;
    if (step === 2) return form.individual && form.capacity;
    return true;
  };

  const handlePublish = () => {
    if (currentUser?.role === 'USER') upgradeToOrganizer();
    const event = addEvent({
      title: form.title, description: form.description, category: form.category,
      date: form.date, time: form.time, venue: form.venue,
      image: form.image,
      price: {
        individual: parseInt(form.individual) || 0,
        combo: parseInt(form.combo) || parseInt(form.individual) * 2 || 0,
        group: parseInt(form.group) || parseInt(form.individual) * 4 || 0,
      },
      capacity: parseInt(form.capacity) || 100,
      trending: false,
    });
    showToast('Event published successfully! 🎉', 'success');
    navigate(`/organizer/event/${event.id}`);
  };

  const posters = [
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800&h=400&fit=crop',
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
        <p className="text-sm text-gray-500 mt-1">Fill in the details to publish your event</p>
      </div>

      {/* Progress Stepper */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              i < step ? 'bg-primary text-white' : i === step ? 'bg-primary text-white animate-pulse-green' : 'bg-gray-100 text-gray-400'
            }`}>
              {i < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${i < step ? 'bg-primary' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>
      <p className="text-sm font-medium text-primary">Step {step + 1}: {steps[step]}</p>

      {/* Step Content */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 animate-fade-in">
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Event Title *</label>
              <input type="text" value={form.title} onChange={(e) => updateForm('title', e.target.value)} placeholder="e.g., Neon Nights Music Festival 2025"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {categories.filter(c => c.name !== 'All').map(cat => (
                  <button key={cat.name} onClick={() => updateForm('category', cat.name)}
                    className={`px-3 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                      form.category === cat.name ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-gray-600 hover:border-gray-200'
                    }`}>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
              <textarea rows={4} value={form.description} onChange={(e) => updateForm('description', e.target.value)} placeholder="Tell attendees what to expect..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Date *</label>
                <input type="date" value={form.date} onChange={(e) => updateForm('date', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Time *</label>
                <input type="time" value={form.time} onChange={(e) => updateForm('time', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Venue *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" value={form.venue} onChange={(e) => updateForm('venue', e.target.value)} placeholder="e.g., Jawaharlal Nehru Stadium, Chennai"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Individual ₹ *</label>
                <input type="number" value={form.individual} onChange={(e) => updateForm('individual', e.target.value)} placeholder="999"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Combo (2) ₹</label>
                <input type="number" value={form.combo} onChange={(e) => updateForm('combo', e.target.value)} placeholder="1799"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Group (5) ₹</label>
                <input type="number" value={form.group} onChange={(e) => updateForm('group', e.target.value)} placeholder="3999"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Total Capacity *</label>
              <input type="number" value={form.capacity} onChange={(e) => updateForm('capacity', e.target.value)} placeholder="500"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Choose a poster for your event:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {posters.map((url, i) => (
                <button key={i} onClick={() => updateForm('image', url)}
                  className={`rounded-xl overflow-hidden border-3 transition-all ${form.image === url ? 'border-primary shadow-lg scale-[1.02]' : 'border-transparent hover:border-gray-200'}`}>
                  <img src={url} alt="" className="w-full h-28 object-cover" />
                </button>
              ))}
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center">
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Or drag & drop your own poster image</p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden">
              <img src={form.image} alt="" className="w-full h-48 object-cover" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Title', value: form.title },
                { label: 'Category', value: form.category },
                { label: 'Date', value: form.date },
                { label: 'Time', value: form.time },
                { label: 'Venue', value: form.venue },
                { label: 'Capacity', value: form.capacity },
                { label: 'Individual Price', value: `₹${form.individual}` },
                { label: 'Combo Price', value: form.combo ? `₹${form.combo}` : 'N/A' },
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-xs text-gray-400 uppercase">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-900">{item.value || '—'}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600">{form.description}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        {step < steps.length - 1 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={handlePublish}
            className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-light rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5">
            🚀 Publish Event
          </button>
        )}
      </div>
    </div>
  );
}
