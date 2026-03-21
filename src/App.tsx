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
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <DashboardLayout>
              <OverviewPage />
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
