import { forwardRef } from "react";

export const Select = forwardRef(function Select(
  { label, error, children, className = "", ...props },
  ref
) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block font-medium text-surface-700">{label}</label>
      )}

      <select
        ref={ref}
        className={`
          block w-full rounded-lg border border-surface-300 px-3 py-2
          bg-white text-surface-900
          focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
          disabled:cursor-not-allowed disabled:bg-surface-50 disabled:text-surface-500
          transition-all duration-200
          ${
            error
              ? "border-error-300 focus:border-error-500 focus:ring-error-500"
              : ""
          }
          ${className}
        `}
        {...props}
      >
        {children}
      </select>

      {error && <p className="text-error-600">{error}</p>}
    </div>
  );
});
