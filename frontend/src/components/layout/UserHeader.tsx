import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useState } from "react";
import { FaCamera } from "react-icons/fa";

const UserHeader = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-gradient-to-r from-slate-100 via-blue-100/70 to-purple-100/70 backdrop-blur-md border-b border-white/30 shadow-md transition-all duration-300 relative overflow-hidden">
      {/* More Visible Galaxy Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-200/25 via-purple-200/25 to-pink-200/25"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-300/15 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-pink-300/15 via-transparent to-transparent"></div>

      {/* More Visible Animated Stars */}
      <div className="absolute inset-0">
        <div className="absolute top-4 left-1/4 w-1 h-1 bg-slate-500 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute top-8 right-1/3 w-0.5 h-0.5 bg-blue-400 rounded-full animate-pulse opacity-35"></div>
        <div className="absolute bottom-6 left-1/2 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-30"></div>
        <div className="absolute top-6 right-1/4 w-0.5 h-0.5 bg-pink-400 rounded-full animate-pulse opacity-45"></div>
      </div>

      <div className="max-w-[1650px] mx-auto h-full flex items-center justify-between relative z-10 px-[20px]">
        {/* KHU VỰC LOGO */}
        <div className="flex items-center gap-4">
          <Link to="/" className="group relative">
            {/* More Visible Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-300/35 via-purple-300/35 to-pink-300/35 rounded-full blur opacity-10 group-hover:opacity-25 transition duration-500"></div>

            <img
              className="relative h-12 w-12 rounded-2xl object-cover border border-white/70 shadow-md transform group-hover:scale-105 transition-transform duration-300 ml-8"
              src="../../../image/z7250212742728_813fa370e59a817418fdc5518650ab30.jpg"
              alt="logo"
            />
          </Link>

          <div className="flex flex-col">
            <h1 className="text-xl font-black text-slate-700 tracking-tighter uppercase leading-none">
              MEME <span className="text-slate-600">APP</span>
            </h1>
            <span className="text-[10px] font-medium text-slate-400 tracking-[0.2em] uppercase">
              Smart Finance Management
            </span>
          </div>
        </div>

        {/* KHU VỰC AVATAR */}
        <Link
          to="/settings?tab=Hồ sơ cá nhân"
          className="flex items-center gap-3 cursor-pointer group/user transition-transform active:scale-95"
        >
          <div className="flex flex-col items-end">
            <p className="font-bold text-slate-700 text-sm tracking-tight leading-tight  transition-colors">
              {user?.fullName || "Người dùng"}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5 opacity-90">
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">
                Trực tuyến
              </p>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
          </div>

          <div className="relative shrink-0">
            <div className="w-11 h-11 rounded-2xl overflow-hidden bg-white/50 border border-slate-200  transition-all duration-300 shadow-sm">
              {previewImage || (user as any)?.avatarUrl ? (
                <img
                  src={previewImage || (user as any).avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover transform group-hover/user:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-lg text-[#00C4B4]">
                  {user?.fullName?.charAt(0) || "U"}
                </div>
              )}
            </div>
            {/* Camera icon */}
            <div className="absolute -bottom-1 -left-1 bg-white p-1 rounded-lg shadow-sm opacity-0 group-hover/user:opacity-100 transition-opacity z-10">
              <FaCamera className="text-[8px] text-[#00C4B4]" />
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default UserHeader;
