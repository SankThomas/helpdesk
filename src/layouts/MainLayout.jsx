import { useState } from "react";
import { Sidebar } from "../components/ui/Sidebar";
import { Navbar } from "../components/ui/Navbar";
import { useCurrentUser } from "../hooks/useCurrentUser";

export const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser } = useCurrentUser();

  return (
    <div className="bg-surface-50 flex h-screen">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        userRole={currentUser?.role}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          user={currentUser}
        />

        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};
