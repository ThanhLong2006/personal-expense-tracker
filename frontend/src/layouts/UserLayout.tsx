import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import UserHeader from "../components/layout/UserHeader";
/**
 * Layout cho user dashboard
 * - Có Sidebar và Header
 */
const UserLayout = () => {
  return (
    <div className="min-h-screen bg-base-200">
      <Sidebar onOpenAddModal={() => {}} />
      <div className="lg:pl-64 pb-20 lg:pb-0">
        <UserHeader />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
