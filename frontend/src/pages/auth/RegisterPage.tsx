import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { register } from "../../api/auth";
import toast from "react-hot-toast";

/**
 * Trang đăng ký
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
  });

  // Mutation đăng ký
  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      if (data.status === "success") {
        toast.success(
          "Đăng ký thành công! Vui lòng kiểm tra email để lấy mã OTP."
        );
        try { localStorage.setItem('pendingEmail', formData.email) } catch (_e) { void 0 }
        navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}`, { replace: true });
      }
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Đăng ký thất bại";
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(formData);
  };

  return (
    <div className="max-w-5xl mx-auto mt-16 ">
      <div className="grid grid-cols-1 lg:grid-cols-2 rounded-4xl shadow-2xl overflow-hidden rounded-xl">
        {/* --- Cột trái: Thu hút khách hàng --- */}
        <div className="bg-gradient-to-r from-blue-400 to-cyan-400  p-14 text-white flex flex-col justify-center space-y-8">
          <h4 className="text-4xl font-bold leading-tight text-center mx-4 mb-1">
            Chào mừng đến với MeMe
            <br />
            <span className="text-2xl font-semibold mt-4 ">
              Bắt đầu kiểm soát chi tiêu và theo dõi tài chính của bạn chỉ với
              một lần đăng ký.
            </span>
          </h4>

          <p className="text-xl opacity-95">
            MeMe giúp bạn kiểm soát tiền bạc dễ dàng hơn bao giờ hết. Theo dõi
            thu chi, đặt mục tiêu tiết kiệm, nhận cảnh báo chi tiêu bất thường
            và xem báo cáo trực quan mỗi ngày.
          </p>

          <ul className="space-y-4 text-lg">
            <li className="flex items-center gap-4">
              <span className="w-3 h-3 rounded-full bg-white"></span>
              Tạo tài khoản nhanh chóng
            </li>
            <li className="flex items-center gap-4">
              <span className="w-3 h-3 rounded-full bg-white"></span>
              Giao diện hiện đại, dễ sử dụng
            </li>
            <li className="flex items-center gap-4">
              <span className="w-3 h-3 rounded-full bg-white"></span>
              Bảo mật thông tin tuyệt đối
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

          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-teal-300 text-transparent bg-clip-text ">
            Đăng ký tài khoản
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Họ và tên */}
            <div className="form-control">
              <label className="label">
                <span className="font-semibold text-gray-700">Họ và tên</span>
              </label>
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                className="input input-bordered rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-300 transition-all"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                required
              />
            </div>

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

            {/* Số điện thoại */}
            <div className="form-control">
              <label className="label">
                <span className="font-semibold text-gray-700">
                  Số điện thoại (tùy chọn)
                </span>
              </label>
              <input
                type="tel"
                placeholder="0123456789"
                className="input input-bordered rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-300 transition-all"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
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
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? "Đang đăng ký..." : "Đăng ký"}
              </button>
            </div>
          </form>

          <div className="text-center pt-2">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="font-semibold text-cyan-400 hover:underline"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
