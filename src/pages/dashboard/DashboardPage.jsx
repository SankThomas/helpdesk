import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect } from "react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { UserDashboard } from "../../components/dashboard/UserDashboard";
import { AgentDashboard } from "../../components/dashboard/AgentDashboard";
import { AdminDashboard } from "../../components/dashboard/AdminDashboard";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

export const DashboardPage = () => {
  const { user } = useUser();
  const { currentUser } = useCurrentUser();

  const createUser = useMutation(api.users.createUser);

  useEffect(() => {
    if (user && !currentUser) {
      createUser({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        name: user.fullName || user.firstName || "User",
        role: "user", // Default role
      });
    }
  }, [user, currentUser, createUser]);

  if (!currentUser) {
    return <LoadingSpinner />;
  }

  // Render dashboard based on user role
  switch (currentUser.role) {
    case "admin":
      return <AdminDashboard user={currentUser} />;
    case "agent":
      return <AgentDashboard user={currentUser} />;
    default:
      return <UserDashboard user={currentUser} />;
  }
};
