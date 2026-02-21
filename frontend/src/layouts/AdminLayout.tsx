import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/layout/AdminSidebar'
import AdminHeader from '../components/layout/AdminHeader'

/**
 * Layout cho admin panel
 * - Có Admin Sidebar và Header
 */
const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-base-200">
      <AdminSidebar />
      <div className="lg:pl-64 pb-20 lg:pb-0">
        <AdminHeader />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout

