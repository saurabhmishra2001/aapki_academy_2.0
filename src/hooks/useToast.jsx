import { useState } from 'react';
import { Toast } from '../components/ui/toast';

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = ({ title, description, type = 'default', duration = 3000 }) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = {
      id,
      title,
      description,
      type,
      duration,
    };

    setToasts((current) => [...current, newToast]);

    setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
    }, duration);
  };

  const Toaster = () => (
    <div className="fixed top-4 right-4 z-50 space-y-4">
      {toasts.map((t) => (
        <Toast
          key={t.id}
          message={t.description}
          type={t.type}
          duration={t.duration}
        />
      ))}
    </div>
  );

  return { toast, Toaster };
}