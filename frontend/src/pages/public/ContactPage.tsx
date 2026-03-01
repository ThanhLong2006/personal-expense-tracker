import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Send,
  CheckCircle,
  Clock,
  Sparkles,
  Star,
  Zap,
  Heart,
  Users,
  Award,
} from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Giả lập gửi form
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setSubmitted(true);
    setLoading(false);
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });

    // Tự động ẩn thông báo sau 6 giây
    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      {/* HERO CỰC ĐẸP VỚI HIỆU ỨNG 3D */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0066FF] via-[#0088FF] to-[#00D4FF] text-white py-32">
        {/* Animated gradient waves */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-sky-400/20"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{ backgroundSize: "400% 400%" }}
          />
        </div>

        {/* Multiple floating orbs */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 300 + 100,
                height: Math.random() * 300 + 100,
                background: `radial-gradient(circle, ${
                  i % 2 === 0
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 212, 255, 0.15)"
                })`,
                filter: "blur(40px)",
              }}
              animate={{
                x: [
                  Math.random() * 100 - 50,
                  Math.random() * 100 + 50,
                  Math.random() * 100 - 50,
                ],
                y: [
                  Math.random() * 100 - 50,
                  Math.random() * 100 + 50,
                  Math.random() * 100 - 50,
                ],
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              initial={{
                x:
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerWidth : 1200),
                y: Math.random() * 600,
              }}
            />
          ))}
        </div>

        {/* Particle rain */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              initial={{
                x:
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerWidth : 1200),
                y: -20,
                opacity: Math.random() * 0.5 + 0.3,
              }}
              animate={{
                y: 700,
                opacity: 0,
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Geometric shapes */}
        <motion.div
          className="absolute top-20 left-10"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div
            className="w-32 h-32 border-4 border-white/20 rounded-3xl"
            style={{ transform: "rotate(45deg)" }}
          />
        </motion.div>

        <motion.div
          className="absolute bottom-20 right-10"
          animate={{
            rotate: [360, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-24 h-24 border-4 border-cyan-300/30 rounded-full" />
        </motion.div>

        <motion.div
          className="absolute top-1/3 right-1/4"
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, 180, 360],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Star className="w-16 h-16 text-cyan-200/40" />
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 left-1/4"
          animate={{
            rotate: [0, -360],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Heart className="w-20 h-20 text-sky-200/30" />
        </motion.div>

        {/* Glowing lines */}
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ mixBlendMode: "overlay" }}
        >
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
              <stop offset="100%" stopColor="rgba(0,212,255,0.3)" />
            </linearGradient>
          </defs>
          {[...Array(5)].map((_, i) => (
            <motion.line
              key={i}
              x1={`${i * 20}%`}
              y1="0%"
              x2={`${(i + 1) * 20}%`}
              y2="100%"
              stroke="url(#gradient1)"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: [0, 1, 0],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut",
              }}
            />
          ))}
        </svg>

        <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >
            {/* Badge với animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-8 py-4 mb-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </motion.div>
              <span className="text-base font-bold">
                Đội ngũ hỗ trợ tận tâm nhất Việt Nam
              </span>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Award className="w-6 h-6 text-cyan-300" />
              </motion.div>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-black mb-8 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-white drop-shadow-2xl">
                Chúng tôi luôn ở đây
              </span>
              <br />
              <motion.span
                className="inline-block"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(255,255,255,0.5)",
                    "0 0 40px rgba(0,212,255,0.8)",
                    "0 0 20px rgba(255,255,255,0.5)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                để giúp bạn
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl font-light opacity-95 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Đội ngũ hỗ trợ MeMe hoạt động 24/7 — phản hồi trung bình trong{" "}
              <motion.strong
                className="inline-block"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                3 phút
              </motion.strong>
            </motion.p>

            {/* Floating stats cards */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-6 mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              {[
                {
                  icon: Clock,
                  text: "Phản hồi <3 phút",
                  color: "from-cyan-400 to-blue-500",
                },
                {
                  icon: Users,
                  text: "50K+ Hài lòng",
                  color: "from-blue-400 to-cyan-500",
                },
                {
                  icon: MessageCircle,
                  text: "24/7 Hỗ trợ",
                  color: "from-sky-400 to-blue-600",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className={`flex items-center gap-3 bg-gradient-to-r ${item.color} px-6 py-4 rounded-2xl shadow-2xl`}
                  whileHover={{ scale: 1.05, y: -5 }}
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    y: {
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    },
                  }}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-bold text-sm">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Animated bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <motion.path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
              fillOpacity="0.15"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </svg>
        </div>
      </section>

      {/* MAIN CONTENT – 2 CỘT ĐẸP */}
      <section className="py-20 px-6 -mt-10 relative z-20">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* THÔNG TIN LIÊN HỆ */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-10"
            >
              <div className="bg-white rounded-3xl shadow-2xl p-10 border border-cyan-100">
                <h2 className="text-4xl font-black mb-10 bg-gradient-to-r from-[#0055FF] to-[#00D4FF] bg-clip-text text-transparent">
                  Liên hệ nhanh
                </h2>

                <div className="space-y-8">
                  <motion.div
                    className="flex items-start gap-6"
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-[#0055FF] to-[#00D4FF] rounded-2xl flex items-center justify-center shadow-lg">
                      <Mail className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Email hỗ trợ</h3>
                      <p className="text-gray-600 text-lg">support@meme.app</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Phản hồi trong vòng 30 phút
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start gap-6"
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-[#0055FF] to-[#00D4FF] rounded-2xl flex items-center justify-center shadow-lg">
                      <Phone className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        Hotline miễn phí
                      </h3>
                      <p className="text-gray-600 text-lg">1800-888-999</p>
                      <p className="text-sm text-gray-500 mt-1">
                        8h00 - 22h00, kể cả cuối tuần
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start gap-6"
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-[#0055FF] to-[#00D4FF] rounded-2xl flex items-center justify-center shadow-lg">
                      <MessageCircle className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Chat trực tiếp</h3>
                      <p className="text-gray-600 text-lg">
                        Facebook Messenger • Zalo
                      </p>
                      <div className="flex gap-4 mt-3">
                        <motion.a
                          href="https://m.me/memeapp"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Messenger
                        </motion.a>
                        <motion.a
                          href="https://zalo.me/0909888999"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 bg-cyan-500 text-white rounded-full font-bold"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Zalo
                        </motion.a>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start gap-6"
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-[#0055FF] to-[#00D4FF] rounded-2xl flex items-center justify-center shadow-lg">
                      <MapPin className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Trụ sở chính</h3>
                      <p className="text-gray-600 text-lg">
                        Tầng 15, Tòa nhà Viettel Complex
                        <br />
                        285 Cách Mạng Tháng Tám, Quận 10, TP.HCM
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* BẢN ĐỒ NHỎ */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-cyan-100"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.447446125711!2d106.667883!3d10.786383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f38f9436cf3%3A0x3e0a3e3e3e3e3e3e!2sViettel%20Complex!5e0!3m2!1svi!2s!4v1730000000000"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-3xl"
                ></iframe>
              </motion.div>
            </motion.div>

            {/* FORM GỬI TIN NHẮN – SIÊU ĐẸP */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-white rounded-3xl shadow-2xl p-10 lg:p-12 border border-cyan-100">
                <h2 className="text-4xl font-black mb-8 bg-gradient-to-r from-[#0055FF] to-[#00D4FF] bg-clip-text text-transparent">
                  Gửi tin nhắn cho chúng tôi
                </h2>

                {submitted ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-16"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5 }}
                    >
                      <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
                    </motion.div>
                    <h3 className="text-3xl font-black mb-4">
                      Gửi thành công!
                    </h3>
                    <p className="text-xl text-gray-600">
                      Cảm ơn bạn. Chúng tôi sẽ phản hồi trong vòng 30 phút tới
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-7">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-lg font-bold mb-2">
                          Họ và tên *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/20 transition-all text-lg"
                          placeholder="Nguyễn Văn A"
                        />
                      </div>
                      <div>
                        <label className="block text-lg font-bold mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-[#0055FF] focus:ring-[#0055FF]/20 transition-all text-lg"
                          placeholder="you@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-lg font-bold mb-2">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-[#0055FF] focus:ring-[#0055FF]/20 transition-all text-lg"
                        placeholder="090x xxx xxx"
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-bold mb-2">
                        Chủ đề
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-[#0055FF] focus:ring-[#0055FF]/20 transition-all text-lg"
                      >
                        <option value="">Chọn chủ đề...</option>
                        <option>Hỏi về tính năng</option>
                        <option>Báo lỗi phần mềm</option>
                        <option>Đề xuất cải tiến</option>
                        <option>Hợp tác kinh doanh</option>
                        <option>Khác</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-lg font-bold mb-2">
                        Nội dung chi tiết *
                      </label>
                      <textarea
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-[#0055FF] focus:ring-[#0055FF]/20 transition-all text-lg resize-none"
                        placeholder="Hãy mô tả chi tiết vấn đề hoặc câu hỏi của bạn..."
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="w-full py-6 bg-gradient-to-r from-[#0055FF] to-[#00D4FF] text-white font-black text-xl rounded-2xl shadow-2xl flex items-center justify-center gap-4 disabled:opacity-70"
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 20px 40px rgba(0,85,255,0.4)",
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? (
                        <>Đang gửi...</>
                      ) : (
                        <>
                          Gửi tin nhắn ngay
                          <Send className="w-6 h-6" />
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA CUỐI TRANG */}
      <section className="py-20 bg-gradient-to-br from-[#0055FF] to-[#00D4FF] text-white relative overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              animate={{
                y: ["0%", "100%"],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: "-20px",
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.h2
            className="text-4xl md:text-5xl font-black mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            Bạn muốn nói chuyện trực tiếp?
          </motion.h2>
          <motion.p
            className="text-xl opacity-90 mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Gọi ngay hotline <strong>1800-888-999</strong> — chúng tôi nghe máy
            trong vòng 5 giây
          </motion.p>
          <motion.a
            href="tel:1800888999"
            className="inline-flex items-center gap-4 px-12 py-6 bg-white text-[#0055FF] font-black text-2xl rounded-full shadow-2xl"
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Phone className="w-8 h-8" />
            Gọi ngay miễn phí
          </motion.a>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
