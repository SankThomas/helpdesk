import { Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { LandingPage } from "./layouts/LandingPage";
import { MainLayout } from "./layouts/MainLayout";
import { SignUpPage } from "./pages/auth/SignUpPage";
import { SignInPage } from "./pages/auth/SignInPage";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { TicketListPage } from "./pages/tickets/TicketListPage";
import { TicketDetailPage } from "./pages/tickets/TicketDetailPage";
import { CreateTicketPage } from "./pages/tickets/CreateTicketPage";
import { EditTicketPage } from "./pages/tickets/EditTicketPage";
import { UsersPage } from "./pages/users/UsersPage";
import { SettingsPage } from "./pages/settings/SettingsPage";
import { ReportsPage } from "./pages/reports/ReportsPage";
import { ProtectedLayout } from "./layouts/ProtectedLayout";
import { ErrorPage } from "./pages/error/ErrorPage";

export default function App() {
  return (
    <div className="min-h-screen bg-surface-50 transition-colors">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />

        <Route
          path="/*"
          element={
            <>
              <SignedIn>
                <MainLayout>
                  <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/tickets" element={<TicketListPage />} />
                    <Route
                      path="/tickets/:ticketId"
                      element={<TicketDetailPage />}
                    />
                    <Route
                      path="/tickets/:ticketId/edit"
                      element={<EditTicketPage />}
                    />
                    <Route path="/tickets/new" element={<CreateTicketPage />} />
                    <Route
                      path="/users"
                      element={
                        <ProtectedLayout>
                          <UsersPage />
                        </ProtectedLayout>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <ProtectedLayout>
                          <SettingsPage />
                        </ProtectedLayout>
                      }
                    />
                    <Route
                      path="/reports"
                      element={
                        <ProtectedLayout>
                          <ReportsPage />
                        </ProtectedLayout>
                      }
                    />
                    <Route path="*" element={<ErrorPage />} />
                  </Routes>
                </MainLayout>
              </SignedIn>

              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
      </Routes>
    </div>
  );
}
