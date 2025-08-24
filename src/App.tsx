import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopBar from "./components/TopBar";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import AllFormPage from "./pages/AllFormPage";
import LoanFormPage from "./pages/LoanFormPage";
import ConfirmationsPage from "./pages/ConfirmationsPage";
import LoanApprovedPage from "./pages/LoanApprovedPage";
import BorrowersListPage from "./pages/BorrowersListPage";
import BorrowerDetailPage from "./pages/BorrowerDetailPage";
import InvestmentApprovedPage from "./pages/InvestmentApprovedPage";
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <TopBar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/all-form" element={<AllFormPage />} />
          <Route path="/loan-form" element={<LoanFormPage />} />
          <Route path="/confirmations" element={<ConfirmationsPage />} />
          <Route path="/loan-approved" element={<LoanApprovedPage />} />
          <Route path="/borrowers-list" element={<BorrowersListPage />} />
          <Route path="/borrower-detail" element={<BorrowerDetailPage />} />
          <Route path="/investment-approved" element={<InvestmentApprovedPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
