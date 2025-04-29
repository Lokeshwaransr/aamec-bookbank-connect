
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { BookProvider } from "@/context/BookContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import RequestsPage from "./pages/RequestsPage";
import StatusPage from "./pages/StatusPage";
import ManageBooksPage from "./pages/ManageBooksPage";
import AdminRequestsPage from "./pages/AdminRequestsPage";
import PaymentsPage from "./pages/PaymentsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BookProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/requests" 
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <RequestsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/status" 
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <StatusPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/manage-books" 
                element={
                  <ProtectedRoute allowedRoles={["bookbankadmin"]}>
                    <ManageBooksPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin-requests" 
                element={
                  <ProtectedRoute allowedRoles={["bookbankadmin"]}>
                    <AdminRequestsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/payments" 
                element={
                  <ProtectedRoute allowedRoles={["bookbankclerk"]}>
                    <PaymentsPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </BookProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
