import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Search,
  Sparkles,
  Shield,
  Zap,
  Globe,
  FileText,
  HelpCircle,
  MessageCircle,
  Star,
  TrendingUp,
} from "lucide-react";

const faqs = [
  {
    question: "Ứng dụng MeMe có hoàn toàn miễn phí không?",
    answer:
      "Gói Free của MeMe hoàn toàn miễn phí mãi mãi — bao gồm ghi chép không giới hạn, thống kê biểu đồ, danh mục tùy chỉnh và đồng bộ đa thiết bị. Bạn chỉ trả phí khi muốn mở khóa các tính năng nâng cao như AI dự đoán, OCR quét hóa đơn, báo cáo PDF chuyên nghiệp hoặc quản lý nhiều tài khoản doanh nghiệp.",
    category: "pricing",
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    question:
      "Tôi có thể import dữ liệu từ Excel, Google Sheets hoặc ngân hàng không?",
    answer:
      "Có! MeMe hỗ trợ import Excel/CSV chỉ trong 30 giây với mẫu file chuẩn có sẵn. Ngoài ra, bạn có thể kết nối trực tiếp với 8 ngân hàng lớn tại Việt Nam (Vietcombank, Techcombank, BIDV, MB Bank...) để tự động đồng bộ giao dịch mỗi ngày.",
    category: "features",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    question: "Dữ liệu tài chính của tôi được bảo mật như thế nào?",
    answer:
      "Chúng tôi sử dụng mã hóa end-to-end AES-256 (chuẩn ngân hàng), lưu trữ trên cloud riêng tại Việt Nam, hỗ trợ 2FA + OTP qua email/SMS, tự động backup mỗi 6 giờ và cho phép bạn xuất toàn bộ dữ liệu bất kỳ lúc nào. Không bên thứ ba nào (kể cả nhân viên MeMe) có thể xem được dữ liệu của bạn.",
    category: "security",
    icon: <Shield className="w-5 h-5" />,
  },
  {
    question: "AI dự đoán chi tiêu của MeMe hoạt động chính xác đến mức nào?",
    answer:
      "AI của MeMe đạt độ chính xác trung bình 94.7% (dựa trên 500.000 người dùng thực tế). Hệ thống phân tích dữ liệu 6 tháng gần nhất, kết hợp EMA, Linear Regression và mô hình học hành vi cá nhân để dự đoán chính xác bạn sẽ chi bao nhiêu cho từng hạng mục trong tháng tới.",
    category: "ai",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    question:
      "Tôi có thể dùng MeMe trên điện thoại, máy tính bảng và laptop cùng lúc không?",
    answer:
      "Hoàn toàn được! MeMe là Progressive Web App (PWA) hiện đại nhất — bạn chỉ cần truy cập mem.app trên bất kỳ thiết bị nào, thêm vào màn hình chính như app thật. Tất cả dữ liệu đồng bộ tức thì, không cần cài đặt.",
    category: "general",
    icon: <Globe className="w-5 h-5" />,
  },
  {
    question: "Làm sao để liên hệ hỗ trợ khi gặp vấn đề?",
    answer:
      "Chúng tôi hỗ trợ 24/7 qua chat trực tiếp trong ứng dụng (góc dưới bên phải), email support@meme.app hoặc hotline 1800-888-999 (miễn phí). 92% câu hỏi được giải quyết trong vòng 5 phút.",
    category: "general",
    icon: <HelpCircle className="w-5 h-5" />,
  },
];

const categories = [
  { key: "all", label: "Tất cả", icon: <HelpCircle className="w-4 h-4" /> },
  { key: "pricing", label: "Bảng giá", icon: <Sparkles className="w-4 h-4" /> },
  { key: "features", label: "Tính năng", icon: <Zap className="w-4 h-4" /> },
  { key: "security", label: "Bảo mật", icon: <Shield className="w-4 h-4" /> },
  { key: "ai", label: "AI & Dự đoán", icon: <Zap className="w-4 h-4" /> },
  { key: "general", label: "Chung", icon: <Globe className="w-4 h-4" /> },
];

const FaqPage = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaqs = faqs
    .filter((faq) => filter === "all" || faq.category === filter)
    .filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      {/* HERO SIÊU ĐẸP */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0055FF] via-[#0066EE] to-[#00D4FF] text-white py-32">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-cyan-300/20 animate-pulse"></div>

        {/* Decorative blur circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-2xl"></div>

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
                y: Math.random() * 600,
              }}
              animate={{
                y: [Math.random() * 600, Math.random() * 600 - 100],
                x: [
                  Math.random() *
                    (typeof window !== "undefined" ? window.innerWidth : 1200),
                  Math.random() *
                    (typeof window !== "undefined" ? window.innerWidth : 1200) +
                    (Math.random() - 0.5) * 200,
                ],
                opacity: [0.3, 0.7, 0.3],
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
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

        <div className="absolute inset-0 bg-black/20"></div>

        {/* Decorative shapes */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 border-4 border-white/20 rounded-full"
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
          className="absolute bottom-20 right-20 w-16 h-16 border-4 border-cyan-200/30 rotate-45"
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
          <MessageCircle className="w-full h-full text-white/30" />
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
          <HelpCircle className="w-full h-full text-white/35" />
        </motion.div>
        <motion.div
          className="absolute top-40 right-32 w-10 h-10"
          animate={{
            y: [0, -15, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Star className="w-full h-full text-yellow-300/40" />
        </motion.div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 mb-8"
            >
              <TrendingUp className="w-5 h-5 text-cyan-200" />
              <span className="text-sm font-semibold">
                95% câu hỏi được giải đáp tại đây
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight drop-shadow-2xl">
              Bạn cần hỗ trợ?
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-white">
                Chúng tôi có sẵn câu trả lời
              </span>
            </h1>
            <p className="text-xl md:text-2xl font-light opacity-90 max-w-3xl mx-auto mb-8">
              Hơn 95% người dùng tìm thấy giải pháp ngay tại đây. Nếu không, đội
              ngũ hỗ trợ 24/7 luôn sẵn sàng.
            </p>

            {/* Stats badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-4 mb-12"
            >
              {[
                { icon: MessageCircle, text: "Hỗ trợ 24/7" },
                { icon: Zap, text: "Phản hồi <5 phút" },
                { icon: Star, text: "Đánh giá 4.9/5" },
              ].map((badge, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 hover:bg-white/20 transition-all"
                >
                  <badge.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{badge.text}</span>
                </div>
              ))}
            </motion.div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mt-12">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
                <input
                  type="text"
                  placeholder="Tìm kiếm câu hỏi... ví dụ: import excel, bảo mật, giá bao nhiêu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-16 pr-6 py-6 rounded-full text-gray-900 text-lg font-medium focus:outline-none focus:ring-4 focus:ring-white/30 shadow-2xl"
                />
              </div>
            </div>
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
              fillOpacity="0.1"
            />
          </svg>
        </div>
      </section>

      {/* FILTER TABS */}
      <section className="py-10 bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setFilter(cat.key)}
                className={`flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all ${
                  filter === cat.key
                    ? "bg-gradient-to-r from-[#0055FF] to-[#00D4FF] text-white shadow-xl"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ LIST – SIÊU ĐẸP */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="space-y-6">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-6">🔍</div>
                <p className="text-2xl text-gray-600">
                  Không tìm thấy câu hỏi phù hợp
                </p>
                <p className="text-lg text-gray-500 mt-4">
                  Hãy thử từ khóa khác hoặc liên hệ hỗ trợ ngay nhé!
                </p>
              </div>
            ) : (
              filteredFaqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setActiveIndex(activeIndex === index ? null : index)
                    }
                    className="w-full p-8 text-left flex items-start justify-between gap-6 hover:bg-gray-50/50 transition-all"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-[#0055FF]">{faq.icon}</div>
                        <span className="text-sm font-bold text-[#0055FF] uppercase tracking-wider">
                          {
                            categories.find((c) => c.key === faq.category)
                              ?.label
                          }
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                        {faq.question}
                      </h3>
                    </div>
                    <motion.div
                      animate={{ rotate: activeIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-8 h-8 text-[#0055FF]" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {activeIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-8 pb-10 pt-4 text-lg text-gray-700 leading-relaxed border-t border-gray-100">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </div>

          {/* CTA HỖ TRỢ */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-20 text-center bg-gradient-to-br from-[#0055FF] to-[#00D4FF] text-white rounded-3xl p-16 shadow-2xl"
          >
            <h3 className="text-4xl md:text-5xl font-black mb-6">
              Vẫn chưa tìm thấy câu trả lời?
            </h3>
            <p className="text-xl opacity-90 mb-10">
              Đội ngũ hỗ trợ của MeMe luôn sẵn sàng giúp bạn — 24/7, tiếng Việt,
              phản hồi trong 3 phút.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="mailto:support@meme.app"
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-[#0055FF] font-black text-xl rounded-full hover:scale-105 transition-all shadow-xl"
              >
                Gửi email hỗ trợ
              </a>
              <a
                href="https://m.me/memeapp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-5 bg-white/20 backdrop-blur border-2 border-white text-white font-black text-xl rounded-full hover:bg-white/30 transition-all"
              >
                Chat ngay trên Messenger
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FaqPage;
