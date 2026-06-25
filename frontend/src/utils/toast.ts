import { ref } from 'vue';

export type ToastType = 'info' | 'success' | 'error';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

const toasts = ref<Toast[]>([]);
let toastIdCounter = 0;

export function useToast() {
  const showToast = (message: string, type: ToastType = 'info', duration = 4000) => {
    const id = ++toastIdCounter;
    const toast: Toast = { id, message, type, duration };
    toasts.value.push(toast);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const showSuccess = (message: string, duration?: number) => showToast(message, 'success', duration);
  const showError = (message: string, duration?: number) => showToast(message, 'error', duration);
  const showInfo = (message: string, duration?: number) => showToast(message, 'info', duration);

  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  };

  return {
    toasts,
    showToast,
    showSuccess,
    showError,
    showInfo,
    removeToast,
  };
}
