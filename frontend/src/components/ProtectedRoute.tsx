import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

/**
 * Component bảo vệ route
 * - Yêu cầu đăng nhập
 * - Có thể yêu cầu role ADMIN
 */
interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin } = useAuthStore()

  // Chưa đăng nhập, redirect về login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Yêu cầu admin nhưng không phải admin, redirect về dashboard
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute

