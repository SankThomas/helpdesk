import { forwardRef } from "react";

export const Select = forwardRef(function Select(
  { label, error, children, className = "", ...props },
  ref,
) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-surface-700 block font-medium">{label}</label>
      )}

      <select
        ref={ref}
        className={`border-surface-300 text-surface-900 focus:border-primary-500 focus:ring-primary-500 disabled:bg-surface-50 disabled:text-surface-500 block w-full rounded-lg border bg-white px-3 py-2 transition-all duration-200 focus:ring-1 focus:outline-none disabled:cursor-not-allowed ${
          error
            ? "border-error-300 focus:border-error-500 focus:ring-error-500"
            : ""
        } ${className} `}
        {...props}
      >
        {children}
      </select>

      {error && <p className="text-error-600">{error}</p>}
    </div>
  );
});
