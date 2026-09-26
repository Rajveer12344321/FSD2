export default function Toast({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="toast" role="alert">
      <span className="toast-icon">!</span>
      <span className="toast-text">{message}</span>
      <button className="toast-close" onClick={onDismiss} aria-label="Dismiss">
        &times;
      </button>
    </div>
  );
}
