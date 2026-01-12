import React from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export const LandingPage = () => {
  const { currentUser } = useCurrentUser();

  return (
    <div className="bg-white">
      <header className="flex items-center justify-between fixed w-full p-4">
        <h2 className="font-bold text-2xl">Helpdesk</h2>

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

      <main className="flex items-center justify-center h-screen max-w-4xl mx-auto text-center">
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
