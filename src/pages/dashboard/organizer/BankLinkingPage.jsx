import { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Building2, CreditCard, CheckCircle, Plus, Trash2, Shield } from 'lucide-react';

export default function BankLinkingPage() {
  const { currentUser, showToast } = useApp();
  const [accounts, setAccounts] = useState([
    { id: 1, name: 'Priya Sharma', number: '****4521', ifsc: 'SBIN0001234', bank: 'State Bank of India', primary: true, verified: true },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', number: '', ifsc: '', bank: '' });

  const addAccount = (e) => {
    e.preventDefault();
    setAccounts(prev => [...prev, { ...form, id: Date.now(), primary: prev.length === 0, verified: false }]);
    setForm({ name: '', number: '', ifsc: '', bank: '' });
    setShowForm(false);
    showToast('Bank account added! Verification in progress.', 'success');
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bank Details</h1>
        <p className="text-sm text-gray-500 mt-1">Link your bank account to receive event revenue payouts</p>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-sm text-gray-700">Your bank details are encrypted and secure. We use industry-standard security protocols to protect your financial information.</p>
      </div>

      {/* Linked Accounts */}
      <div className="space-y-3">
        {accounts.map(acc => (
          <div key={acc.id} className={`bg-white rounded-xl border p-5 ${acc.primary ? 'border-primary/30 ring-1 ring-primary/10' : 'border-gray-100'}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{acc.bank}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{acc.name} • A/C {acc.number}</p>
                  <p className="text-xs text-gray-400">IFSC: {acc.ifsc}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {acc.primary && <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">Primary</span>}
                    {acc.verified ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-600 text-xs font-medium rounded-full">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-xs font-medium rounded-full">Pending Verification</span>
                    )}
                  </div>
                </div>
              </div>
              {!acc.primary && (
                <button onClick={() => setAccounts(prev => prev.filter(a => a.id !== acc.id))} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Account */}
      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-gray-500 hover:border-primary hover:text-primary transition-all">
          <Plus className="w-4 h-4" /> Add Bank Account
        </button>
      ) : (
        <form onSubmit={addAccount} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4 animate-fade-in">
          <h3 className="text-base font-semibold text-gray-900">Add New Account</h3>
          {[
            { key: 'name', label: 'Account Holder Name', placeholder: 'John Doe' },
            { key: 'number', label: 'Account Number', placeholder: '1234567890' },
            { key: 'ifsc', label: 'IFSC Code', placeholder: 'SBIN0001234' },
            { key: 'bank', label: 'Bank Name', placeholder: 'State Bank of India' },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              <input type="text" value={form[field.key]} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                placeholder={field.placeholder} required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
          ))}
          <div className="flex gap-3">
            <button type="submit" className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:shadow-md transition-all">Save Account</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-all">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
