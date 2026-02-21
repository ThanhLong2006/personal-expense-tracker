import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import ErrorBoundary from "./components/ErrorBoundary";
import PWAInstallPrompt from "./components/PWAInstallPrompt";

// Public pages
import { Suspense, lazy } from "react";
const LandingPage = lazy(() => import("./pages/public/LandingPage"));
const AboutPage = lazy(() => import("./pages/public/AboutPage"));
const FeaturesPage = lazy(() => import("./pages/public/FeaturesPage"));
const PricingPage = lazy(() => import("./pages/public/PricingPage"));
const FaqPage = lazy(() => import("./pages/public/FaqPage"));
const BlogListPage = lazy(() => import("./pages/public/BlogListPage"));
const BlogDetailPage = lazy(() => import("./pages/public/BlogDetailPage"));
const CareerPage = lazy(() => import("./pages/public/CareerPage"));
const TermsPage = lazy(() => import("./pages/public/TermsPage"));
const PrivacyPage = lazy(() => import("./pages/public/PrivacyPage"));
const ContactPage = lazy(() => import("./pages/public/ContactPage"));

// Auth pages - Lazy loaded
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const VerifyOtpPage = lazy(() => import("./pages/auth/VerifyOtpPage"));
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/auth/ResetPasswordPage"));

// User pages - Lazy loaded
const UserDashboard = lazy(() => import("./pages/user/Dashboard"));
const TransactionsPage = lazy(() => import("./pages/user/TransactionsPage"));
const CategoriesPage = lazy(() => import("./pages/user/CategoriesPage"));
const StatisticsPage = lazy(() => import("./pages/user/StatisticsPage"));
const ReportsPage = lazy(() => import("./pages/user/ReportsPage"));
const SettingsPage = lazy(() => import("./pages/user/SettingsPage"));

// Admin pages - Lazy loaded
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminUsersPage = lazy(() => import("./pages/admin/UsersPage"));
const AdminUserDetailPage = lazy(() => import("./pages/admin/UserDetailPage"));
const AdminTransactionsPage = lazy(() => import("./pages/admin/TransactionsPage"));
const AdminCategoriesPage = lazy(() => import("./pages/admin/CategoriesPage"));
const AdminSystemPage = lazy(() => import("./pages/admin/SystemPage"));

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import AuthLayout from "./layouts/AuthLayout";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

// Protected route component
import ProtectedRoute from "./components/ProtectedRoute";

// Tạo QueryClient cho React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/**
 * Component chính của ứng dụng
 * - Cấu hình routing
 * - Cấu hình React Query
 * - Cấu hình Toast notifications
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route element={<PublicLayout />}> 
              <Route path="/" element={<Suspense fallback={<div className="p-8">Đang tải...</div>}><LandingPage /></Suspense>} />
              <Route path="/about" element={<Suspense fallback={<div className="p-8">Đang tải...</div>}><AboutPage /></Suspense>} />
              <Route path="/features" element={<Suspense fallback={<div className="p-8">Đang tải...</div>}><FeaturesPage /></Suspense>} />
              <Route path="/pricing" element={<Suspense fallback={<div className="p-8">Đang tải...</div>}><PricingPage /></Suspense>} />
              <Route path="/faq" element={<Suspense fallback={<div className="p-8">Đang tải...</div>}><FaqPage /></Suspense>} />
              <Route path="/blog" element={<Suspense fallback={<div className="p-8">Đang tải...</div>}><BlogListPage /></Suspense>} />
              <Route path="/blog/:id" element={<Suspense fallback={<div className="p-8">Đang tải...</div>}><BlogDetailPage /></Suspense>} />
              <Route path="/career" element={<Suspense fallback={<div className="p-8">Đang tải...</div>}><CareerPage /></Suspense>} />
              <Route path="/terms" element={<Suspense fallback={<div className="p-8">Đang tải...</div>}><TermsPage /></Suspense>} />
              <Route path="/privacy" element={<Suspense fallback={<div className="p-8">Đang tải...</div>}><PrivacyPage /></Suspense>} />
              <Route path="/contact" element={<Suspense fallback={<div className="p-8">Đang tải...</div>}><ContactPage /></Suspense>} />
            </Route>

            {/* Auth routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Suspense fallback={<div className="p-8">Đang tải...</div>}><LoginPage /></Suspense>} />
              <Route path="/register" element={<Suspense fallback={<div className="p-8">Đang tải...</div>}><RegisterPage /></Suspense>} />
              <Route path="/verify-otp" element={<Suspense fallback={<div className="p-8">Đang tải...</div>}><VerifyOtpPage /></Suspense>} />
              <Route path="/forgot-password" element={<Suspense fallback={<div className="p-8">Đang tải...</div>}><ForgotPasswordPage /></Suspense>} />
              <Route path="/reset-password" element={<Suspense fallback={<div className="p-8">Đang tải...</div>}><ResetPasswordPage /></Suspense>} />
            </Route>

            {/* User routes (protected) */}
            <Route
              element={
                <ProtectedRoute>
                  <UserLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Suspense fallback={<div className="p-8">Đang tải...</div>}><UserDashboard /></Suspense>} />
              <Route path="/transactions" element={<Suspense fallback={<div className="p-8">Đang tải...</div>}><TransactionsPage /></Suspense>} />
              <Route path="/categories" element={<Suspense fallback={<div className="p-8">Đang tải...</div>}><CategoriesPage /></Suspense>} />
              <Route path="/statistics" element={<Suspense fallback={<div className="p-8">Đang tải...</div>}><StatisticsPage /></Suspense>} />
              <Route path="/reports" element={<Suspense fallback={<div className="p-8">Đang tải...</div>}><ReportsPage /></Suspense>} />
              <Route path="/settings" element={<Suspense fallback={<div className="p-8">Đang tải...</div>}><SettingsPage /></Suspense>} />
            </Route>

            {/* Admin routes (protected, admin only) */}
            <Route
              element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin" element={<Suspense fallback={<div className="p-8">Đang tải...</div>}><AdminDashboard /></Suspense>} />
              <Route path="/admin/users" element={<Suspense fallback={<div className="p-8">Đang tải...</div>}><AdminUsersPage /></Suspense>} />
              <Route
                path="/admin/users/:id"
                element={<Suspense fallback={<div className="p-8">Đang tải...</div>}><AdminUserDetailPage /></Suspense>}
              />
              <Route
                path="/admin/transactions"
                element={<Suspense fallback={<div className="p-8">Đang tải...</div>}><AdminTransactionsPage /></Suspense>}
              />
              <Route
                path="/admin/categories"
                element={<Suspense fallback={<div className="p-8">Đang tải...</div>}><AdminCategoriesPage /></Suspense>}
              />
              <Route path="/admin/system" element={<Suspense fallback={<div className="p-8">Đang tải...</div>}><AdminSystemPage /></Suspense>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "24px",
          },
        }}
      />
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </QueryClientProvider>
  );
}

export default App;
