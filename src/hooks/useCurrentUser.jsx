import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export const useCurrentUser = () => {
  const { user, isLoaded: clerkLoaded } = useUser();

  const convexUser = useQuery(
    api.users.getCurrentUser,
    user ? { clerkId: user.id } : "skip",
  );

  // Clerk is still loading
  if (!clerkLoaded) {
    return {
      currentUser: null,
      isLoading: true,
      isAdmin: false,
      clerkUser: null,
    };
  }

  // No logged in user
  if (!user) {
    return {
      currentUser: null,
      isLoading: false,
      isAdmin: false,
      clerkUser: null,
    };
  }

  // Convex is still loading
  if (convexUser === undefined) {
    return {
      currentUser: null,
      isLoading: true,
      isAdmin: false,
      clerkUser: user,
    };
  }

  return {
    currentUser: convexUser,
    clerkUser: user,
    isLoading: false,
    isAdmin: convexUser?.role === "admin",
  };
};
