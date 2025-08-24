import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppKitProvider } from "./components/ReownButtonProvider";
import BottomNav from "./components/BottomNav";
import LandingPage from "./pages/LandingPage";
import AllFormPage from "./pages/AllFormPage";
import LoanFormPage from "./pages/LoanFormPage";
import ConfirmationsPage from "./pages/ConfirmationsPage";
import BorrowersListPage from "./pages/BorrowersListPage";
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppKitProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            
            {/* User Flow Routes */}
            <Route path="/verification" element={<AllFormPage />} />
            <Route path="/loan-form" element={<LoanFormPage />} />
            <Route path="/confirmations" element={<ConfirmationsPage />} />
            
            {/* Main App Routes */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/borrowers-list" element={<BorrowersListPage />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </BrowserRouter>
      </TooltipProvider>
    </AppKitProvider>
  </QueryClientProvider>
);

export default App;
