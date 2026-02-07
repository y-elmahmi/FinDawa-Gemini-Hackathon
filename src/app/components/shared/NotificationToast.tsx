import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'info';

interface NotificationToastProps {
  type: NotificationType;
  message: string;
  onClose: () => void;
}

export function NotificationToast({ type, message, onClose }: NotificationToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    error: <AlertCircle className="w-5 h-5 text-red-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />
  };

  const backgrounds = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200'
  };

  return (
    <div className={`w-96 p-4 rounded-2xl shadow-xl border ${backgrounds[type]} animate-in slide-in-from-right pointer-events-auto bg-white`}>
      <div className="flex items-start gap-3">
        {icons[type]}
        <p className="flex-1 text-sm text-gray-700">{message}</p>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

interface NotificationManagerProps {
  notifications: Array<{ id: number; type: NotificationType; message: string }>;
  removeNotification: (id: number) => void;
}

export function NotificationManager({ notifications, removeNotification }: NotificationManagerProps) {
  return (
    <div className="fixed top-6 right-6 z-50 space-y-4 pointer-events-none flex flex-col items-end">
      {notifications.map((notif) => (
        <NotificationToast
          key={notif.id}
          type={notif.type}
          message={notif.message}
          onClose={() => removeNotification(notif.id)}
        />
      ))}
    </div>
  );
}