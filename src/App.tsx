import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Splash from "./pages/Splash";
import Home from "./pages/Home";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Lessons from "./pages/Lessons";
import Videos from "./pages/Videos";
import Profile from "./pages/Profile";
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

// Protected Admin Route Component - SECURE: Deny by default, allow only when explicitly confirmed
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const { hasAdminAccess, loading: adminLoading } = useAdminAccess();

  console.log('ProtectedAdminRoute - Auth loading:', authLoading, 'Admin loading:', adminLoading);
  console.log('ProtectedAdminRoute - User:', user?.email, 'Has admin access:', hasAdminAccess);

  // SECURITY: Wait for both auth and admin loading to complete before making any decisions
  if (authLoading || adminLoading) {
    console.log('Still loading, showing loading screen');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // SECURITY: No user means redirect to auth
  if (!user) {
    console.log('No user, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  // SECURITY: DENY BY DEFAULT - Only allow access if user is explicitly confirmed as admin
  // This prevents race conditions and ensures no unauthorized access
  if (!hasAdminAccess) {
    console.log('User authenticated but no admin access confirmed, redirecting to home');
    return <Navigate to="/" replace />;
  }

  // SECURITY: Only grant access when all conditions are met:
  // 1. Not loading auth
  // 2. Not loading admin status  
  // 3. User exists
  // 4. User has confirmed admin access
  console.log('Admin access explicitly confirmed, rendering children');
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
          <Route path="/splash" element={<Splash />} />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/profile" element={<Profile />} />
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
