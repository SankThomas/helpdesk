import { forwardRef } from "react";

const variants = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm hover:shadow-md",
  secondary:
    "bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 shadow-sm hover:shadow-md",
  outline:
    "border border-surface-300 bg-white text-surface-700 hover:bg-surface-50 focus:ring-primary-500",
  ghost: "text-surface-700 hover:bg-surface-100 hover:text-surface-900",
  danger:
    "bg-error-600 text-white hover:bg-error-700 focus:ring-error-500 shadow-sm hover:shadow-md",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export const Button = forwardRef(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    className = "",
    disabled = false,
    loading = false,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex transform items-center justify-center rounded-lg font-medium transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none active:scale-102 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className} `}
      {...props}
    >
      {loading && (
        <svg
          className="mr-2 -ml-1 size-4 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
});
