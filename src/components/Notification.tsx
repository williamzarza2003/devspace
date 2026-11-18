import { useEffect } from "react";

type NotificationProps = {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
};

function Notification({ message, type, onClose }: NotificationProps) {
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      onClose();
    }, 4000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [message, onClose]);

  if (!message) {
    return null;
  }

  return (
    <div
      className={`notification notification-${type}`}
      role="status"
      aria-live="polite"
    >
      <span className="notification-indicator" />

      <p>{message}</p>

      <button
        className="notification-close"
        type="button"
        onClick={onClose}
        aria-label="Cerrar notificación"
      >
        ×
      </button>
    </div>
  );
}

export default Notification;
