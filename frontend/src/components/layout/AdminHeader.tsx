import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { FaUser, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

const AdminHeader = () => {
  const { user } = useAuthStore();

  return (
    <header className="bg-gradient-to-r from-white via-teal-50/30 to-cyan-50/30 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-30 shadow-sm ">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Greeting */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-md ml-4">
              <span className="text-white text-lg font-bold ">
                {user?.fullName?.charAt(0) || "A"}
              </span>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Xin chào,</p>
              <p className="text-lg font-bold text-slate-800">
                {user?.fullName || "Admin"}
              </p>
            </div>
          </motion.div>

          {/* Right side - Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            {/* User Panel Button */}
            <Link
              to="/dashboard"
              className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-teal-300 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
            >
              <FaUser className="text-sm group-hover:rotate-12 transition-transform duration-300" />
              <span>User Panel</span>
              <FaArrowRight className="text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
            </Link>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
