import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Public site
import Cursor from './components/ui/Cursor';
import HeroSection from './components/sections/HeroSection';
import Ticker from './components/sections/Ticker';
import ServicesSection from './components/sections/ServicesSection';
import WorksSection from './components/sections/WorksSection';
import StatsSection from './components/sections/StatsSection';
import ProcessSection from './components/sections/ProcessSection';
import TestimonialsSection from './components/sections/TestimonialsSection';
import ContactSection from './components/sections/ContactSection';
import Footer from './components/sections/Footer';

// Admin
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import ProtectedRoute from './pages/admin/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminServices from './pages/admin/AdminServices';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminClients from './pages/admin/AdminClients';
import AdminTeam from './pages/admin/AdminTeam';
import AdminBlog from './pages/admin/AdminBlog';
import AdminJobs from './pages/admin/AdminJobs';
import AdminSEO from './pages/admin/AdminSEO';
import AdminSettings from './pages/admin/AdminSettings';

function PublicSite() {
  return (
    <>
      <div className="scanline" />
      <Cursor />
      <main>
        <HeroSection />
        <Ticker />
        <ServicesSection />
        <StatsSection />
        <WorksSection />
        <ProcessSection />
        <TestimonialsSection />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Public website ── */}
          <Route path="/" element={<PublicSite />} />

          {/* ── Admin login ── */}
          <Route path="/admin" element={<AdminLogin />} />

          {/* ── Admin dashboard (protected) ── */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard"    element={<AdminDashboard />} />
            <Route path="projects"     element={<AdminProjects />} />
            <Route path="services"     element={<AdminServices />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="clients"      element={<AdminClients />} />
            <Route path="team"         element={<AdminTeam />} />
            <Route path="blog"         element={<AdminBlog />} />
            <Route path="jobs"         element={<AdminJobs />} />
            <Route path="seo"          element={<AdminSEO />} />
            <Route path="settings"     element={<AdminSettings />} />
          </Route>

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
