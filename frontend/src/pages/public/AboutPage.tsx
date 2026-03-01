import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Target,
  Lightbulb,
  Heart,
  Shield,
  Zap,
  Users,
  Award,
  Globe,
  Rocket,
  Code,
  Star,
  TrendingUp,
  BarChart3,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Twitter,
  Instagram,
} from "lucide-react";

const AboutPage = () => {
  // Component tuyết rơi
  const SnowEffect = () => {
    const snowflakes = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 3 + 2}s`,
      animationDelay: `${Math.random() * 5}s`,
      fontSize: `${Math.random() * 10 + 10}px`,
      opacity: Math.random() * 0.6 + 0.4,
    }));

    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {snowflakes.map((flake) => (
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
    );
  };

  const stats = [
    { icon: Users, value: "50,000+", label: "Người dùng tin tưởng" },
    { icon: Award, value: "4.9/5", label: "Đánh giá trung bình" },
    { icon: TrendingUp, value: "300%", label: "Tăng trưởng 2025" },
    { icon: Globe, value: "Việt Nam", label: "Made with love in" },
  ];

  const values = [
    {
      icon: Heart,
      title: "Người dùng là trung tâm",
      desc: "Mọi tính năng đều bắt đầu từ câu hỏi: Người Việt thực sự cần gì khi quản lý tiền?. Chúng tôi lắng nghe hàng nghìn phản hồi, thử nghiệm liên tục và chỉ giữ lại những thứ thực sự giúp bạn tiết kiệm dễ dàng hơn.",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: Shield,
      title: "Bảo mật tuyệt đối",
      desc: "Dữ liệu thu chi của bạn được mã hóa end-to-end, không lưu mật khẩu dạng text, hỗ trợ 2FA và OTP. Ngay cả đội ngũ MeMe cũng không thể xem được thông tin chi tiêu cá nhân của bạn.",
      color: "from-cyan-500 to-blue-600",
    },
    {
      icon: Zap,
      title: "Đổi mới không ngừng",
      desc: "Chúng tôi cập nhật AI dự đoán chi tiêu, phân tích thói quen và gợi ý tiết kiệm mới mỗi tháng – để bạn luôn có công cụ thông minh nhất hỗ trợ việc làm chủ chi tiêu.",
      color: "from-purple-500 to-indigo-600",
    },
    {
      icon: Users,
      title: "Tinh thần đồng đội",
      desc: "Mỗi lập trình viên, designer, tester đều dùng MeMe để quản lý tiền của chính mình. Vì vậy chúng tôi hiểu sâu sắc nỗi đau và mong muốn của bạn – và đặt cả trái tim vào từng chi tiết nhỏ.",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: Award,
      title: "Chất lượng hàng đầu",
      desc: "Giao diện mượt mà, tốc độ tải dưới 1 giây, không quảng cáo làm phiền, không tính phí ẩn. Chúng tôi cam kết mang đến trải nghiệm tốt nhất có thể, mỗi ngày một tốt hơn.",
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: Globe,
      title: "Tác động xã hội",
      desc: "Mục tiêu của MeMe không chỉ là giúp bạn tiết kiệm vài triệu mỗi tháng, mà là góp phần xây dựng một thế hệ người Việt tự tin làm chủ chi tiêu, sống thoải mái và thịnh vượng hơn.",
      color: "from-sky-500 to-blue-700",
    },
  ];

  const team = [
    {
      name: "Võ Thành Long",
      role: "CEO & Founder",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      bio: "10 năm kinh nghiệm FinTech, từng làm tại Momo & VNPAY",
    },
    {
      name: "Trần Hoàng Minh",
      role: "CTO & AI Lead",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
      bio: "Tiến sĩ AI, chuyên gia Machine Learning",
    },
    {
      name: "Phạm Gia Hào",
      role: "Head of Design",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      bio: "Từng thiết kế cho Shopee & Tiki",
    },
    {
      name: "Đoàn Viên Hoàng Lâm",
      role: "Head of Design",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      bio: "Từng thiết kế cho Shopee & Tiki",
    },
  ];

  const milestones = [
    {
      year: "2025 Q1",
      title: "Thành lập MeMe",
      desc: "6 người bạn cùng đam mê chi tiêu cá nhân",
      icon: Rocket,
    },
    {
      year: "2025 Q3",
      title: "Ra mắt Beta",
      desc: "5.000 người dùng đầu tiên",
      icon: Code,
    },
    {
      year: "2025 Q4",
      title: "Phiên bản 1.0",
      desc: "Chính thức ra mắt công chúng",
      icon: Star,
    },
    {
      year: "2025 Q1",
      title: "50.000 người dùng",
      desc: "Top 3 app chi tiêu Việt Nam",
      icon: TrendingUp,
    },
    {
      year: "2025 Q2",
      title: "Ra mắt AI MeMe Pro",
      desc: "Dự đoán chi tiêu chính xác 94%",
      icon: BarChart3,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0066FF] via-[#0077FF] to-[#00D4FF] text-white py-32">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-cyan-400/20 animate-pulse"></div>

        {/* Decorative blur circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-2xl"></div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full"
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

        {/* Hiệu ứng tuyết rơi */}
        <SnowEffect />

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
          <Star className="w-full h-full text-white/30" />
        </motion.div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
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
              <Award className="w-5 h-5 text-yellow-300" />
              <span className="text-sm font-semibold">
                Top 3 App Quản lý chi tiêu Việt Nam 2025
              </span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-white drop-shadow-2xl leading-tight">
              Chúng tôi là{" "}
              <span className="text-cyan-200 inline-block animate-pulse">
                MeMe
              </span>
            </h1>

            <p className="text-2xl md:text-3xl font-light max-w-4xl mx-auto opacity-95 mb-8 leading-relaxed">
              phần mềm quản lý chi tiêu cá nhân được yêu thích nhất Việt Nam
            </p>

            {/* Feature badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4 mt-8"
            >
              {[
                { icon: Shield, text: "Bảo mật 100%" },
                { icon: Zap, text: "AI Thông minh" },
                { icon: Heart, text: "50K+ Người dùng" },
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

      {/* STATS */}
      <section className="py-16 bg-white/80 backdrop-blur">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <Icon className="w-12 h-12 mx-auto mb-4 text-[#0077FF]" />
                  <div className="text-4xl md:text-5xl font-black text-[#0066FF]">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 mt-2 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="py-24">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-[#0066FF]/10 to-[#00D4FF]/10 rounded-3xl p-10 border border-cyan-200"
          >
            <Target className="w-16 h-16 text-[#0066FF] mb-6 items-center" />
            <h2 className="text-4xl font-black mb-6">Sứ mệnh</h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              Giúp{" "}
              <span className="text-[#0077FF] font-bold">
                mọi người Việt Nam
              </span>
              <span> </span>
              làm chủ chi tiêu cá nhân, thoát khỏi cảnh "lương về tay là hết"
              và từng bước đạt được tự do chi tiêu thực sự.
              <br />
              <br />
              Chúng tôi không bán giấc mơ giàu nhanh – chúng tôi mang đến một
              công cụ đơn giản, trung thực để bạn hiểu rõ tiền mình đi đâu, chi
              tiêu thông minh hơn và xây dựng tương lai vững vàng hơn, ngay từ
              hôm nay.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-bl from-[#00D4FF]/10 to-[#0077FF]/10 rounded-3xl p-10 border border-cyan-200"
          >
            <Lightbulb className="w-16 h-16 text-[#00D4FF] mb-6" />
            <h2 className="text-4xl font-black mb-6">Tầm nhìn</h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              Trở thành{" "}
              <span className="text-[#0077FF] font-bold">
                phần mềm quản lý chi tiêu cá nhân số 1 Việt Nam
              </span>
              <span> </span>
              – nơi hàng triệu người Việt mở điện thoại mỗi ngày để kiểm soát
              chi tiêu, theo dõi mục tiêu tiết kiệm và tự tin nói: <br />
              <br />
              <span className="text-[#0077FF] font-bold">
                "Tiền của mình, mình làm chủ."
              </span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="py-24 bg-gradient-to-b from-cyan-50 to-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
            <h2 className="text-5xl font-black text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-[#0066FF] to-[#00D4FF]">
              Hành trình của MeMe
            </h2>

            <div className="bg-white rounded-3xl shadow-2xl p-12 border border-cyan-100">
              <p className="text-xl leading-relaxed text-gray-700 text-center">
                MeMe bắt đầu từ một câu hỏi mà ai cũng từng tự hỏi: <br />
                <span className="text-2xl font-bold text-[#0077FF] mt-4 inline-block">
                  "Tại sao quản lý tiền lại khó đến thế?"
                </span>
              </p>

              <p className="text-lg text-gray-600 mt-8 leading-relaxed text-balance text-center">
                Năm 2025, chúng tôi – một nhóm bạn trẻ Việt Nam mê công nghệ và
                đau đáu chuyện chi tiêu cá nhân – nhận ra rằng hầu hết app hiện
                tại đều <strong>quá phức tạp, khô khan</strong> và
                <strong> chẳng hiểu người Việt mình thật sự cần gì</strong>.
              </p>

              <p className="text-lg text-gray-600 mt-6 leading-relaxed text-balance text-center">
                Thế là <span className="font-bold text-[#0077FF]">MeMe</span> ra
                đời. Không chỉ là một phần mềm ghi thu chi bình thường, MeMe là
                <strong> người bạn đồng hành chi tiêu thông minh</strong> – tự
                động phân loại, nhắc nhở nhẹ nhàng, gợi ý tiết kiệm đúng lúc và
                và giúp bạn từng ngày sống thoải mái hơn mà vẫn làm chủ được
                đồng tiền.
              </p>

              <p className="text-xl font-semibold text-center text-[#0077FF] mt-10">
                "Từ hôm nay, tiền không còn làm khó bạn nữa. <br />
                Bạn làm chủ tiền – MeMe làm phần còn lại."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-black text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-[#0066FF] to-[#00D4FF]">
            Giá trị cốt lõi
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-center mb-12">
            Chúng tôi không chỉ xây dựng một phần mềm – chúng tôi đang thay đổi
            cách người Việt nghĩ về tiền bạc.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mt-4 ">
            {values.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl shadow-cyan-300 transition-all duration-300 border border-cyan-200 hover:border-teal-300 "
              >
                {/* Icon + viền nhẹ */}
                <div className="w-14 h-14 bg-[#0077FF]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyan-100 transition-colors">
                  <item.icon className="w-8 h-8 text-[#0077FF] group-hover:text-teal-400 transition-colors" />
                </div>

                {/* Tiêu đề */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-teal-400 transition-colors">
                  {item.title}
                </h3>

                {/* Mô tả dài hơn, dễ hiểu hơn */}
                <p className="text-gray-600 leading-relaxed group-hover:text-teal-400 transition-colors">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-24 bg-gradient-to-b from-white to-cyan-50">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-black text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-[#0066FF] to-[#00D4FF]">
            Đội ngũ MeMe
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>
                <div className="p-8 text-center">
                  <h3 className="text-2xl font-black text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-[#0077FF] font-bold text-lg mt-2">
                    {member.role}
                  </p>
                  <p className="text-gray-600 mt-4 leading-relaxed">
                    {member.bio}
                  </p>
                  <div className="flex justify-center gap-4 mt-6">
                    <a
                      href="#"
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#0077FF] hover:text-white transition"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#0077FF] hover:text-white transition"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MILESTONES */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-black text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-[#0066FF] to-[#00D4FF]">
            Hành trình phát triển
          </h2>
          <div className="max-w-5xl mx-auto">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-8 mb-16 ${
                  i % 2 === 1 ? "flex-row-reverse" : ""
                }`}
              >
                <div className="flex-1">
                  <div className="bg-white rounded-3xl shadow-xl p-8 border border-cyan-100">
                    <div className="text-[#0077FF] font-bold text-lg mb-2">
                      {m.year}
                    </div>
                    <h3 className="text-3xl font-black mb-3">{m.title}</h3>
                    <p className="text-gray-600 text-lg">{m.desc}</p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#0066FF] to-[#00D4FF] rounded-full flex items-center justify-center text-white shadow-2xl">
                    <m.icon className="w-10 h-10" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT + CTA */}
      <section className="py-28 bg-gradient-to-br from-[#0066FF] via-[#0077FF] to-[#00D4FF] text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-8">
            Bạn đã sẵn sàng cùng MeMe chưa?
          </h2>
          <p className="text-2xl mb-12 opacity-90">
            Hàng chục nghìn người đã thay đổi chi tiêu nhờ MeMe
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/register"
              className="btn btn-xl items-center justify-center bg-white text-[#0066FF] hover:bg-gray-100 font-black text-xl px-16 py-8 rounded-2xl shadow-2xl hover:scale-105 transition"
            >
              Tham gia MeMe ngay
              <ArrowRight className="w-7 h-7 ml-3" />
            </Link>
            <a
              href="mailto:hello@meme.app"
              className="btn btn-xl items-center justify-center btn-outline text-white border-2 border-white hover:bg-white hover:text-[#0066FF] font-bold text-xl px-16 py-8 rounded-2xl"
            >
              <Mail className="w-6 h-6 mr-3" />
              Liên hệ đội ngũ
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
