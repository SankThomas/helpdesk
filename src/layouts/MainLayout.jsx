import { useState } from "react";
import { Sidebar } from "../components/ui/Sidebar";
import { Navbar } from "../components/ui/Navbar";
import { useCurrentUser } from "../hooks/useCurrentUser";

export const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser } = useCurrentUser();

  return (
    <div className="flex h-screen bg-surface-50">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        userRole={currentUser?.role}
      />

      <div className="flex-1 flex flex-col min-w-0">
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
