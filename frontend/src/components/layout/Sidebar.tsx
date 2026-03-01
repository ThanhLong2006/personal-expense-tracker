import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import React, { useState } from "react";
import QuickActions from "../dashboard/QuickActions";
import {
  FaThLarge,
  FaExchangeAlt,
  FaFolderOpen,
  FaChartPie,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
  FaCamera,
  FaChevronRight,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { motion } from "framer-motion";

interface SidebarProps {
  onOpenAddModal: () => void;
}

const Sidebar = ({ onOpenAddModal }: SidebarProps) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [isExpanded, setIsExpanded] = useState(true); // Expand mặc định
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: <FaThLarge /> },
    { path: "/transactions", label: "Giao dịch", icon: <FaExchangeAlt /> },
    { path: "/categories", label: "Danh mục", icon: <FaFolderOpen /> },
    { path: "/statistics", label: "Thống kê", icon: <FaChartPie /> },
    { path: "/reports", label: "Báo cáo", icon: <FaFileAlt /> },
    { path: "/settings", label: "Cài đặt", icon: <FaCog /> },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block fixed left-0 top-0 h-full bg-gradient-to-b from-slate-50 to-white shadow-xl z-40 border-r border-slate-200 transition-all duration-300 ${
          isExpanded ? "w-72" : "w-20"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header với Logo và Toggle */}
          <div className="p-6 border-b border-slate-200 relative">
            {isExpanded ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00C4B4] to-[#00A89A] flex items-center justify-center shadow-lg">
                  <FaThLarge className="text-white text-lg" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    My Finance
                  </h2>
                  <p className="text-xs text-slate-500">Quản lý chi tiêu</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00C4B4] to-[#00A89A] flex items-center justify-center shadow-lg">
                  <FaThLarge className="text-white text-lg" />
                </div>
              </div>
            )}

            {/* Toggle Button */}
            <button
              onClick={toggleSidebar}
              className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-[#00C4B4] to-[#00A89A] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 z-50"
              title={isExpanded ? "Thu gọn" : "Mở rộng"}
            >
              {isExpanded ? (
                <FaTimes className="text-xs" />
              ) : (
                <FaBars className="text-xs" />
              )}
            </button>
          </div>

          {/* Avatar Section - ĐẸP NHƯ ADMIN */}
          {isExpanded ? (
            <div className="p-6 border-b border-slate-200">
              <Link
                to="/settings?tab=Hồ sơ cá nhân"
                className="flex flex-col items-center group/avatar"
              >
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-[#00C4B4]/20 to-[#00A89A]/20 border-4 border-white shadow-xl group-hover/avatar:scale-105 transition-transform duration-300">
                    {previewImage || user?.avatarUrl ? (
                      <img
                        src={previewImage || user?.avatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-black text-4xl text-[#00C4B4]">
                        {user?.fullName?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  {/* Camera hover */}
                  <label className="absolute bottom-0 right-0 bg-gradient-to-br from-[#00C4B4] to-[#00A89A] p-2 rounded-xl shadow-lg opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer">
                    <FaCamera className="text-white text-sm" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                  {/* Online dot */}
                  <div className="absolute top-0 right-0">
                    <span className="relative flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white"></span>
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-bold text-slate-800 text-lg mb-1 group-hover/avatar:text-[#00C4B4] transition-colors">
                    {user?.fullName || "User"}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <p className="text-xs text-green-600 font-semibold uppercase tracking-wider">
                      Trực tuyến
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{user?.email}</p>
                </div>
              </Link>
            </div>
          ) : (
            <div className="p-4 border-b border-slate-200">
              <Link
                to="/settings?tab=Hồ sơ cá nhân"
                className="flex flex-col items-center group/avatar"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-[#00C4B4]/20 to-[#00A89A]/20 border-2 border-white shadow-lg group-hover/avatar:scale-105 transition-transform duration-300">
                    {previewImage || user?.avatarUrl ? (
                      <img
                        src={previewImage || user?.avatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-xl text-[#00C4B4]">
                        {user?.fullName?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  <div className="absolute top-0 right-0">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-white"></span>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* QuickActions - GIỮ NGUYÊN BÊN PHẢI */}
          {location.pathname === "/dashboard" && isExpanded && (
            <div className="px-6 py-4 border-b border-slate-200">
              <QuickActions onOpenAddModal={onOpenAddModal} />
            </div>
          )}

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-2">
              {menuItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      className={`
                        group flex items-center ${
                          isExpanded ? "justify-between" : "justify-center"
                        } p-3.5 rounded-xl transition-all duration-300 relative overflow-hidden
                        ${
                          isActive
                            ? "bg-[#00C4B4] text-white shadow-lg shadow-[#00C4B4]/30"
                            : "hover:bg-[#00C4B4]/10 text-slate-700 hover:text-[#00C4B4]"
                        }
                      `}
                      title={!isExpanded ? item.label : ""}
                    >
                      {!isActive && (
                        <div className="absolute inset-0 bg-[#00C4B4]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      )}
                      <div
                        className={`flex items-center ${
                          isExpanded ? "gap-3" : "justify-center"
                        } relative z-10`}
                      >
                        <span
                          className={`text-xl transition-transform duration-300 ${
                            isActive
                              ? "scale-110"
                              : "group-hover:scale-110 group-hover:rotate-12"
                          }`}
                        >
                          {item.icon}
                        </span>
                        {isExpanded && (
                          <span className="font-medium">{item.label}</span>
                        )}
                      </div>
                      {isExpanded && (
                        <FaChevronRight
                          className={`text-sm transition-all duration-300 ${
                            isActive
                              ? "opacity-100 translate-x-0"
                              : "opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0"
                          }`}
                        />
                      )}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}
                      {!isExpanded && (
                        <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
                          {item.label}
                        </div>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-slate-200">
            <button
              onClick={logout}
              className={`w-full flex items-center ${
                isExpanded ? "justify-center gap-2" : "justify-center"
              } p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-300 font-medium group relative`}
              title={!isExpanded ? "Đăng xuất" : ""}
            >
              <FaSignOutAlt className="text-lg group-hover:rotate-12 transition-transform duration-300" />
              {isExpanded && <span>Đăng xuất</span>}
              {!isExpanded && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
                  Đăng xuất
                </div>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* QuickActions bên phải - GIỮ NGUYÊN KHI KHÔNG EXPAND HOẶC TRÊN MOBILE */}
      {location.pathname === "/dashboard" && !isExpanded && (
        <aside className="hidden lg:flex fixed right-4 top-24 w-60 flex-col gap-6 z-[70]">
          <div className="w-full max-w-[220px] mx-auto">
            <QuickActions onOpenAddModal={onOpenAddModal} />
          </div>
        </aside>
      )}

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-200 shadow-2xl z-40">
        <div className="grid grid-cols-5 gap-0">
          {menuItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center py-3 transition-all duration-300 relative ${
                  isActive ? "text-[#00C4B4]" : "text-slate-500 active:scale-95"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveTab"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#00C4B4] rounded-b-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span
                  className={`text-xl mb-1 transition-transform duration-300 ${
                    isActive ? "scale-110" : ""
                  }`}
                >
                  {item.icon}
                </span>
                <span
                  className={`text-[10px] font-medium ${
                    isActive ? "font-bold" : ""
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
