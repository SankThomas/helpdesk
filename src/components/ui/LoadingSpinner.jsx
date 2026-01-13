import React from "react";

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full size-8 border-b-2 border-primary-600"></div>
    </div>
  );
};
