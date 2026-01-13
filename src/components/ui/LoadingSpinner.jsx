import React from "react";

export const LoadingSpinner = () => {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="border-primary-600 size-8 animate-spin rounded-full border-b-2"></div>
    </div>
  );
};
