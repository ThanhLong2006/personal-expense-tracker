import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Check,
  X,
  Star,
  ArrowRight,
  Zap,
  Crown,
  Building2,
  Gift,
  HelpCircle,
  CreditCard,
  Shield,
  HeadphonesIcon,
  Sparkles,
  TrendingUp,
  Users,
  FileText,
  Brain,
  Lock,
  Cloud,
  Image as ImageIcon,
  Download,
  Upload,
  Bell,
  Settings,
  Globe,
} from "lucide-react";

/**
 * Component PricingPage chính
 */
const PricingPage = () => {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  // Pricing plans
  const plans = [
    {
      id: "free",
      name: "Free",
      icon: Gift,
      price: { monthly: 0, yearly: 0 },
      description: "Hoàn toàn miễn phí, phù hợp cho người dùng cá nhân",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-600",
      buttonColor: "bg-blue-500 hover:bg-blue-600",
      popular: false,
      features: [
        { name: "Quản lý giao dịch không giới hạn", included: true },
        { name: "Thống kê cơ bản", included: true },
        { name: "Biểu đồ tròn, cột", included: true },
        { name: "Import/Export Excel", included: true },
        { name: "Quản lý danh mục", included: true },
        { name: "Tìm kiếm và lọc", included: true },
        { name: "Responsive design", included: true },
        { name: "Bảo mật cơ bản", included: true },
        { name: "OCR hóa đơn", included: false },
        { name: "AI Dự đoán", included: false },
        { name: "Báo cáo PDF", included: false },
        { name: "2FA TOTP", included: false },
        { name: "Hỗ trợ ưu tiên", included: false },
        { name: "API access", included: false },
      ],
    },
    {
      id: "premium",
      name: "Premium",
      icon: Crown,
      price: { monthly: 99000, yearly: 990000 },
      description: "Tất cả tính năng Free + AI, OCR, và nhiều hơn nữa",
      color: "from-primary to-primary-dark",
      bgColor: "bg-primary/10",
      textColor: "text-primary",
      buttonColor: "bg-primary hover:bg-primary-dark",
      popular: true,
      badge: "Phổ biến nhất",
      features: [
        { name: "Tất cả tính năng Free", included: true },
        { name: "OCR nhận diện hóa đơn", included: true },
        { name: "AI Dự đoán chi tiêu", included: true },
        { name: "Báo cáo PDF đẹp", included: true },
        { name: "2FA TOTP", included: true },
        { name: "Gợi ý tiết kiệm AI", included: true },
        { name: "Heatmap chi tiêu", included: true },
        { name: "Ngân sách & Cảnh báo", included: true },
        { name: "Thông báo thông minh", included: true },
        { name: "Export PDF nâng cao", included: true },
        { name: "Hỗ trợ email", included: true },
        { name: "Hỗ trợ ưu tiên", included: false },
        { name: "API access", included: false },
        { name: "Tùy chỉnh branding", included: false },
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      icon: Building2,
      price: { monthly: 499000, yearly: 4990000 },
      description: "Giải pháp hoàn chỉnh cho doanh nghiệp và tổ chức",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-600",
      buttonColor: "bg-purple-500 hover:bg-purple-600",
      popular: false,
      features: [
        { name: "Tất cả tính năng Premium", included: true },
        { name: "Hỗ trợ 24/7 ưu tiên", included: true },
        { name: "API access đầy đủ", included: true },
        { name: "Tùy chỉnh branding", included: true },
        { name: "Quản lý nhiều tài khoản", included: true },
        { name: "Báo cáo nâng cao", included: true },
        { name: "Tích hợp hệ thống", included: true },
        { name: "SLA đảm bảo", included: true },
        { name: "Training & Onboarding", included: true },
        { name: "Dedicated account manager", included: true },
        { name: "Custom integrations", included: true },
        { name: "Advanced analytics", included: true },
        { name: "White-label solution", included: true },
        { name: "Priority feature requests", included: true },
      ],
    },
  ];

  // FAQ
  const faqs = [
    {
      question: "Có thể dùng thử Premium không?",
      answer:
        "Có, bạn có thể dùng thử Premium miễn phí trong 14 ngày. Không cần thẻ tín dụng.",
    },
    {
      question: "Có thể hủy gói bất cứ lúc nào?",
      answer:
        "Có, bạn có thể hủy gói Premium hoặc Enterprise bất cứ lúc nào. Không có phí hủy.",
    },
    {
      question: "Thanh toán như thế nào?",
      answer:
        "Chúng tôi chấp nhận thanh toán qua thẻ tín dụng, chuyển khoản ngân hàng, và ví điện tử.",
    },
    {
      question: "Có giảm giá cho thanh toán năm không?",
      answer:
        "Có, thanh toán năm được giảm 17% so với thanh toán tháng (tương đương 2 tháng miễn phí).",
    },
    {
      question: "Dữ liệu có được bảo mật không?",
      answer:
        "Có, tất cả dữ liệu được mã hóa và lưu trữ an toàn. Chúng tôi tuân thủ các tiêu chuẩn bảo mật quốc tế.",
    },
    {
      question: "Có thể nâng cấp hoặc hạ cấp gói không?",
      answer:
        "Có, bạn có thể nâng cấp hoặc hạ cấp gói bất cứ lúc nào. Sự khác biệt sẽ được tính toán tự động.",
    },
  ];

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount === 0) return "Miễn phí";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate yearly savings
  const calculateYearlySavings = (monthlyPrice: number) => {
    const yearlyPrice = monthlyPrice * 12;
    const discountedYearly = Math.round(monthlyPrice * 10);
    return yearlyPrice - discountedYearly;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Bảng Giá Đơn Giản & Minh Bạch
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Chọn gói phù hợp với nhu cầu của bạn. Bắt đầu miễn phí, nâng cấp
              bất cứ lúc nào.
            </p>

            {/* Billing period toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span
                className={
                  billingPeriod === "monthly" ? "font-bold" : "opacity-70"
                }
              >
                Hàng tháng
              </span>
              <label className="swap swap-flip">
                <input
                  type="checkbox"
                  checked={billingPeriod === "yearly"}
                  onChange={(e) =>
                    setBillingPeriod(e.target.checked ? "yearly" : "monthly")
                  }
                />
                <div className="swap-on">🎉</div>
                <div className="swap-off">💰</div>
              </label>
              <span
                className={
                  billingPeriod === "yearly" ? "font-bold" : "opacity-70"
                }
              >
                Hàng năm
                {billingPeriod === "yearly" && (
                  <span className="ml-2 px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded">
                    Tiết kiệm 17%
                  </span>
                )}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-base-200 -mt-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              const price = plan.price[billingPeriod];
              const displayPrice =
                billingPeriod === "yearly" && price > 0
                  ? Math.round(price / 12)
                  : price;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredPlan(plan.id)}
                  onMouseLeave={() => setHoveredPlan(null)}
                  className={`relative card bg-base-100 shadow-xl ${
                    plan.popular ? "ring-4 ring-primary scale-105" : ""
                  } transition-all`}
                >
                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="px-4 py-1 bg-primary text-white text-sm font-bold rounded-full shadow-lg">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div className="card-body p-8">
                    {/* Icon & Name */}
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`w-16 h-16 ${plan.bgColor} rounded-2xl flex items-center justify-center`}
                      >
                        <Icon className={`w-8 h-8 ${plan.textColor}`} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{plan.name}</h3>
                        <p className="text-sm text-base-content/70">
                          {plan.description}
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold">
                          {formatCurrency(displayPrice)}
                        </span>
                        {price > 0 && (
                          <span className="text-base-content/70">
                            /{billingPeriod === "monthly" ? "tháng" : "năm"}
                          </span>
                        )}
                      </div>
                      {billingPeriod === "yearly" && price > 0 && (
                        <p className="text-sm text-green-600 mt-1">
                          Tiết kiệm{" "}
                          {formatCurrency(
                            calculateYearlySavings(plan.price.monthly)
                          )}
                          /năm
                        </p>
                      )}
                    </div>

                    {/* CTA Button */}
                    <Link
                      to={
                        plan.id === "free"
                          ? "/register"
                          : "/register?plan=" + plan.id
                      }
                      className={`btn w-full ${plan.buttonColor} text-white mb-6`}
                    >
                      {plan.id === "free" ? "Bắt đầu miễn phí" : "Đăng ký ngay"}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>

                    {/* Features */}
                    <div className="space-y-3">
                      <div className="font-semibold mb-4">
                        Tính năng bao gồm:
                      </div>
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          {feature.included ? (
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <X className="w-5 h-5 text-base-content/30 flex-shrink-0 mt-0.5" />
                          )}
                          <span
                            className={
                              feature.included
                                ? "text-base-content"
                                : "text-base-content/50 line-through"
                            }
                          >
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">So sánh chi tiết</h2>
            <p className="text-xl text-base-content/70">
              Xem sự khác biệt giữa các gói
            </p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Tính năng</th>
                  <th className="text-center">Free</th>
                  <th className="text-center">Premium</th>
                  <th className="text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Giao dịch không giới hạn</td>
                  <td className="text-center">
                    <Check className="w-6 h-6 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center">
                    <Check className="w-6 h-6 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center">
                    <Check className="w-6 h-6 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td>OCR hóa đơn</td>
                  <td className="text-center">
                    <X className="w-6 h-6 text-red-500 mx-auto" />
                  </td>
                  <td className="text-center">
                    <Check className="w-6 h-6 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center">
                    <Check className="w-6 h-6 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td>AI Dự đoán</td>
                  <td className="text-center">
                    <X className="w-6 h-6 text-red-500 mx-auto" />
                  </td>
                  <td className="text-center">
                    <Check className="w-6 h-6 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center">
                    <Check className="w-6 h-6 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td>Báo cáo PDF</td>
                  <td className="text-center">
                    <X className="w-6 h-6 text-red-500 mx-auto" />
                  </td>
                  <td className="text-center">
                    <Check className="w-6 h-6 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center">
                    <Check className="w-6 h-6 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td>2FA TOTP</td>
                  <td className="text-center">
                    <X className="w-6 h-6 text-red-500 mx-auto" />
                  </td>
                  <td className="text-center">
                    <Check className="w-6 h-6 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center">
                    <Check className="w-6 h-6 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td>Hỗ trợ ưu tiên</td>
                  <td className="text-center">
                    <X className="w-6 h-6 text-red-500 mx-auto" />
                  </td>
                  <td className="text-center">
                    <X className="w-6 h-6 text-red-500 mx-auto" />
                  </td>
                  <td className="text-center">
                    <Check className="w-6 h-6 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td>API access</td>
                  <td className="text-center">
                    <X className="w-6 h-6 text-red-500 mx-auto" />
                  </td>
                  <td className="text-center">
                    <X className="w-6 h-6 text-red-500 mx-auto" />
                  </td>
                  <td className="text-center">
                    <Check className="w-6 h-6 text-green-500 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Câu hỏi thường gặp</h2>
            <p className="text-xl text-base-content/70">
              Tìm câu trả lời cho các câu hỏi về giá
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card bg-base-100 shadow-lg"
              >
                <div className="card-body">
                  <h3 className="card-title flex items-start gap-3">
                    <HelpCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    {faq.question}
                  </h3>
                  <p className="text-base-content/70 mt-2">{faq.answer}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Sẵn sàng bắt đầu?</h2>
          <p className="text-xl mb-8 opacity-90">
            Đăng ký miễn phí ngay hôm nay, không cần thẻ tín dụng
          </p>
          <Link
            to="/register"
            className="btn btn-lg bg-white text-primary hover:bg-base-200"
          >
            Bắt đầu miễn phí
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
