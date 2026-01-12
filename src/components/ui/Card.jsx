export const Card = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`glass rounded-xl border border-surface-200 shadow-sm hover:shadow-md transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`px-6 py-4 border-b border-surface-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardContent = ({ children, className = "", ...props }) => {
  return (
    <div className={`px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`px-6 py-4 border-t border-surface-200 bg-surface-50 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
