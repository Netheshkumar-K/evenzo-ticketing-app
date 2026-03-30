import { useApp } from '../../context/AppContext';
import { getRefundAmount } from '../../utils/helpers';
import { formatCurrency } from '../../utils/helpers';
import Modal from '../ui/Modal';
import { AlertTriangle, Clock, XCircle, CheckCircle } from 'lucide-react';

export default function RefundModal({ booking, onClose }) {
  const { requestRefund, showToast } = useApp();
  const refundInfo = getRefundAmount(booking.totalAmount, booking.eventDate);

  const handleRefund = () => {
    const result = requestRefund(booking.id);
    if (result.success) {
      showToast(result.message, 'success');
      onClose();
    } else {
      showToast(result.error, 'error');
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Cancel & Refund" size="md">
      <div className="space-y-5">
        {/* Event info */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <img src={booking.eventImage} alt="" className="w-12 h-12 rounded-lg object-cover" />
          <div>
            <p className="text-sm font-semibold text-gray-900">{booking.eventTitle}</p>
            <p className="text-xs text-gray-500">Ticket: {booking.ticketId} • {formatCurrency(booking.totalAmount)}</p>
          </div>
        </div>

        {/* Refund Policy */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900">Refund Policy</h4>
          <div className="space-y-2">
            {[
              { icon: CheckCircle, text: '> 48 hours before event: 95% refund (5% platform fee)', color: 'text-green-500', active: refundInfo.type === 'full' },
              { icon: AlertTriangle, text: '24–48 hours before event: 50% refund', color: 'text-amber-500', active: refundInfo.type === 'partial' },
              { icon: XCircle, text: '< 24 hours before event: No refund', color: 'text-red-500', active: refundInfo.type === 'none' },
            ].map((rule, i) => (
              <div key={i} className={`flex items-start gap-2 p-3 rounded-lg ${rule.active ? 'bg-gray-50 border border-gray-200' : ''}`}>
                <rule.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${rule.color}`} />
                <span className={`text-sm ${rule.active ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>{rule.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Refund amount */}
        <div className={`p-4 rounded-xl border ${refundInfo.type === 'none' ? 'bg-red-50 border-red-200' : 'bg-primary/5 border-primary/20'}`}>
          <p className="text-sm font-medium text-gray-700">{refundInfo.message}</p>
          {refundInfo.type !== 'none' && (
            <>
              <p className="text-2xl font-bold text-primary mt-1">{formatCurrency(refundInfo.amount)}</p>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Refund credited in 3–5 business days
              </p>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium text-sm rounded-xl hover:bg-gray-200 transition-colors">
            Keep Ticket
          </button>
          {refundInfo.type !== 'none' ? (
            <button onClick={handleRefund} className="flex-1 py-3 bg-red-500 text-white font-semibold text-sm rounded-xl hover:bg-red-600 transition-colors">
              Confirm Cancellation
            </button>
          ) : (
            <button disabled className="flex-1 py-3 bg-gray-200 text-gray-400 font-medium text-sm rounded-xl cursor-not-allowed">
              No Refund Available
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
