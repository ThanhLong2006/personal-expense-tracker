import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Shield,
  Zap,
  Smartphone,
  Cloud,
  CheckCircle2,
  ArrowRight,
  Star,
  Users,
  DollarSign,
  Calendar,
  PieChart,
  FileText,
  Download,
  Upload,
  Image as ImageIcon,
  Brain,
  Lock,
  Globe,
  CalendarCheck,
  Globe2,
  BarChart4,
  Mic,
  Share2,
  CreditCard,
  RefreshCw,
  FileSpreadsheet,
  FileDown,
  Headphones,
  Bell,
  Settings,
  Wallet,
  Receipt,
  Percent,
  Target,
  Sparkles,
  FolderOpen,
  Facebook,
} from "lucide-react";

/**
 * Component LandingPage chính
 */
const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const [activeFeature, setActiveFeature] = useState(0);
  // Dữ liệu thống kê (theo đúng ảnh)
  const stats = [
    { value: "+2.5M", label: "Lượt tải" },
    { value: "37.1k", label: "Reviews" },
    { value: "Ứng dụng tài chính", label: "Được khuyên dùng" },
    { value: "4.7 ★", label: "Ratings" },
  ];

  // Features preview
  const features = [
    {
      icon: BarChart3,
      title: "Dashboard tổng quan & Phân tích",
      tag: "Phân tích",
      description:
        "Biểu đồ trực quan, KPI thời gian thực, báo cáo thu chi chi tiết theo ngày/tuần/tháng/năm",
      details: [
        "Widget tùy chỉnh theo nhu cầu",
        "Báo cáo thời gian thực & filter nâng cao",
        "Export CSV / PDF chỉ 1 click",
        "AI phân tích xu hướng chi tiêu",
      ],
      bgColor: "bg-blue-500/10",
      color: "text-blue-600",
    },
    {
      icon: Brain,
      title: "AI Dự đoán & Gợi ý thông minh",
      tag: "Phân tích",
      description:
        "Dự báo chi tiêu tháng tới, phát hiện bất thường, gợi ý tiết kiệm tự động",
      details: [
        "Dự đoán chi tiêu chính xác >90%",
        "Cảnh báo vượt ngân sách theo danh mục",
        "Gợi ý cắt giảm chi phí hợp lý",
        "Học thói quen của riêng bạn",
      ],
      bgColor: "bg-purple-500/10",
      color: "text-purple-600",
    },
    {
      icon: Smartphone,
      title: "Quản lý giao dịch siêu nhanh",
      tag: "Quản lý",
      description:
        "Thêm giao dịch chỉ trong 3 giây, import hóa đơn, quét QR, giọng nói",
      details: [
        "Thêm giao dịch bằng giọng nói",
        "Import Excel & ảnh hóa đơn tự động",
        "Quét QR thanh toán nhận diện",
        "Đồng bộ ngân hàng (sắp có)",
      ],
      bgColor: "bg-green-500/10",
      color: "text-green-600",
    },
    {
      icon: Shield,
      title: "Bảo mật chuẩn ngân hàng",
      tag: "Bảo mật",
      description:
        "Dữ liệu mã hóa end-to-end, xác thực 2 lớp, không lưu mật khẩu dạng text",
      details: [
        "Mã hóa AES-256 toàn bộ dữ liệu",
        "Xác thực 2FA + OTP email/SMS",
        "JWT + Refresh token bảo mật phiên",
        "Không bao giờ lưu mật khẩu rõ",
      ],
      bgColor: "bg-red-500/10",
      color: "text-red-600",
    },
    {
      icon: Zap,
      title: "Tốc độ & Trải nghiệm mượt",
      tag: "Kỹ thuật",
      description:
        "Tải tức thì, offline first, hoạt động hoàn hảo cả khi mất mạng",
      details: [
        "Offline mode đầy đủ tính năng",
        "Tự động đồng bộ khi có mạng",
        "Tối ưu React + Spring Boot",
        "Phản hồi dưới 100ms",
      ],
      bgColor: "bg-yellow-500/10",
      color: "text-yellow-600",
    },
    {
      icon: Cloud,
      title: "Đồng bộ đám mây & Đa nền tảng",
      tag: "Kỹ thuật",
      description:
        "Dùng trên web, mobile, desktop – dữ liệu luôn đồng bộ mọi nơi",
      details: [
        "Web + Mobile (React Native sắp ra)",
        "Đồng bộ realtime qua WebSocket",
        "Backup tự động hàng ngày",
        "Truy cập mọi thiết bị",
      ],
      bgColor: "bg-cyan-500/10",
      color: "text-cyan-600",
    },
  ];
  // How it works steps
  const steps = [
    {
      number: "01",
      title: "Đăng ký tài khoản",
      description:
        "Tạo tài khoản miễn phí chỉ trong vài phút, xác thực qua email OTP",
      icon: CheckCircle2,
    },
    {
      number: "02",
      title: "Thêm giao dịch",
      description:
        "Ghi nhận chi tiêu hàng ngày, upload hóa đơn, sử dụng OCR tự động",
      icon: FileText,
    },
    {
      number: "03",
      title: "Phân loại & Phân tích",
      description:
        "Hệ thống tự động phân loại và phân tích chi tiêu theo danh mục",
      icon: BarChart3,
    },
    {
      number: "04",
      title: "Xem báo cáo & Dự đoán",
      description:
        "Xem báo cáo chi tiết, biểu đồ trực quan và dự đoán chi tiêu tương lai",
      icon: TrendingUp,
    },
  ];

  const testimonials = [
    {
      name: "VHSLTT",
      rating: 5,
      time: "1 tháng 11",
      title: "Rất hài lòng, đã mua bản Premium",
      content:
        "Dùng bản free đã thấy rất tốt, lâu lâu lại mở app ra quản lý chi tiêu. Chỉ sau vài tháng mình quyết định mua luôn bản Premium. Đặc biệt thích phần quản lý tài khoản, thẻ ngân hàng và nhất là sổ tiết kiệm. Giao diện rõ ràng, có thông báo nhắc nhở đến hạn rất tiện lợi.",
    },
    {
      name: "JnT man vien",
      rating: 5,
      time: "3 giờ trước",
      title: "Ứng dụng thống kê thu chi cá nhân cực kỳ hữu ích",
      content:
        "Mình dùng từ năm 2018 đến nay, tiện quá nên ngày nào cũng ghi chép chi tiêu. Giúp kiểm soát túi tiền cực tốt! Giao diện dễ dùng, hỗ trợ nhiều ví (tiền mặt, Momo, ngân hàng, thẻ tín dụng). Có sẵn biểu đồ phân tích tài chính nhiều năm. Dùng free cũng ổn nhưng mình vừa mua Premium để dùng dài hạn, rất đáng tiền!",
    },
    {
      name: "hangneejanggq",
      rating: 5,
      time: "10 tháng 12",
      title: "App tuyệt vời, nhiều tính năng, dễ dùng",
      content:
        "App cực kỳ chất lượng và đầy đủ tính năng. Giao diện thân thiện, dễ sử dụng. Chỉ cần mình chịu khó ghi chép là kiểm soát được toàn bộ dòng tiền.",
    },
    {
      name: "ALemnnhS",
      rating: 5,
      time: "21 tháng 2",
      title: "NỀN TẢNG QUẢN LÝ CHI TIÊU – DÙNG TỪ 2021 ĐẾN NAY",
      content:
        "Dùng Money Keeper từ 2021, trước đây hay bị thất thoát tiền, chi tiêu không kiểm soát được. Mình đã thử rất nhiều app khác nhưng thấy MeMe (trước là MISA) là ổn định và tốt nhất. Bản free đã đầy đủ chức năng, không quảng cáo, không moi tiền người dùng. Mãi yêu team phát triển!",
    },
    {
      name: "bmx993",
      rating: 5,
      time: "18 tháng 4",
      title: "The best expense management app",
      content:
        "Đã dùng rất nhiều ứng dụng quản lý chi tiêu, cuối cùng chọn MeMe để gắn bó lâu dài. Quá ổn định và đáng tin cậy!",
    },
    {
      name: "Conchochenchuc",
      rating: 5,
      time: "Tháng 2",
      title: "Ứng dụng ghi chép đáng tiền nhất",
      content:
        "Mình đã mua gói năm và gói không thời hạn. So với nhiều app khác thì MeMe có tính năng sổ tiết kiệm mà rất ít app có. Xứng đáng đồng tiền bát gạo!",
    },
    {
      name: "An Đỗ Thanh",
      rating: 5,
      time: "1 giờ trước",
      title: "Quản lý được tiền, tiết kiệm được thật!",
      content:
        "Dùng app rất ổn, giúp quản lý chi tiêu và ngân sách rõ ràng. Từ ngày dùng MeMe, mình đã tiết kiệm được kha khá mỗi tháng.",
    },
    {
      name: "TueMinh000S",
      rating: 5,
      time: "22 tháng 5",
      title: "App mình đã dùng hơn 5 năm",
      content:
        "Một ứng dụng thu chi cực kỳ hữu ích! Mình dùng bản free suốt 5 năm nay. Đợt này app có chương trình gia hạn Premium không thời hạn nên mình mua luôn. Rất đáng tiền và quá hời!",
    },
    {
      name: "Lyncy Nguyen",
      rating: 5,
      time: "1 giờ trước",
      title: "App xài rất tốt và tiện lợi",
      content:
        "Mình biết và sử dụng app hơn 5 năm rồi. Phần mềm liên tục được cập nhật tính năng mới, rất tốt trong việc ghi chép và quản lý chi tiêu hàng ngày.",
    },
    {
      name: "Phạm Song Tân",
      rating: 5,
      time: "1 giờ trước",
      title: "App quản lý tài chính cá nhân tuyệt vời",
      content:
        "MeMe giúp mình quản lý thu chi hàng tháng rất hiệu quả. Biết rõ mình đã chi những gì, thu từ đâu để tối ưu tài chính tốt hơn, đủ tiền sinh hoạt và còn dư để tiết kiệm.",
    },
    {
      name: "Người dùng ẩn danh",
      rating: 5,
      time: "3 năm trước",
      title: "Cảm ơn MeMe rất nhiều",
      content:
        "Nhờ có MeMe mà mình hình thành thói quen ghi chép thu chi hàng ngày. Cuối năm chỉ cần mở app là thấy tổng quan tài chính cả năm, không cần ngồi tính toán lại. Tiết kiệm được rất nhiều thời gian và tiền bạc!",
    },
  ];
  const featuress = [
    {
      icon: FileText,
      title: "Ghi chép thu chi thông minh",
      desc: "Dễ dàng tìm kiếm mọi khoản thu chi bạn theo từng ngày, mục, dự án...",
      image:
        "https://sothuchi.misa.vn/sites/sothuchi/images/home-v2/img-benefit-1-vn.webp",
      side: "left",
    },
    {
      icon: BarChart3,
      title: "Báo cáo trực quan, sinh động",
      desc: "Thông kê rõ ràng, thống kê linh hoạt khoản thu chi của bạn",
      image:
        "https://sothuchi.misa.vn/sites/sothuchi/images/home-v2/img-benefit-2-vn.webp",
      side: "left",
    },
    {
      icon: Smartphone,
      title: "Theo dõi vay nợ",
      desc: "Ghi chép và theo dõi chặt chẽ các khoản vay nợ",
      image:
        "https://sothuchi.misa.vn/sites/sothuchi/images/home-v2/img-benefit-3-vn.webp",
      side: "left",
    },
    {
      icon: Mic,
      title: "Ghi chép bằng giọng nói",
      desc: "Tối ưu hóa việc quản lý thu chi cá nhân với công nghệ AI mạnh mẽ",
      image:
        "https://sothuchi.misa.vn/sites/sothuchi/images/home-v2/img-benefit-4-vn.webp",
      side: "left",
    },
    {
      icon: Share2,
      title: "Chia sẻ không giới hạn",
      desc: "Quản lý chi tiêu dễ dàng hơn cùng gia đình và nhóm của bạn",
      image:
        "https://sothuchi.misa.vn/sites/sothuchi/images/home-v2/img-benefit-5-vn.webp",
      side: "right",
    },
    {
      icon: FolderOpen,
      title: "Xuất khẩu dữ liệu excel, pdf",
      desc: "Giúp bạn trích xuất thông tin nhanh chóng, dễ dàng phân tích và chia sẻ dữ liệu",
      image:
        "https://sothuchi.misa.vn/sites/sothuchi/images/home-v2/img-benefit-6-vn.webp",
      side: "right",
    },
    {
      icon: Cloud,
      title: "Đồng bộ dữ liệu",
      desc: "Dữ liệu được đồng bộ trên cloud, cho phép đồng bộ giữa nhiều thiết bị",
      image:
        "https://sothuchi.misa.vn/sites/sothuchi/images/home-v2/img-benefit-7-vn.webp",
      side: "right",
    },
    {
      icon: Lock,
      title: "Lập hạn mức chi tiêu",
      desc: "Giúp bạn kiểm soát chi tiêu hiệu quả mà không vượt quá ngân sách",
      image:
        "https://sothuchi.misa.vn/sites/sothuchi/images/home-v2/img-benefit-8-vn.webp",
      side: "right",
    },
  ];

  const leftFeatures = featuress.filter((f) => f.side === "left");
  const rightFeatures = featuress.filter((f) => f.side === "right");
  const [particles, setParticles] = useState<Array<any>>([]);
  const [shootingStars, setShootingStars] = useState<Array<any>>([]);
  // Tạo các hạt sáng bay (particles) - nhiều hơn và di chuyển tự do
  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 3,
      moveX: (Math.random() - 0.5) * 200,
      moveY: (Math.random() - 0.5) * 200,
    }));
    setParticles(newParticles);
  }, []);

  // Tạo sao băng định kỳ
  useEffect(() => {
    const createShootingStar = () => {
      const star = {
        id: Date.now(),
        left: Math.random() * 100,
        top: Math.random() * 50,
        duration: Math.random() * 1 + 0.5,
      };
      setShootingStars((prev) => [...prev, star]); // Thêm sao băng mới vào danh sách (React sẽ re-render)

      // Xóa sao băng khỏi danh sách sau khi nó bay xong + 0.5s (tránh nháy mắt)
      setTimeout(() => {
        setShootingStars((prev) => prev.filter((s) => s.id !== star.id));
      }, (star.duration + 0.5) * 1000); // Chuyển giây → mili giây
    };

    // Cứ mỗi 3000ms (3 giây) thì bắn 1 sao băng
    const interval = setInterval(createShootingStar, 2000);

    // Khi component bị unmount (thoát trang) → dừng bắn sao băng, tránh memory leak
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {/* ==================== HERO SECTION - ẢNH 1 ==================== */}
      <section className="relative py-32 md:py-40 lg:py-16 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center overflow-hidden">
        {/* Background decoration circles */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        {/* Hạt sáng lấp lánh */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-white opacity-80 shadow-lg"
            style={
              {
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animation: `floatParticle ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
                boxShadow: "0 0 8px rgba(255, 255, 255, 0.9)",
                // Quan trọng: truyền biến CSS
                "--move-x": `${particle.moveX}px`,
                "--move-y": `${particle.moveY}px`,
              } as React.CSSProperties
            }
          />
        ))}
        {/* Sao băng */}
        {shootingStars.map((star) => (
          <div
            key={star.id}
            className="absolute"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              animation: `shooting ${star.duration}s linear forwards`,
            }}
          >
            <div className="relative">
              <div className="w-1 h-1 bg-white rounded-full shadow-lg"></div>
              <div
                className="absolute top-1/2 -left-1 w-40 h-0.5 bg-gradient-to-r from-white via-white to-transparent opacity-80 blur-sm"
                style={{ transform: "translateY(-50%) rotate(-40deg)" }}
              />
            </div>
          </div>
        ))}
        {/* Lưới gạch trắng động - giống hình mẫu */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0 opacity-70" // tăng opacity lên 70% cho sáng rõ
            style={{
              backgroundImage: `
                 linear-gradient(to right, rgba(255, 255, 255, 0.6) 1px, transparent 1px),
                 linear-gradient(to bottom, rgba(255, 255, 255, 0.6) 1px, transparent 1px)`, //Tạo các vạch dọc → kết hợp với trên = lưới ô vuông
              backgroundSize: "50px 50px", // nhỏ hơn → nhìn dày đặc và sắc nét hơn
              animation: "gridPerspective 20s linear infinite",
              transform: "perspective(800px) rotateX(65deg) scale(1.5)",
              transformOrigin: "center bottom",
            }}
          />

          {/* Thêm lớp glow nhẹ để tăng độ sáng và futuristic */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                 linear-gradient(to right, rgba(0, 119, 255, 0.4) 1px, transparent 1px),
                 linear-gradient(to bottom, rgba(0, 212, 255, 0.4) 1px, transparent 1px)`,
              backgroundSize: "80px 80px",
              animation: "gridPerspective 25s linear infinite reverse",
              transform: "perspective(800px) rotateX(65deg) scale(1.5)",
              transformOrigin: "center bottom",
            }}
          />
        </div>
        <div className="container mx-10 px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6 ml-16">
                Quản lý chi tiêu MeMe
              </h3>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8 max-w-2xl ml-16">
                Quản lý tài chính cá nhân không dễ dàng, nhưng đội ngũ của chúng
                tôi luôn cố gắng giúp nó trở nên đơn giản hơn trong suốt chặng
                đường 10 năm qua!
              </p>

              {/* App Store Buttons */}
              <div className="flex flex-col sm:flex-row gap-5 mb-12 justify-center lg:justify-start ml-16">
                {/* Nút App Store */}
                <a
                  href="https://apps.apple.com/vn/app/sổ-thu-chi-misa/id123456789" // thay link thật nếu có
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center text-white px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 "
                >
                  <img
                    src="https://sothuchi.misa.vn/sites/sothuchi/images/home-v2/app-store.png"
                    alt="Tải trên App Store"
                    className="h-12 md:h-14 w-auto"
                  />
                </a>

                {/* Nút Google Play */}
                <a
                  href="https://play.google.com/store/apps/details?id=com.misa.sothuchi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center text-white px-1 py-4 rounded-2xl transition-all duration-300 hover:scale-105 "
                >
                  <img
                    src="https://sothuchi.misa.vn/sites/sothuchi/images/home-v2/google-play.png"
                    alt="Tải trên Google Play"
                    className="h-12 md:h-14 w-auto" // cùng chiều cao với nút App Store
                  />
                </a>
              </div>

              <p className="text-2xl font-semibold text-white ml-16">
                Tham gia ngay với +2,5 triệu người dùng khác
              </p>
            </motion.div>

            {/* Right - Devices */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative flex justify-center items-center"
            >
              {/* Laptop */}
              <div className=" z-10 transform transition-transform duration-500 hover:scale-105">
                <img
                  src="https://sothuchi.misa.vn/sites/sothuchi/images/home-v2/banner-img.webp"
                  alt="Sổ Thu Chi MISA trên laptop"
                  width={800}
                  height={800}
                  className="rounded-2xl mr-16"
                />
              </div>
            </motion.div>
          </div>
        </div>
        <style>{`
          @keyframes floatParticle {
            0%,
            100% {
              opacity: 0;
              transform: translate(0, 0) scale(1);
            }
            25% {
              opacity: 0.8;
              transform: translate(
                  calc(var(--move-x) * 0.5),
                  calc(var(--move-y) * 0.5)
                )
                scale(1.3);
            }
            50% {
              opacity: 1;
              transform: translate(var(--move-x), var(--move-y)) scale(1.5);
            }
            75% {
              opacity: 0.8;
              transform: translate(
                  calc(var(--move-x) * 0.5),
                  calc(var(--move-y) * 0.5)
                )
                scale(1.3);
            }
          }

          @keyframes shooting {
            0% {
              transform: translate(0, 0) rotate(45deg);
              opacity: 1;
            }
            100% {
              transform: translate(300px, 300px) rotate(45deg);
              opacity: 0;
            }
          }

          @keyframes gridPerspective {
            0% {
              background-position: 0 0;
            }
            100% {
              background-position: 60px 60px;
            }
          }

          @keyframes fadeInLeft {
            from {
              opacity: 0;
              transform: translateX(-50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: scale(0.8);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>
      </section>

      {/* ==================== THỐNG KÊ + TÍNH NĂNG - ẢNH 2 ==================== */}
      <section className="bg-white">
        {/* Thống kê - Thanh xanh đậm */}
        <div className="bg-[#0A1F3D] py-16 relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 text-center text-white">
              {/* Stat 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
                className="flex flex-col items-center relative"
              >
                {/* Hoa trang trí bên trái */}
                <img
                  src="https://sothuchi.misa.vn/sites/sothuchi/images/home-v2/flower-right.png"
                  alt=""
                  className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-[120%] h-32 md:h-40 opacity-80 transform scale-x-[-1]"
                />
                {/* Hoa trang trí bên phải */}
                <img
                  src="https://sothuchi.misa.vn/sites/sothuchi/images/home-v2/flower-right.png"
                  alt=""
                  className="absolute right-1/2 top-1/2 -translate-y-1/2 translate-x-[120%] h-32 md:h-40 opacity-80"
                />
                <div className="text-3xl md:text-4xl font-bold mb-2">+2.5M</div>
                <div className="text-sm md:text-base opacity-90">Lượt tải</div>
              </motion.div>

              {/* Stat 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center relative"
              >
                {/* Hoa trang trí bên trái */}
                <img
                  src="https://sothuchi.misa.vn/sites/sothuchi/images/home-v2/flower-right.png"
                  alt=""
                  className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-[120%] h-32 md:h-40 opacity-80 transform scale-x-[-1]"
                />
                {/* Hoa trang trí bên phải */}
                <img
                  src="https://sothuchi.misa.vn/sites/sothuchi/images/home-v2/flower-right.png"
                  alt=""
                  className="absolute right-1/2 top-1/2 -translate-y-1/2 translate-x-[120%] h-32 md:h-40 opacity-80"
                />
                <div className="text-3xl md:text-4xl font-bold mb-2">37.1k</div>
                <div className="text-sm md:text-base opacity-90">Reviews</div>
              </motion.div>

              {/* Stat 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center relative"
              >
                {/* Hoa trang trí bên trái */}
                <img
                  src="https://sothuchi.misa.vn/sites/sothuchi/images/home-v2/flower-right.png"
                  alt=""
                  className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-[120%] h-32 md:h-40 opacity-80 transform scale-x-[-1]"
                />
                {/* Hoa trang trí bên phải */}
                <img
                  src="https://sothuchi.misa.vn/sites/sothuchi/images/home-v2/flower-right.png"
                  alt=""
                  className="absolute right-1/2 top-1/2 -translate-y-1/2 translate-x-[120%] h-32 md:h-40 opacity-80"
                />
                <div className="text-xl md:text-1xl font-bold mb-2">
                  Ứng dụng tài chính
                </div>
                <div className="text-sm md:text-base opacity-90">
                  Được khuyên dùng
                </div>
              </motion.div>

              {/* Stat 4 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center relative"
              >
                {/* Hoa trang trí bên trái */}
                <img
                  src="https://sothuchi.misa.vn/sites/sothuchi/images/home-v2/flower-right.png"
                  alt=""
                  className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-[120%] h-32 md:h-40 opacity-80 transform scale-x-[-1]"
                />
                {/* Hoa trang trí bên phải */}
                <img
                  src="https://sothuchi.misa.vn/sites/sothuchi/images/home-v2/flower-right.png"
                  alt=""
                  className="absolute right-1/2 top-1/2 -translate-y-1/2 translate-x-[120%] h-32 md:h-40 opacity-80"
                />
                <div className="text-3xl md:text-4xl font-bold mb-2">4.7</div>
                <div className="text-sm md:text-base opacity-90">
                  Lượt đánh giá
                </div>
              </motion.div>

              {/* Stat 5 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col items-center relative"
              >
                {/* Hoa trang trí bên trái */}
                <img
                  src="https://sothuchi.misa.vn/sites/sothuchi/images/home-v2/flower-right.png"
                  alt=""
                  className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-[120%] h-32 md:h-40 opacity-80 transform scale-x-[-1]"
                />
                {/* Hoa trang trí bên phải */}
                <img
                  src="https://sothuchi.misa.vn/sites/sothuchi/images/home-v2/flower-right.png"
                  alt=""
                  className="absolute right-1/2 top-1/2 -translate-y-1/2 translate-x-[120%] h-32 md:h-40 opacity-80"
                />
                <div className="text-xl md:text-2xl font-bold mb-2">
                  Ứng dụng AI
                </div>
                <div className="text-sm md:text-base opacity-90">
                  Nhập liệu siêu tốc
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Tính năng */}
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Tính Năng Nổi Bật
              </h2>
              <p className="text-gray-600 text-lg">
                Việc quản lý tài chính trở nên tiện lợi với những tính năng đa
                dạng của chúng tôi
              </p>
            </div>

            <div className="flex items-start justify-center gap-12 max-w-7xl mx-auto">
              {/* CỘT TRÁI - 4 tính năng */}
              <div className="space-y-12 flex-1 max-w-lg mt-12 ">
                {leftFeatures.map((feature, i) => {
                  const globalIndex = i;
                  const isActive = activeFeature === globalIndex;

                  return (
                    <div
                      key={i}
                      onMouseEnter={() => setActiveFeature(globalIndex)}
                      className={`flex items-center gap-20 cursor-pointer transition-all duration-300 ${
                        isActive ? "scale-105" : "hover:scale-102"
                      }`}
                    >
                      {/* Text bên trái */}
                      <div
                        className={`text-left flex-1 transition-all duration-300 ${
                          isActive ? "text-teal-400" : "text-gray-500"
                        }`}
                      >
                        <h3
                          className={`text-base font-bold mb-1 transition-all duration-300 ${
                            isActive ? "text-teal-400" : "text-gray-900"
                          }`}
                        >
                          {feature.title}
                        </h3>
                        <p className="text-sm leading-relaxed">
                          {feature.desc}
                        </p>
                      </div>

                      {/* Icon tròn bên phải */}
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg flex-shrink-0 transition-all duration-500 ${
                          isActive
                            ? "bg-gradient-to-br from-teal-300 to-teal-400 shadow-2xl shadow-cyan-400/50 scale-110"
                            : "bg-gradient-to-br from-cyan-300 to-cyan-400 hover:from-teal-400 hover:to-teal-500"
                        }`}
                      >
                        <feature.icon
                          className={`transition-all duration-300 ${
                            isActive ? "w-8 h-8" : "w-7 h-7"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CỘT GIỮA - Điện thoại */}
              <div className="flex justify-center flex-shrink-0">
                <div className="relative w-64 h-[420px] sm:w-80 sm:h-[520px] lg:w-96 lg:h-[600px]">
                  {featuress.map((feature, i) => (
                    <img
                      key={i}
                      src={featuress[i].image}
                      alt={featuress[i].title}
                      className={`absolute inset-0 w-full h-full object-contain rounded-3xl transition-all duration-700 ${
                        activeFeature === i
                          ? "opacity-100 scale-100 z-10"
                          : "opacity-0 scale-95 z-0"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* CỘT PHẢI - 4 tính năng */}
              <div className="space-y-12 flex-1 max-w-lg mt-12">
                {rightFeatures.map((feature, i) => {
                  const globalIndex = i + 4;
                  const isActive = activeFeature === globalIndex;

                  return (
                    <div
                      key={i}
                      onMouseEnter={() => setActiveFeature(globalIndex)}
                      className={`flex items-center gap-20 cursor-pointer transition-all duration-300 ${
                        isActive ? "scale-105" : "hover:scale-102"
                      }`}
                    >
                      {/* Icon bên trái */}
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg flex-shrink-0 transition-all duration-500 ${
                          isActive
                            ? "bg-gradient-to-br from-teal-300 to-teal-400 shadow-2xl shadow-cyan-400/50 scale-110"
                            : "bg-gradient-to-br from-cyan-400 to-blue-500 hover:from-teal-400 hover:to-teal-500"
                        }`}
                      >
                        <feature.icon
                          className={`transition-all duration-300 ${
                            isActive ? "w-8 h-8" : "w-7 h-7"
                          }`}
                        />
                      </div>

                      {/* Text bên phải */}
                      <div
                        className={`text-left flex-1 transition-all duration-300 ${
                          isActive ? "text-teal-400" : "text-gray-500"
                        }`}
                      >
                        <h3
                          className={`text-base font-bold mb-1 transition-all duration-300 ${
                            isActive ? "text-teal-400" : "text-gray-900"
                          }`}
                        >
                          {feature.title}
                        </h3>
                        <p className="text-sm leading-relaxed">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chỉ báo tính năng đang active */}
            <div className="flex justify-center gap-2 mt-12">
              {features.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveFeature(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeFeature === i
                      ? "w-8 bg-cyan-600"
                      : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Chọn tính năng ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Features Preview Section */}
      <section className="py-20 bg-base-200 bg-gradient-to-b from-cyan-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-[#0066FF] to-[#00D4FF]">
              Tính năng nổi bật
            </h2>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              Tất cả công cụ bạn cần để quản lý chi tiêu hiệu quả
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group relative overflow-hidden rounded-3xl bg-white border border-cyan-100 shadow-lg hover:shadow-2xl hover:border-cyan-500 transition-all duration-500 hover:-translate-y-2"
              >
                {/* Tag nhỏ góc trên bên phải */}
                <div className="absolute top-4 right-4 z-10">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      feature.tag === "Phân tích"
                        ? "bg-blue-100 text-blue-700"
                        : feature.tag === "Bảo mật"
                        ? "bg-red-100 text-red-700"
                        : feature.tag === "Quản lý"
                        ? "bg-green-100 text-green-700"
                        : feature.tag === "Kỹ thuật"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-cyan-100 text-cyan-700"
                    }`}
                  >
                    {feature.tag}
                  </span>
                </div>

                <div className="p-10">
                  {/* Icon + hiệu ứng */}
                  <div
                    className={`inline-flex p-4 rounded-2xl ${feature.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className={`w-10 h-10 ${feature.color}`} />
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-8">
                    {feature.description}
                  </p>

                  {/* Danh sách tính năng nhỏ bên dưới */}
                  <ul className="space-y-3 mb-8">
                    {feature.details.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center text-sm text-gray-700"
                      >
                        <svg
                          className="w-4 h-4 text-green-500 mr-2 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* Nút Xem chi tiết + Yêu cầu demo */}
                  <div className="flex gap-4">
                    <button className="flex-1 btn btn-outline btn-sm rounded-xl bg-gradient-to-r from-[#0066FF] to-[#00D4FF] border-0 text-white hover:opacity-90 shadow-lg hover:shadow-cyan-300/50">
                      <Link to="/features">Xem chi tiết</Link>
                      <ArrowRight className="w-5 h-5 ml-17 " />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/features"
              className="btn text-white font-bold shadow-xl 
      hover:shadow-5xl transform hover:scale-105 
      transition-all duration-300 rounded-full px-5
      bg-gradient-to-r from-blue-400 to-cyan-500 
      hover:from-blue-300 hover:to-cyan-500"
            >
              Xem tất cả tính năng
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="py-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className="w-6 h-6 fill-yellow-300 text-yellow-300"
                />
              ))}
            </div>
            <div className="text-lg font-semibold mb-2">+37.1k reviews</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Cảm nhận của người dùng
            </h2>
            <p className="text-blue-50 max-w-3xl mx-auto text-base">
              Những đánh giá của người dùng là nguồn động lực cho đội ngũ chúng
              tôi tiếp tục cố gắng cải thiện và phát triển dịch vụ tốt hơn!
            </p>
          </div>

          {/* Testimonials Grid - Masonry Layout */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white text-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-sm">{testimonial.title}</h3>
                  <span className="text-xs text-gray-500">
                    {testimonial.time}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i <= testimonial.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  {testimonial.content}
                </p>

                {/* Author */}
                <div className="text-sm font-semibold text-gray-900">
                  {testimonial.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#001a4d] to-[#003380] text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Vì sao bạn nên chọn sử dụng ứng dụng của MeMe?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 max-w-7xl mx-auto">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-blue-500 rounded-2xl p-10 text-center"
            >
              <div className="text-3xl font-bold mb-2">30</div>
              <div className="text-sm">Năm kinh nghiệm</div>
              <div className="text-xs opacity-80">trong lĩnh vực CNTT</div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-blue-500 rounded-2xl p-10 text-center"
            >
              <div className="text-3xl font-bold mb-2">20</div>
              <div className="text-sm">Sản phẩm</div>
              <div className="text-xs opacity-80">có sự hỗ trợ cấp độ MeMe</div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-blue-500 rounded-2xl p-10 text-center"
            >
              <div className="text-3xl font-bold mb-2">70.000+</div>
              <div className="text-sm">Đơn vị thành công sử nghiệp</div>
              <div className="text-xs opacity-80">tin dùng sản phẩm MeMe</div>
            </motion.div>

            {/* Card 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-blue-500 rounded-2xl p-10 text-center"
            >
              <div className="text-3xl font-bold mb-2">250.000+</div>
              <div className="text-sm">Doanh nghiệp</div>
              <div className="text-xs opacity-80">tin dùng sản phẩm MeMe</div>
            </motion.div>

            {/* Card 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-blue-500 rounded-2xl p-10 text-center"
            >
              <div className="text-3xl font-bold mb-2">500.000+</div>
              <div className="text-sm">Hộ gia đình & cá nhân</div>
              <div className="text-xs opacity-80">tin dùng sản phẩm MeMe</div>
            </motion.div>

            {/* Card 6 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="bg-blue-500 rounded-2xl p-10 text-center"
            >
              <div className="text-3xl font-bold mb-2">+3.000</div>
              <div className="text-sm">Nhân sự</div>
              <div className="text-xs opacity-80">
                sẵn lực cải tiến sản phẩm
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="relative py-20 bg-[linear-gradient(to_bottom,white_0%,white_50%,#3b82f6_50%,#3b82f6_100%)] overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
            {/* Left - Phone Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative">
                <img
                  src="https://sothuchi.misa.vn/sites/sothuchi/images/home-v2/img-banner-question-vi.webp"
                  alt="Liên hệ Sổ thu chi MISA"
                  width={400}
                  height={400}
                  className="rounded-3xl shadow-2xl"
                />
              </div>
            </motion.div>

            {/* Right - Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:pt-8  mt-32"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Bạn có câu hỏi?
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Bạn có câu hỏi cần giải đáp? Liên hệ và tham gia ngay cộng đồng
                của chúng tôi
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-16">
                <button className="bg-[#1877f2] hover:bg-[#166fe5] text-white font-semibold py-3 px-6 rounded-full flex items-center justify-center transition-colors shadow-lg">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Fanpage
                </button>
                <button className="bg-[#1877f2] hover:bg-[#166fe5] text-white font-semibold py-3 px-6 rounded-full flex items-center justify-center transition-colors shadow-lg">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Group Facebook số thủ chi MeMe
                </button>
              </div>
              <div className=" rounded-3xl p-8 text-white mt-8 ">
                <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white-900">
                  Tải ứng dụng Sổ thu chi MeMe
                </h3>
                <p className="mb-6 text-white-600 text-lg">
                  Giải pháp quản lý tài chính thông minh của bạn.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mr-10  ">
                  <a
                    href="https://apps.apple.com/vn/app/sổ-thu-chi-misa/id123456789" // thay link thật nếu có
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center text-white px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 "
                  >
                    <img
                      src="https://sothuchi.misa.vn/sites/sothuchi/images/home-v2/app-store.png"
                      alt="Tải trên App Store"
                      className="h-12 md:h-14 w-auto"
                    />
                  </a>

                  {/* Nút Google Play */}
                  <a
                    href="https://play.google.com/store/apps/details?id=com.misa.sothuchi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center text-white px-1 py-4 rounded-2xl transition-all duration-300 hover:scale-105 "
                  >
                    <img
                      src="https://sothuchi.misa.vn/sites/sothuchi/images/home-v2/google-play.png"
                      alt="Tải trên Google Play"
                      className="h-12 md:h-14 w-auto" // cùng chiều cao với nút App Store
                    />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
