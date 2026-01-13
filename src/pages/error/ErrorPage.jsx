import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";

export const ErrorPage = () => {
  return (
    <div className="mx-auto flex min-h-96 max-w-4xl flex-col items-center justify-center space-y-4 text-center">
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
