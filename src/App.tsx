import "./i18n/config";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Lessons from "./pages/Lessons";
import Videos from "./pages/Videos";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AdminArtworks from "./pages/admin/AdminArtworks";
import AdminLessons from "./pages/admin/AdminLessons";
import AdminVideos from "./pages/admin/AdminVideos";
import AdminProfile from "./pages/admin/AdminProfile";
import { useAuth } from "./hooks/useAuth";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-lg">Loading...</div></div>}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin/artworks" element={
              <ProtectedRoute>
                <AdminArtworks />
              </ProtectedRoute>
            } />
            <Route path="/admin/lessons" element={
              <ProtectedRoute>
                <AdminLessons />
              </ProtectedRoute>
            } />
            <Route path="/admin/videos" element={
              <ProtectedRoute>
                <AdminVideos />
              </ProtectedRoute>
            } />
            <Route path="/admin/profile" element={
              <ProtectedRoute>
                <AdminProfile />
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Suspense>
);

export default App;
