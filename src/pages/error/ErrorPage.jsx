import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";

export const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto min-h-96 space-y-4">
      <h1>Oops, this page no longer exists</h1>
      <p>
        Seems like you have found a page that is no longer on the website.
        Apologies. Browse our other working pages.
      </p>
      <Link to="/dashboard">
        <Button variant="outline" size="sm">
          &larr; Back to dashboard
        </Button>
      </Link>
    </div>
  );
};
