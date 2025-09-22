import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import AdminUsers from "./pages/admin/AdminUsers";
import { useAuth } from "./hooks/useAuth";
import { useAdminAccess } from "./hooks/useAdminAccess";
import { LanguageProvider } from "./contexts/LanguageContext";

const queryClient = new QueryClient();

// Protected Admin Route Component
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const { hasAdminAccess, loading: adminLoading } = useAdminAccess();

  console.log('ProtectedAdminRoute - Auth loading:', authLoading, 'Admin loading:', adminLoading);
  console.log('ProtectedAdminRoute - User:', user?.email, 'Has admin access:', hasAdminAccess);

  // Wait for both auth and admin loading to complete
  if (authLoading || adminLoading) {
    console.log('Still loading, showing loading screen');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Only redirect if we're sure there's no user (not loading and no user)
  if (!authLoading && !user) {
    console.log('No user and not loading, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  // Only redirect if we're sure user doesn't have admin access (not loading and no access)
  if (!authLoading && !adminLoading && user && !hasAdminAccess) {
    console.log('User authenticated but no admin access, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('Admin access granted, rendering children');
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
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
          <Route path="/admin" element={
            <ProtectedAdminRoute>
              <Navigate to="/admin/users" replace />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/artworks" element={
            <ProtectedAdminRoute>
              <AdminArtworks />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/lessons" element={
            <ProtectedAdminRoute>
              <AdminLessons />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/videos" element={
            <ProtectedAdminRoute>
              <AdminVideos />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/profile" element={
            <ProtectedAdminRoute>
              <AdminProfile />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedAdminRoute>
              <AdminUsers />
            </ProtectedAdminRoute>
          } />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
