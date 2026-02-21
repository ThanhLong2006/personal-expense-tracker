import { Outlet } from "react-router-dom";
import React from "react";
import Navbar from "../components/layout/Navbar";
/**
 * Layout cho các trang authentication
 * - Không có Navbar/Footer
 * - Background đẹp
 */
const AuthLayout = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-4">
        <div className="w-full max-w-5xl">
          <Outlet />
        </div>
      </div>
    </>
  );
};
export default AuthLayout;
