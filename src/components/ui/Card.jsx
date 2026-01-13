export const Card = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`glass border-surface-200 rounded-xl border shadow-sm transition-all duration-200 hover:shadow-md ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`border-surface-200 border-b px-6 py-4 ${className}`}
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
      className={`border-surface-200 bg-surface-50 border-t px-6 py-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
