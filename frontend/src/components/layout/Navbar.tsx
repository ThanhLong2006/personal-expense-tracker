import { Link, NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

/**
 * Navbar cho các trang public
 */
const Navbar = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <nav className="navbar sticky top-0 z-50 backdrop-blur-xl bg-white/30 supports-backdrop-blur:bg-white/10 border-b border-white/20 transition-all duration-300">
      {/* Mobile menu */}
      <div className="navbar-start">
        <div className="dropdown lg:hidden">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 p-4 shadow-lg bg-base-100 rounded-box w-64 gap-2 z-50"
          >
            <li>
              <Link to="/about">Về chúng tôi</Link>
            </li>
            <li>
              <Link to="/features">Tính năng</Link>
            </li>
            <li>
              <Link to="/blog">Blog</Link>
            </li>
            <li>
              <Link to="/faq">FAQ</Link>
            </li>
            <li>
              <Link to="/contact">Liên hệ</Link>
            </li>
            <li className="mt-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="btn text-white font-bold shadow-xl 
      hover:shadow-2xl transform hover:scale-105 
      transition-all duration-300 rounded-full px-5
      bg-gradient-to-r from-teal-400 to-teal-500 
      hover:from-teal-300 hover:to-teal-500"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn btn-ghost w-full mb-2">
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="btn text-white font-bold shadow-xl 
      hover:shadow-2xl transform hover:scale-105 
      transition-all duration-300 rounded-full px-5
      bg-gradient-to-r from-teal-400 to-teal-500 
      hover:from-teal-300 hover:to-teal-500"
                  >
                    Đăng ký miễn phí
                  </Link>
                </>
              )}
            </li>
          </ul>
        </div>

        {/* Logo - To hơn nhưng không làm navbar cao thêm */}
        <Link
          to="/"
          className="flex items-center gap-3 ml-3 lg:ml-0 border-none "
        >
          <div className="relative border-none">
            <img
              src="../../../image/z7250212742728_813fa370e59a817418fdc5518650ab30.jpg"
              alt="Logo"
              className="h-12 w-12 rounded-xl object-cover border-none "
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30 blur-xl -z-10"></div>
          </div>
        </Link>
      </div>

      {/* Desktop Menu - Có gạch chân gradient khi hover & active */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-8 text-base font-medium">
          {[
            { to: "/about", label: "Về chúng tôi" },
            { to: "/features", label: "Tính năng" },
            { to: "/blog", label: "Blog" },
            { to: "/faq", label: "FAQ" },
            { to: "/contact", label: "Liên hệ" },
          ].map((item) => (
            <li key={item.to} className="group relative">
              <NavLink
                to={item.to}
                className="
            relative px-4 py-2 
            text-gray-700 hover:text-teal-600
            transition-all duration-300
          "
              >
                {item.label}

                {/* Gạch chân khi hover */}
                <span
                  className="
              absolute left-0 -bottom-1 h-[2px] w-full 
              bg-teal-400 rounded-full 
              scale-x-0 group-hover:scale-x-100
              transition-transform duration-300 origin-left
            "
                ></span>

                {/* Gạch chân khi active (đúng route) */}
                {location.pathname === item.to && (
                  <span
                    className="
                absolute left-0 -bottom-1 h-[2px] w-full 
                bg-teal-500 rounded-full
              "
                  ></span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Nút hành động - Đăng ký có gradient giống logo */}
      <div className="navbar-end hidden lg:flex gap-4 pr-4">
        {isAuthenticated ? (
          <Link
            to="/dashboard"
            className="btn text-white font-bold shadow-xl 
      hover:shadow-2xl transform hover:scale-105 
      transition-all duration-300 rounded-full px-5
      bg-gradient-to-r from-blue-400 to-cyan-400 
      hover:from-blue-500 hover:to-cyan-400 border-none"
          >
            Dashboard
          </Link>
        ) : (
          <>
            <Link
              to="/login"
              className="btn text-white font-bold shadow-xl 
      hover:shadow-2xl transform hover:scale-105 
      transition-all duration-300 rounded-full px-5
      bg-gradient-to-r from-blue-400 to-cyan-400 
      hover:from-blue-500 hover:to-cyan-400 border-none"
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className=" btn text-white font-bold shadow-xl 
      hover:shadow-2xl transform hover:scale-105 
      transition-all duration-300 rounded-full px-5
      bg-gradient-to-r from-blue-400 to-cyan-400 
      hover:from-blue-500 hover:to-cyan-400 border-none"
            >
              Đăng ký miễn phí
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
