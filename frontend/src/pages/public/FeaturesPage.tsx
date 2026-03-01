import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  PieChart,
  BarChart3,
  TrendingUp,
  Brain,
  Shield,
  Lock,
  Smartphone,
  Cloud,
  Download,
  Upload,
  Image as ImageIcon,
  FileText,
  Calendar,
  DollarSign,
  Bell,
  Settings,
  Users,
  Globe,
  Zap,
  CheckCircle2,
  X,
  ArrowRight,
  Search,
  Filter,
  Eye,
  EyeOff,
  CreditCard,
  Wallet,
  Receipt,
  Calculator,
  Target,
  AlertCircle,
  Mail,
  MessageSquare,
  HelpCircle,
  Grid3x3,
} from "lucide-react";

const FeaturesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", name: "Tất cả", icon: Grid3x3 },
    { id: "management", name: "Quản lý", icon: FileText },
    { id: "analytics", name: "Phân tích", icon: BarChart3 },
    { id: "ai", name: "AI Thông Minh", icon: Brain },
    { id: "security", name: "Bảo mật", icon: Shield },
    { id: "integration", name: "Tích hợp", icon: Cloud },
  ];

  const allFeatures = [
    {
      id: 1,
      category: "management",
      icon: Receipt,
      title: "Quản lý giao dịch chi tiết",
      description:
        "Thêm, sửa, xóa giao dịch dễ dàng với giao diện trực quan. Hỗ trợ ghi chú, địa điểm, và upload ảnh hóa đơn.",
      color: "text-cyan-600",
      bgColor: "bg-cyan-500/10",
      highlights: ["Thêm nhanh", "Sửa dễ dàng", "Xóa an toàn", "Upload ảnh"],
    },
    {
      id: 2,
      category: "management",
      icon: Upload,
      title: "Import từ Excel/CSV",
      description:
        "Import hàng loạt giao dịch từ file Excel hoặc CSV. Hỗ trợ nhiều định dạng và tự động nhận diện cột dữ liệu.",
      color: "text-blue-600",
      bgColor: "bg-blue-50010",
      highlights: ["Excel", "CSV", "Hàng loạt", "Tự động"],
    },
    {
      id: 3,
      category: "management",
      icon: Download,
      title: "Export ra Excel/PDF",
      description:
        "Xuất dữ liệu ra file Excel hoặc PDF với định dạng đẹp. Hỗ trợ tùy chỉnh cột và bộ lọc.",
      color: "text-sky-600",
      bgColor: "bg-sky-50010",
      highlights: ["Excel", "PDF", "Tùy chỉnh", "Đẹp"],
    },
    {
      id: 4,
      category: "management",
      icon: ImageIcon,
      title: "OCR nhận diện hóa đơn",
      description:
        "Upload ảnh hóa đơn, hệ thống tự động nhận diện số tiền, ngày tháng bằng công nghệ OCR tiên tiến.",
      color: "text-teal-600",
      bgColor: "bg-teal-50010",
      highlights: ["OCR", "Tự động", "Chính xác 98%", "Nhanh"],
    },
    {
      id: 5,
      category: "management",
      icon: Filter,
      title: "Lọc và tìm kiếm nâng cao",
      description:
        "Tìm kiếm và lọc giao dịch theo nhiều tiêu chí: ngày, danh mục, số tiền, ghi chú, địa điểm.",
      color: "text-cyan-700",
      bgColor: "bg-cyan-60010",
      highlights: ["Nhiều tiêu chí", "Tìm kiếm nhanh", "Lưu bộ lọc"],
    },
    {
      id: 6,
      category: "management",
      icon: Calendar,
      title: "Quản lý theo thời gian",
      description:
        "Xem giao dịch theo ngày, tuần, tháng, năm. Hỗ trợ lịch và timeline view.",
      color: "text-blue-700",
      bgColor: "bg-blue-60010",
      highlights: ["Ngày", "Tuần", "Tháng", "Năm"],
    },
    {
      id: 7,
      category: "analytics",
      icon: PieChart,
      title: "Biểu đồ tròn theo danh mục",
      description:
        "Xem tỷ lệ chi tiêu theo từng danh mục với biểu đồ tròn trực quan, dễ hiểu.",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50010",
      highlights: ["Trực quan", "Màu sắc", "Tỷ lệ %", "Tương tác"],
    },
    {
      id: 8,
      category: "analytics",
      icon: BarChart3,
      title: "Biểu đồ cột xu hướng",
      description:
        "Theo dõi xu hướng chi tiêu theo thời gian với biểu đồ cột, đường, hoặc vùng.",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50010",
      highlights: ["Cột", "Đường", "Vùng", "Xu hướng"],
    },
    {
      id: 9,
      category: "analytics",
      icon: TrendingUp,
      title: "Thống kê chi tiết",
      description:
        "Xem tổng chi, trung bình, min/max, số lượng giao dịch với bảng thống kê đầy đủ.",
      color: "text-sky-600",
      bgColor: "bg-sky-50010",
      highlights: ["Tổng", "Trung bình", "Min/Max", "Chi tiết"],
    },
    {
      id: 10,
      category: "analytics",
      icon: Target,
      title: "Heatmap chi tiêu",
      description:
        "Xem heatmap chi tiêu theo ngày trong tháng, dễ dàng nhận biết ngày chi nhiều nhất.",
      color: "text-teal-700",
      bgColor: "bg-teal-60010",
      highlights: ["Heatmap", "Trực quan", "Màu sắc", "Dễ nhận biết"],
    },
    {
      id: 11,
      category: "analytics",
      icon: FileText,
      title: "Báo cáo PDF đẹp",
      description:
        "Tạo báo cáo PDF chuyên nghiệp với biểu đồ, thống kê, và chữ ký điện tử.",
      color: "text-blue-800",
      bgColor: "bg-blue-70010",
      highlights: ["PDF", "Đẹp", "Chuyên nghiệp", "Chữ ký"],
    },
    {
      id: 12,
      category: "analytics",
      icon: Calculator,
      title: "Tính toán ngân sách",
      description:
        "Đặt ngân sách cho từng danh mục và theo dõi việc thực hiện so với kế hoạch.",
      color: "text-cyan-800",
      bgColor: "bg-cyan-70010",
      highlights: ["Ngân sách", "Kế hoạch", "Cảnh báo", "Báo cáo"],
    },

    {
      id: 13,
      category: "ai",
      icon: Brain,
      title: "AI Dự đoán chi tiêu",
      description:
        "Dự đoán chi tiêu tháng tới dựa trên dữ liệu 3-6 tháng gần nhất với độ chính xác cao.",
      color: "text-purple-600",
      bgColor: "bg-purple-50010",
      highlights: ["Dự đoán", "Chính xác", "EMA", "AI"],
    },
    {
      id: 14,
      category: "ai",
      icon: AlertCircle,
      title: "Gợi ý tiết kiệm",
      description:
        "AI phân tích chi tiêu và đưa ra gợi ý cụ thể để tiết kiệm tiền hiệu quả.",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50010",
      highlights: ["Gợi ý", "Tiết kiệm", "Cụ thể", "Thông minh"],
    },
    {
      id: 15,
      category: "ai",
      icon: MessageSquare,
      title: "Phân tích AI tự động",
      description:
        "AI tự động phân tích xu hướng chi tiêu và đưa ra nhận xét, khuyến nghị chi tiết.",
      color: "text-blue-600",
      bgColor: "bg-blue-50010",
      highlights: ["Tự động", "Phân tích", "Nhận xét", "Khuyến nghị"],
    },

    {
      id: 16,
      category: "security",
      icon: Shield,
      title: "Bảo mật đa lớp",
      description:
        "Mã hóa dữ liệu, JWT token, HTTPS, và nhiều lớp bảo mật khác bảo vệ thông tin của bạn.",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50010",
      highlights: ["Mã hóa", "JWT", "HTTPS", "Đa lớp"],
    },
    {
      id: 17,
      category: "security",
      icon: Lock,
      title: "2FA TOTP",
      description:
        "Bảo vệ tài khoản với xác thực 2 yếu tố qua Google Authenticator hoặc phần mềm tương tự.",
      color: "text-sky-700",
      bgColor: "bg-sky-60010",
      highlights: ["2FA", "TOTP", "Google Auth", "An toàn"],
    },
    {
      id: 18,
      category: "security",
      icon: Mail,
      title: "OTP Email",
      description:
        "Xác thực đăng ký và đặt lại mật khẩu qua mã OTP gửi về email, bảo mật cao.",
      color: "text-blue-700",
      bgColor: "bg-blue-60010",
      highlights: ["OTP", "Email", "Xác thực", "Bảo mật"],
    },

    {
      id: 19,
      category: "integration",
      icon: Cloud,
      title: "Đồng bộ đám mây",
      description:
        "Dữ liệu được lưu trữ an toàn trên đám mây, tự động đồng bộ giữa các thiết bị.",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50010",
      highlights: ["Đám mây", "Đồng bộ", "Tự động", "An toàn"],
    },
    {
      id: 20,
      category: "integration",
      icon: Globe,
      title: "Đa ngôn ngữ",
      description:
        "Hỗ trợ nhiều ngôn ngữ: Tiếng Việt, English, và nhiều ngôn ngữ khác.",
      color: "text-teal-600",
      bgColor: "bg-teal-50010",
      highlights: ["Tiếng Việt", "English", "Nhiều ngôn ngữ"],
    },
    {
      id: 21,
      category: "integration",
      icon: Smartphone,
      title: "Responsive Design",
      description:
        "Giao diện tối ưu cho mọi thiết bị: desktop, tablet, mobile. Trải nghiệm mượt mà.",
      color: "text-sky-600",
      bgColor: "bg-sky-50010",
      highlights: ["Desktop", "Tablet", "Mobile", "Mượt"],
    },
    {
      id: 22,
      category: "management",
      icon: Bell,
      title: "Thông báo thông minh",
      description:
        "Nhận thông báo về chi tiêu vượt ngân sách, nhắc nhở ghi chép, và cập nhật mới.",
      color: "text-blue-600",
      bgColor: "bg-blue-50010",
      highlights: ["Thông báo", "Nhắc nhở", "Cảnh báo", "Tùy chỉnh"],
    },
  ];

  const filteredFeatures =
    selectedCategory === "all"
      ? allFeatures
      : allFeatures.filter((f) => f.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cyan-400 via-blue-400 to-sky-300 text-white py-28">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-300/30 via-transparent to-cyan-200/30 animate-pulse"></div>

        {/* Decorative blur circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/10 rounded-full blur-2xl"></div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/40 rounded-full"
              initial={{
                x:
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerWidth : 1200),
                y: Math.random() * 500,
              }}
              animate={{
                y: [Math.random() * 500, Math.random() * 500 - 100],
                x: [
                  Math.random() *
                    (typeof window !== "undefined" ? window.innerWidth : 1200),
                  Math.random() *
                    (typeof window !== "undefined" ? window.innerWidth : 1200) +
                    (Math.random() - 0.5) * 200,
                ],
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA4IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/5"></div>

        {/* Decorative shapes */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 border-4 border-white/30 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-16 h-16 border-4 border-white/40 rotate-45"
          animate={{
            y: [0, -20, 0],
            rotate: [45, 90, 45],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 right-10 w-12 h-12"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Zap className="w-full h-full text-white/40" />
        </motion.div>
        <motion.div
          className="absolute bottom-32 left-20 w-14 h-14"
          animate={{
            rotate: [0, -360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Brain className="w-full h-full text-white/35" />
        </motion.div>

        {/* Snowflakes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 40 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 3 + 2}s`,
            animationDelay: `${Math.random() * 5}s`,
            fontSize: `${Math.random() * 10 + 10}px`,
            opacity: Math.random() * 0.5 + 0.3,
          })).map((flake) => (
            <motion.div
              key={flake.id}
              className="absolute text-white"
              initial={{ top: "-10%", left: flake.left }}
              animate={{
                top: "110%",
                left: `calc(${flake.left} + ${Math.random() * 100 - 50}px)`,
              }}
              transition={{
                duration: parseFloat(flake.animationDuration),
                delay: parseFloat(flake.animationDelay),
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                fontSize: flake.fontSize,
                opacity: flake.opacity,
              }}
            >
              ❄
            </motion.div>
          ))}
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/30 rounded-full px-6 py-3 mb-8"
            >
              <Zap className="w-5 h-5 text-yellow-200" />
              <span className="text-sm font-semibold">
                Tính năng mạnh mẽ nhất 2025
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-50 to-white drop-shadow-2xl leading-tight">
              22 Tính Năng{" "}
              <span className="inline-block animate-pulse text-white">
                Đỉnh Cao
              </span>{" "}
              Nhất 2025
            </h1>
            <p className="text-xl md:text-2xl font-light opacity-95 leading-relaxed max-w-3xl mx-auto mb-8">
              Không chỉ là quản lý chi tiêu – Đây là trợ lý chi tiêu AI thông
              minh dành riêng cho bạn
            </p>

            {/* Feature badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4 mt-8"
            >
              {[
                { icon: Brain, text: "AI Thông minh" },
                { icon: Shield, text: "Bảo mật cao" },
                { icon: BarChart3, text: "Phân tích sâu" },
              ].map((badge, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full px-5 py-2 hover:bg-white/25 transition-all"
                >
                  <badge.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{badge.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
              fillOpacity="0.15"
            />
          </svg>
        </div>
      </section>

      {/* CATEGORY FILTER - GLASS + STICKY */}
      <section className="py-6 bg-white/90 backdrop-blur-xl border-b border-cyan-100  top-0 z-50 shadow-xl">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-3 px-7 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-lg ${
                    selectedCategory === cat.id
                      ? "bg-gradient-to-r from-[#0066FF] to-[#00D4FF] text-white scale-110 shadow-2xl"
                      : "bg-white/80 text-gray-700 hover:bg-cyan-50 hover:shadow-xl"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {filteredFeatures.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                  whileHover={{ y: -16, scale: 1.03 }}
                  className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl border border-cyan-100 overflow-hidden transition-all duration-500"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="p-8 lg:p-10 relative z-10">
                    <div
                      className={`w-18 h-18 ${feature.bgColor} rounded-3xl flex items-center justify-center mb-6  group-hover:scale-115 transition-all duration-500`}
                    >
                      <Icon className={`w-10 h-10 ${feature.color}`} />
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-black text-gray-900 mb-4 group-hover:text-cyan-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-base leading-relaxed mb-6 group-hover:text-cyan-400 transition-colors">
                      {feature.description}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {feature.highlights.map((h, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 rounded-xl text-sm font-bold border border-cyan-200 shadow-sm"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE - FULL */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-cyan-50 to-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl lg:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#0066FF] to-[#00D4FF] mb-4">
              So sánh gói dịch vụ
            </h2>
            <p className="text-xl text-gray-600">
              Chọn gói phù hợp với nhu cầu của bạn
            </p>
          </motion.div>

          <div className="overflow-x-auto rounded-3xl shadow-2xl bg-white border border-cyan-100">
            <table className="table w-full text-lg">
              <thead className="bg-gradient-to-r from-[#0066FF] to-[#00D4FF] text-white">
                <tr>
                  <th className="text-left py-6">Tính năng</th>
                  <th className="text-center">Free</th>
                  <th className="text-center">Premium</th>
                  <th className="text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-cyan-50">
                  <td className="py-5">Quản lý giao dịch không giới hạn</td>
                  <td className="text-center">
                    <CheckCircle2 className="w-7 h-7 text-green-600 mx-auto" />
                  </td>
                  <td className="text-center">
                    <CheckCircle2 className="w-7 h-7 text-green-600 mx-auto" />
                  </td>
                  <td className="text-center">
                    <CheckCircle2 className="w-7 h-7 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr className="hover:bg-cyan-50">
                  <td>Import/Export Excel, CSV</td>
                  <td className="text-center">
                    <CheckCircle2 className="w-7 h-7 text-green-600 mx-auto" />
                  </td>
                  <td className="text-center">
                    <CheckCircle2 className="w-7 h-7 text-green-600 mx-auto" />
                  </td>
                  <td className="text-center">
                    <CheckCircle2 className="w-7 h-7 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr className="hover:bg-cyan-50">
                  <td>OCR nhận diện hóa đơn tự động</td>
                  <td className="text-center">
                    <X className="w-7 h-7 text-red-500 mx-auto" />
                  </td>
                  <td className="text-center">
                    <CheckCircle2 className="w-7 h-7 text-cyan-600 mx-auto" />
                  </td>
                  <td className="text-center">
                    <CheckCircle2 className="w-7 h-7 text-cyan-600 mx-auto" />
                  </td>
                </tr>
                <tr className="hover:bg-cyan-50">
                  <td>AI dự đoán chi tiêu & gợi ý tiết kiệm</td>
                  <td className="text-center">
                    <X className="w-7 h-7 text-red-500 mx-auto" />
                  </td>
                  <td className="text-center">
                    <CheckCircle2 className="w-7 h-7 text-cyan-600 mx-auto" />
                  </td>
                  <td className="text-center">
                    <CheckCircle2 className="w-7 h-7 text-cyan-600 mx-auto" />
                  </td>
                </tr>
                <tr className="hover:bg-cyan-50">
                  <td>Báo cáo PDF chuyên nghiệp</td>
                  <td className="text-center">
                    <X className="w-7 h-7 text-red-500 mx-auto" />
                  </td>
                  <td className="text-center">
                    <CheckCircle2 className="w-7 h-7 text-cyan-600 mx-auto" />
                  </td>
                  <td className="text-center">
                    <CheckCircle2 className="w-7 h-7 text-cyan-600 mx-auto" />
                  </td>
                </tr>
                <tr className="hover:bg-cyan-50">
                  <td>Xác thực 2 lớp (2FA)</td>
                  <td className="text-center">
                    <X className="w-7 h-7 text-red-500 mx-auto" />
                  </td>
                  <td className="text-center">
                    <CheckCircle2 className="w-7 h-7 text-cyan-600 mx-auto" />
                  </td>
                  <td className="text-center">
                    <CheckCircle2 className="w-7 h-7 text-cyan-600 mx-auto" />
                  </td>
                </tr>
                <tr className="hover:bg-cyan-50">
                  <td>Hỗ trợ ưu tiên 24/7</td>
                  <td className="text-center">
                    <X className="w-7 h-7 text-red-500 mx-auto" />
                  </td>
                  <td className="text-center">
                    <X className="w-7 h-7 text-red-500 mx-auto" />
                  </td>
                  <td className="text-center">
                    <CheckCircle2 className="w-7 h-7 text-cyan-600 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-28 bg-gradient-to-br from-[#0066FF] via-[#0077FF] to-[#00D4FF] text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-5xl md:text-7xl font-black mb-6 drop-shadow-2xl">
              Sẵn sàng thay đổi chi tiêu của bạn?
            </h2>
            <p className="text-2xl mb-10 opacity-95">
              Hàng triệu người đã tin dùng – Đến lượt bạn!
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/register"
                className="btn btn-xl bg-white text-[#0066FF] hover:bg-gray-100 font-black text-xl px-16 py-8 rounded-2xl shadow-2xl hover:scale-105 transition"
              >
                Bắt đầu miễn phí ngay
                <ArrowRight className="w-7 h-7 ml-3" />
              </Link>
              <Link
                to="/pricing"
                className="btn btn-xl btn-outline text-white border-2 border-white hover:bg-white hover:text-[#0066FF] font-bold text-xl px-16 py-8 rounded-2xl"
              >
                Xem bảng giá chi tiết
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;
