import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";
import { UserRole } from "../../types/user";
import toast from "react-hot-toast";

/**
 * Trang đăng nhập
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    totpCode: "",
  });

  // Mutation đăng nhập
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log("LOGIN RESPONSE:", data);

      const authData = data?.data;
      const token = authData?.token;
      const user = authData?.user;
      const refreshToken = authData?.refreshToken;

      if (!token || !user) {
        toast.error("Đăng nhập thất bại: Không nhận được token hoặc user");
        return;
      }

      setAuth(token, user, refreshToken ?? null);
      toast.success("Đăng nhập thành công!");
      if (user.role === UserRole.ADMIN) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Đăng nhập thất bại");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  return (
    <div className="max-w-5xl mx-auto mt-16 ">
      <div className="grid grid-cols-1 lg:grid-cols-2 shadow-2xl overflow-hidden rounded-xl  ">
        {/* --- Cột trái: Thu hút khách hàng --- */}
        <div className="bg-gradient-to-r from-blue-400 to-cyan-400 p-14 text-white flex flex-col justify-center space-y-8 ">
          <h4 className="text-4xl font-bold leading-tight text-center mx-4 mb-12">
            Chào mừng quay lại với MeMe
            <br />
            <span className="text-2xl font-semibold mt-4 ">
              Tiếp tục kiểm soát chi tiêu và theo dõi tài chính của bạn chỉ với
              một lần đăng nhập.
            </span>
          </h4>

          <p className="text-xl opacity-95">
            Chào mừng bạn quay lại MeMe. Tiếp tục làm chủ chi tiêu và theo dõi
            tài chính của bạn một cách thông minh hơn mỗi ngày.
          </p>

          <ul className="space-y-4 text-lg mt-4">
            <li className="flex items-center gap-4">
              <span className="w-3 h-3 rounded-full bg-white"></span>
              Đăng nhập nhanh – vào ngay không chờ đợi
            </li>
            <li className="flex items-center gap-4">
              <span className="w-3 h-3 rounded-full bg-white"></span>
              Truy cập dữ liệu mọi lúc, mọi nơi
            </li>
            <li className="flex items-center gap-4">
              <span className="w-3 h-3 rounded-full bg-white"></span>
              Bảo mật cao – an tâm sử dụng
            </li>
          </ul>
        </div>

        {/* --- Cột phải: Form đăng ký --- */}
        <div className="bg-white p-14 space-y-8">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img
              src="/image/z7250212742728_813fa370e59a817418fdc5518650ab30.jpg"
              alt="Logo"
              className="h-20 w-20 rounded-full object-cover"
            />
          </div>

          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-cyan-300 text-transparent bg-clip-text">
            Đăng nhập tài khoản
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="font-semibold text-gray-700">Email</span>
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                className="input input-bordered rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-300 transition-all"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            {/* Mật khẩu */}
            <div className="form-control">
              <label className="label">
                <span className="font-semibold text-gray-700">Mật khẩu</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-300 transition-all"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                minLength={6}
              />
            </div>

            {/* Mã 2FA */}
            <div className="form-control">
              <label className="label">
                <span className="font-semibold text-gray-700">
                  Mã 2FA (nếu có)
                </span>
              </label>
              <input
                type="text"
                placeholder="000000"
                className="input input-bordered rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-300 transition-all"
                value={formData.totpCode}
                onChange={(e) =>
                  setFormData({ ...formData, totpCode: e.target.value })
                }
              />
            </div>

            {/* Nút đăng ký */}
            <div className="pt-4">
              <button
                type="submit"
                className="
              btn w-full text-white font-bold shadow-xl 
              hover:shadow-2xl transform hover:scale-105
              transition-all duration-300 rounded-xl
              bg-gradient-to-r from-blue-400 to-cyan-400
              hover:from-blue-500 hover:to-cyan-300
            "
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </div>
          </form>

          <div className="text-center space-y-2">
            <Link
              to="/forgot-password"
              className="font-semibold text-cyan-400 hover:underline"
            >
              Quên mật khẩu?
            </Link>
            <p className="text-sm">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="font-semibold text-cyan-400 hover:underline"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
