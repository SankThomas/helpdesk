import React, { useEffect } from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { useUser } from "@clerk/clerk-react";

export const LandingPage = () => {
  const { user } = useUser();
  let navigate = useNavigate();
  const { currentUser } = useCurrentUser();

  useEffect(() => {
    if (currentUser && user) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate, user]);

  return (
    <div className="bg-white">
      <header className="fixed flex w-full items-center justify-between p-4">
        <h2 className="text-2xl font-bold">Helpdesk</h2>

        <nav>
          <ul className="flex items-center justify-center gap-4">
            <li>
              {currentUser ? (
                <Link to="/dashboard">
                  <Button variant="primary">Your dashboard</Button>
                </Link>
              ) : (
                <Link to="/sign-in">
                  <Button variant="primary">
                    Sign In or Create an Account
                  </Button>
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </header>

      <main className="mx-auto flex h-screen max-w-4xl items-center justify-center text-center">
        <article className="space-y-6">
          <h1 className="text-4xl! lg:text-6xl!">Helpdesk by Sankara</h1>
          <p className="text-surface-500 text-lg! lg:text-xl!">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Et hic amet
            porro quibusdam, asperiores cupiditate optio ullam inventore
            molestias eaque? Veniam molestiae expedita aut quaerat sit ad sed
            modi ratione.
          </p>

          <ul className="flex items-center justify-center gap-4">
            <li>
              {currentUser ? (
                <Link to="/dashboard">
                  <Button variant="primary">Your dashboard</Button>
                </Link>
              ) : (
                <Link to="/sign-in">
                  <Button variant="primary">
                    Sign In or Create an Account
                  </Button>
                </Link>
              )}
            </li>
          </ul>
        </article>
      </main>
    </div>
  );
};
