export function Button({ children, onClick, className = "", variant }) {
    return (
      <button
        onClick={onClick}
        className={`px-4 py-2 rounded font-semibold shadow bg-blue-500 text-white hover:bg-blue-600 ${className}`}
      >
        {children}
      </button>
    );
  }
  