import { forwardRef } from "react";

export const Select = forwardRef(function Select(
  { label, error, children, className = "", ...props },
  ref,
) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block font-medium text-gray-700">{label}</label>
      )}

      <select
        ref={ref}
        className={`focus:border-primary-500 focus:ring-primary-500 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 transition-all duration-200 focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 ${
          error
            ? "focus:ring-error-500 border-rose-300 focus:border-rose-500"
            : ""
        } ${className} `}
        {...props}
      >
        {children}
      </select>

      {error && <p className="text-rose-600">{error}</p>}
    </div>
  );
});
