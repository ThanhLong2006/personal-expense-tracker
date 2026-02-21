import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { verifyOtp, resendOtp } from "../../api/auth";
import toast from "react-hot-toast";

/**
 * Trang verify OTP
 */
const VerifyOtpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const emailFromQuery = searchParams.get("email") || "";
  type VerifyState = { email?: string };
  const emailFromState = (location.state as VerifyState | null)?.email || "";
  const email =
    emailFromQuery ||
    emailFromState ||
    (() => {
      try {
        return localStorage.getItem("pendingEmail") || "";
      } catch {
        return "";
      }
    })();

  const [otp, setOtp] = useState("");

  const verifyMutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: () => {
      toast.success("Xác thực OTP thành công!");
      try {
        localStorage.removeItem("pendingEmail");
      } catch {
        void 0;
      }
      navigate("/login");
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Mã OTP không đúng";
      toast.error(message);
    },
  });

  const resendMutation = useMutation({
    mutationFn: () => resendOtp(email),
    onSuccess: () => {
      toast.success("Đã gửi lại mã OTP");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyMutation.mutate({ email, otp });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-500 via-blue-500 to-blue-700 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-14 h-14 rounded-full bg-cyan-100 flex items-center justify-center mb-4">
              <svg
                className="w-7 h-7 text-cyan-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-gray-800">Xác thực OTP</h1>
            <p className="text-gray-500 mt-2 text-sm">Mã OTP đã được gửi đến</p>
            <p className="text-cyan-600 font-medium mt-1 break-all">{email}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Mã OTP (6 chữ số)
              </label>
              <input
                type="text"
                placeholder="000000"
                className="
                  w-full px-4 py-3 rounded-xl
                  border border-gray-300
                  text-center text-2xl tracking-widest font-semibold
                  focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500
                  transition
                "
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={verifyMutation.isPending || otp.length !== 6}
              className="
                w-full py-3 rounded-xl
                bg-gradient-to-r from-cyan-500 to-blue-600
                text-white font-semibold
                hover:from-cyan-600 hover:to-blue-700
                transition-all duration-300
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {verifyMutation.isPending ? "Đang xác thực..." : "Xác thực"}
            </button>
          </form>

          {/* Resend */}
          <div className="text-center mt-6">
            <button
              onClick={() => resendMutation.mutate()}
              disabled={resendMutation.isPending}
              className="
                text-sm font-medium text-cyan-600
                hover:text-cyan-700
                transition
                disabled:opacity-60
              "
            >
              {resendMutation.isPending ? "Đang gửi lại..." : "Gửi lại mã OTP"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-8 py-4 text-center text-xs text-gray-500">
          Bảo mật xác thực • OTP chỉ có hiệu lực trong thời gian ngắn
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
