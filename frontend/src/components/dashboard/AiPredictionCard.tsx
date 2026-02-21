import { motion } from "framer-motion";
import { useState } from "react";

/**
 * Component hiển thị AI dự đoán chi tiêu tháng tới
 * - Hiển thị số tiền dự đoán
 * - Độ tin cậy (confidence)
 * - Xu hướng (tăng/giảm/ổn định)
 * - Gợi ý tiết kiệm
 */
interface AiPredictionData {
  predictedAmount: number;
  confidence: number;
  message: string;
  trend: "TĂNG" | "GIẢM" | "ỔN_ĐỊNH" | "KHÔNG_XÁC_ĐỊNH";
}

interface AiPredictionCardProps {
  data: AiPredictionData | null;
  loading?: boolean;
}

const AiPredictionCard = ({ data, loading = false }: AiPredictionCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  // Format số tiền
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Màu sắc theo xu hướng
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "TĂNG":
        return "text-red-500";
      case "GIẢM":
        return "text-green-500";
      case "ỔN_ĐỊNH":
        return "text-blue-500";
      default:
        return "text-base-content/50";
    }
  };

  // Icon theo xu hướng
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "TĂNG":
        return "📈";
      case "GIẢM":
        return "📉";
      case "ỔN_ĐỊNH":
        return "➡️";
      default:
        return "❓";
    }
  };

  // Màu độ tin cậy
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.7) return "text-green-500";
    if (confidence >= 0.4) return "text-yellow-500";
    return "text-red-500";
  };

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center justify-center h-64">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">
            🤖 AI Dự đoán chi tiêu tháng tới
          </h2>
          <div className="text-center py-8">
            <p className="text-base-content/50">
              Chưa có đủ dữ liệu để dự đoán
            </p>
            <p className="text-sm text-base-content/30 mt-2">
              Cần ít nhất 3 tháng dữ liệu để AI có thể dự đoán
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-gradient-to-br from-primary/10 to-primary-dark/10 shadow-xl border border-primary/20"
    >
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <h2 className="card-title text-2xl">
            🤖 AI Dự đoán chi tiêu tháng tới
          </h2>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="btn btn-ghost btn-sm"
          >
            {showDetails ? "Ẩn" : "Chi tiết"}
          </button>
        </div>

        {/* Số tiền dự đoán */}
        <div className="text-center py-6">
          <p className="text-sm text-base-content/70 mb-2">
            Dự đoán chi tiêu tháng tới
          </p>
          <p className="text-4xl font-bold text-primary mb-4">
            {formatCurrency(data.predictedAmount)}
          </p>

          {/* Độ tin cậy */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-sm text-base-content/70">Độ tin cậy:</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-base-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    data.confidence >= 0.7
                      ? "bg-green-500"
                      : data.confidence >= 0.4
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${data.confidence * 100}%` }}
                ></div>
              </div>
              <span
                className={`text-sm font-semibold ${getConfidenceColor(
                  data.confidence
                )}`}
              >
                {(data.confidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Xu hướng */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">{getTrendIcon(data.trend)}</span>
            <span
              className={`text-lg font-semibold ${getTrendColor(
                data.trend ?? ""
              )}`}
            >
              {(data.trend ?? "KHÔNG_XÁC_ĐỊNH").replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Chi tiết */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 pt-4 border-t border-base-300"
          >
            <p className="text-sm text-base-content/70 mb-4">{data.message}</p>

            {/* Gợi ý tiết kiệm */}
            {data.trend === "TĂNG" && (
              <div className="alert alert-warning">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div>
                  <h3 className="font-bold">Cảnh báo!</h3>
                  <div className="text-xs">
                    Chi tiêu có xu hướng tăng. Hãy xem xét các danh mục chi
                    nhiều nhất và tìm cách tiết kiệm.
                  </div>
                </div>
              </div>
            )}

            {data.trend === "GIẢM" && (
              <div className="alert alert-success">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h3 className="font-bold">Tuyệt vời!</h3>
                  <div className="text-xs">
                    Chi tiêu có xu hướng giảm. Bạn đang quản lý tài chính rất
                    tốt!
                  </div>
                </div>
              </div>
            )}

            {data.trend === "ỔN_ĐỊNH" && (
              <div className="alert alert-info">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h3 className="font-bold">Ổn định</h3>
                  <div className="text-xs">
                    Chi tiêu của bạn đang ổn định. Hãy tiếp tục duy trì!
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AiPredictionCard;
