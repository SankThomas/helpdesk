import { useCurrentUser } from "../hooks/useCurrentUser";
import { UnauthorizedLayout } from "./UnauthorizedLayout";

export const ProtectedLayout = ({ children }) => {
  const { currentUser, isAdmin, isLoading } = useCurrentUser();

  if (isLoading) return null;
  if (!currentUser) return <UnauthorizedLayout />;
  if (!isAdmin) return <UnauthorizedLayout />;

  return <div>{children}</div>;
};
