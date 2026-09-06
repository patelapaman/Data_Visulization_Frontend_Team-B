import React, { useEffect } from "react";
import { CheckCircle2, XCircle, Info } from "lucide-react";
import "./Toast.css";

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

/**
 * Toast
 * A small, self-dismissing notification. Render it conditionally
 * from parent state, e.g.:
 *
 *   const [toast, setToast] = useState(null);
 *   ...
 *   setToast({ type: "success", message: "Settings saved" });
 *   ...
 *   {toast && (
 *     <Toast
 *       type={toast.type}
 *       message={toast.message}
 *       onClose={() => setToast(null)}
 *     />
 *   )}
 */
export default function Toast({ type = "success", message, onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const Icon = ICONS[type] || Info;

  return (
    <div className={`toast toast-${type}`} role="status">
      <Icon size={18} />
      <span>{message}</span>
    </div>
  );
}
