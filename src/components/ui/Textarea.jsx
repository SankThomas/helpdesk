import { forwardRef } from "react";

export const Textarea = forwardRef(function Textarea(
  { label, error, helperText, className = "", rows = 4, ...props },
  ref,
) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block font-medium text-gray-700">{label}</label>
      )}

      <textarea
        ref={ref}
        rows={rows}
        className={`focus:border-primary-500 focus:ring-primary-500 lg:resize-vertical block w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 ${
          error
            ? "focus:ring-error-500 border-rose-300 focus:border-rose-500"
            : ""
        } ${className} `}
        {...props}
      />

      {error && <p className="text-rose-600">{error}</p>}

      {helperText && !error && <p className="text-gray-500">{helperText}</p>}
    </div>
  );
});
