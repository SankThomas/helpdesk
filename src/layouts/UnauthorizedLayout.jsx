import React from "react";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";

export const UnauthorizedLayout = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto min-h-96 space-y-4">
      <h1>You are not authorized to view this page</h1>
      <p>If you think this was a mistake, contact your administrator</p>
      <Link to="/dashboard">
        <Button to="/dashboard" variant="outline" size="sm">
          &larr; Back to dashboard
        </Button>
      </Link>
    </div>
  );
};
