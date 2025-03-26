
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Employees from "./pages/Employees";
import Planning from "./pages/Planning";
import Stations from "./pages/Stations";
import Ventes from "./pages/Ventes";
import Citernes from "./pages/Citernes";
import Produits from "./pages/Produits";
import Fournisseurs from "./pages/Fournisseurs";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/employees" element={
              <ProtectedRoute>
                <Employees />
              </ProtectedRoute>
            } />
            <Route path="/planning" element={
              <ProtectedRoute>
                <Planning />
              </ProtectedRoute>
            } />
            <Route path="/stations" element={
              <ProtectedRoute>
                <Stations />
              </ProtectedRoute>
            } />
            <Route path="/ventes" element={
              <ProtectedRoute>
                <Ventes />
              </ProtectedRoute>
            } />
            <Route path="/citernes" element={
              <ProtectedRoute>
                <Citernes />
              </ProtectedRoute>
            } />
            <Route path="/produits" element={
              <ProtectedRoute>
                <Produits />
              </ProtectedRoute>
            } />
            <Route path="/fournisseurs" element={
              <ProtectedRoute>
                <Fournisseurs />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            
            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
