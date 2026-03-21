import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardLayout } from "@/components/DashboardLayout";
import OverviewPage  from "@/pages/OverviewPage";
import AccountsPage from "@/pages/AccountsPage";
import JournalPage  from "@/pages/JournalPage";
import RiskPage     from "@/pages/RiskPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import AuthPage from "@/pages/AuthPage";
import LandingPage from "@/pages/LandingPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "./pages/NotFound.tsx";
import { AuthProvider } from "@/context/AuthContext";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={
            <DashboardLayout>
              <OverviewPage />
            </DashboardLayout>
          } />
          <Route path="/settings" element={
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          } />
          <Route path="/accounts" element={
            <DashboardLayout>
              <AccountsPage />
            </DashboardLayout>
          } />
          <Route path="/journal" element={
            <DashboardLayout>
              <JournalPage />
            </DashboardLayout>
          } />
          <Route path="/risk" element={
            <DashboardLayout>
              <RiskPage />
            </DashboardLayout>
          } />
          <Route path="/analytics" element={
            <DashboardLayout>
              <AnalyticsPage />
            </DashboardLayout>
          } />
          <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
