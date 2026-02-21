import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../../api/auth";
import toast from "react-hot-toast";
import { FaEnvelope, FaPaperPlane } from "react-icons/fa6";
import { motion } from "framer-motion";
/**
 * Trang quên mật khẩu - Giao diện đẹp với chủ đề xanh nước biển
 */
const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const mutation = useMutation({
    mutationFn: () => forgotPassword(email),
    onSuccess: () => {
      toast.success("Đã gửi link đặt lại mật khẩu. Vui lòng kiểm tra email.");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Có lỗi xảy ra, vui lòng thử lại";
      toast.error(errorMessage);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    mutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card chính với shadow và bo tròn đẹp */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
        >
          {/* Header gradient xanh nước biển */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-8 text-white">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 shadow-xl">
                <FaEnvelope className="text-4xl" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Quên mật khẩu?</h1>
              <p className="text-white/90 text-lg">
                Đừng lo! Chúng tôi sẽ giúp bạn lấy lại quyền truy cập
              </p>
            </div>
          </div>

          {/* Body form */}
          <div className="p-8 pt-10">
            <p className="text-center text-slate-600 mb-8">
              Nhập email đăng ký để nhận link đặt lại mật khẩu
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Địa chỉ Email
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none" />
                  <input
                    type="email"
                    placeholder="email@example.com"
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-[#00C4B4] focus:ring-4 focus:ring-[#00C4B4]/20 transition-all duration-300 text-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={mutation.isPending || !email.trim()}
                className="w-full py-5 px-6 bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3"
              >
                {mutation.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="text-xl" />
                    Gửi link đặt lại mật khẩu
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                Nhớ mật khẩu rồi?{" "}
                <a
                  href="/login"
                  className="text-[#00C4B4] font-semibold hover:underline"
                >
                  Đăng nhập ngay
                </a>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer nhỏ xinh */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-500">
            © 2026 My Finance App. Quản lý tài chính thông minh.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
