export const Card = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`glass rounded-xl border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`border-b border-gray-200 px-6 py-4 ${className}`}
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
      className={`border-t border-gray-200 bg-gray-50 px-6 py-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
