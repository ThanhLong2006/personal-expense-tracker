import { motion } from "framer-motion";
import {
  Shield,
  Database,
  Lock,
  Eye,
  UserCheck,
  FileText,
  Calendar,
  Mail,
  Phone,
  Server,
  Key,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const sections = [
  {
    id: "collection",
    icon: Database,
    title: "1. Information We Collect",
    titleVi: "1. Dữ liệu Thu thập",
    items: [
      {
        en: "Account Information: Email address, full name, phone number, profile photo (optional).",
        vi: "Thông tin tài khoản: Địa chỉ email, họ tên đầy đủ, số điện thoại, ảnh hồ sơ (tùy chọn).",
      },
      {
        en: "Transaction Data: Amount, category, notes, receipt images, date and time of transactions.",
        vi: "Dữ liệu giao dịch: Số tiền, danh mục, ghi chú, ảnh hóa đơn, ngày giờ giao dịch.",
      },
      {
        en: "Device Information: IP address, browser type, device type, operating system, and app version.",
        vi: "Thông tin thiết bị: Địa chỉ IP, loại trình duyệt, loại thiết bị, hệ điều hành và phiên bản phần mềm.",
      },
      {
        en: "Usage Data: System logs, feature usage patterns, and error reports to detect intrusions and improve service quality.",
        vi: "Dữ liệu sử dụng: Nhật ký hệ thống, mô hình sử dụng tính năng và báo cáo lỗi nhằm phát hiện xâm nhập và cải thiện chất lượng dịch vụ.",
      },
      {
        en: "Location Data: With your explicit consent, we may collect location data to provide location-based features.",
        vi: "Dữ liệu vị trí: Với sự đồng ý rõ ràng của bạn, chúng tôi có thể thu thập dữ liệu vị trí để cung cấp các tính năng dựa trên vị trí.",
      },
    ],
  },
  {
    id: "usage",
    icon: Eye,
    title: "2. How We Use Your Information",
    titleVi: "2. Mục đích Sử dụng",
    items: [
      {
        en: "To provide and maintain our expense management services, including processing your transactions and generating financial reports.",
        vi: "Cung cấp và duy trì dịch vụ quản lý chi tiêu của chúng tôi, bao gồm xử lý giao dịch và tạo báo cáo chi tiêu.",
      },
      {
        en: "To improve and optimize our services through analysis of anonymized usage patterns and AI algorithm enhancement.",
        vi: "Cải thiện và tối ưu hóa dịch vụ của chúng tôi thông qua phân tích mô hình sử dụng ẩn danh và cải tiến thuật toán AI.",
      },
      {
        en: "To send you important notifications about security updates, new features, and service changes.",
        vi: "Gửi cho bạn các thông báo quan trọng về cập nhật bảo mật, tính năng mới và thay đổi dịch vụ.",
      },
      {
        en: "To detect, prevent, and address technical issues, fraud, and security vulnerabilities.",
        vi: "Phát hiện, ngăn chặn và xử lý các vấn đề kỹ thuật, gian lận và lỗ hổng bảo mật.",
      },
      {
        en: "To comply with legal obligations and respond to lawful requests from authorities.",
        vi: "Tuân thủ các nghĩa vụ pháp lý và phản hồi các yêu cầu hợp pháp từ các cơ quan có thẩm quyền.",
      },
      {
        en: "To personalize your experience and provide tailored financial insights based on your spending patterns.",
        vi: "Cá nhân hóa trải nghiệm của bạn và cung cấp thông tin chi tiêu phù hợp dựa trên mô hình chi tiêu của bạn.",
      },
    ],
  },
  {
    id: "protection",
    icon: Lock,
    title: "3. Data Protection & Security",
    titleVi: "3. Bảo vệ Dữ liệu",
    items: [
      {
        en: "End-to-End Encryption: All data is encrypted both in transit (HTTPS/TLS 1.3) and at rest using AES-256 encryption standard.",
        vi: "Mã hóa đầu cuối: Tất cả dữ liệu được mã hóa cả khi truyền tải (HTTPS/TLS 1.3) và khi lưu trữ bằng tiêu chuẩn mã hóa AES-256.",
      },
      {
        en: "Automatic Backup: Data is automatically backed up every 6 hours. Administrators can create and download manual backups as needed.",
        vi: "Sao lưu tự động: Dữ liệu được sao lưu tự động mỗi 6 giờ. Quản trị viên có thể tạo và tải xuống bản sao lưu thủ công khi cần.",
      },
      {
        en: "Access Control: Internal access is strictly limited through detailed role-based permissions and comprehensive activity logging.",
        vi: "Kiểm soát truy cập: Quyền truy cập nội bộ được giới hạn nghiêm ngặt thông qua phân quyền chi tiết dựa trên vai trò và ghi nhật ký hoạt động toàn diện.",
      },
      {
        en: "Two-Factor Authentication: We strongly recommend enabling 2FA for production environments to add an extra layer of security.",
        vi: "Xác thực hai yếu tố: Chúng tôi đặc biệt khuyến nghị bật 2FA cho môi trường production để thêm một lớp bảo mật bổ sung.",
      },
      {
        en: "Regular Security Audits: Our systems undergo regular security assessments and penetration testing by third-party experts.",
        vi: "Kiểm tra bảo mật định kỳ: Hệ thống của chúng tôi trải qua các đánh giá bảo mật định kỳ và kiểm tra xâm nhập bởi các chuyên gia bên thứ ba.",
      },
      {
        en: "Data Isolation: Each user's data is logically isolated and cannot be accessed by other users or unauthorized personnel.",
        vi: "Cách ly dữ liệu: Dữ liệu của mỗi người dùng được cách ly logic và không thể được truy cập bởi người dùng khác hoặc nhân viên không được phép.",
      },
    ],
  },
  {
    id: "rights",
    icon: UserCheck,
    title: "4. Your Rights & Controls",
    titleVi: "4. Quyền của Người dùng",
    items: [
      {
        en: "Right to Access: You can access, view, and download your personal data at any time through the Settings section.",
        vi: "Quyền truy cập: Bạn có thể truy cập, xem và tải xuống dữ liệu cá nhân của mình bất kỳ lúc nào thông qua phần Cài đặt.",
      },
      {
        en: "Right to Rectification: You can edit or correct your personal information directly in your account settings.",
        vi: "Quyền chỉnh sửa: Bạn có thể chỉnh sửa hoặc sửa đổi thông tin cá nhân của mình trực tiếp trong cài đặt tài khoản.",
      },
      {
        en: "Right to Erasure: You can request deletion of your account and all associated data. This action is irreversible.",
        vi: "Quyền xóa: Bạn có thể yêu cầu xóa tài khoản và tất cả dữ liệu liên quan. Hành động này không thể hoàn tác.",
      },
      {
        en: "Right to Data Portability: You can export all your data in JSON or Excel format for use in other services.",
        vi: "Quyền di chuyển dữ liệu: Bạn có thể xuất tất cả dữ liệu của mình dưới dạng JSON hoặc Excel để sử dụng trong các dịch vụ khác.",
      },
      {
        en: "Right to Withdraw Consent: You can withdraw your consent for data processing at any time, subject to legal obligations.",
        vi: "Quyền rút lại sự đồng ý: Bạn có thể rút lại sự đồng ý của mình đối với việc xử lý dữ liệu bất kỳ lúc nào, tuân theo các nghĩa vụ pháp lý.",
      },
      {
        en: "Testing Environment: OTP verification can be disabled in test environments. 2FA must be enabled in production environments.",
        vi: "Môi trường kiểm thử: Xác minh OTP có thể bị vô hiệu hóa trong môi trường test. 2FA phải được bật trong môi trường production.",
      },
    ],
  },
  {
    id: "sharing",
    icon: Server,
    title: "5. Data Sharing & Disclosure",
    titleVi: "5. Chia sẻ Dữ liệu",
    items: [
      {
        en: "We do not sell your personal information to third parties under any circumstances.",
        vi: "Chúng tôi không bán thông tin cá nhân của bạn cho bên thứ ba trong bất kỳ trường hợp nào.",
      },
      {
        en: "We may share data with trusted service providers (e.g., cloud hosting, email services) who assist in operating our services, bound by strict confidentiality agreements.",
        vi: "Chúng tôi có thể chia sẻ dữ liệu với các nhà cung cấp dịch vụ đáng tin cậy (ví dụ: lưu trữ đám mây, dịch vụ email) hỗ trợ vận hành dịch vụ của chúng tôi, bị ràng buộc bởi các thỏa thuận bảo mật nghiêm ngặt.",
      },
      {
        en: "We may disclose information when required by law or to protect our rights, safety, or property.",
        vi: "Chúng tôi có thể tiết lộ thông tin khi được yêu cầu bởi pháp luật hoặc để bảo vệ quyền lợi, sự an toàn hoặc tài sản của chúng tôi.",
      },
      {
        en: "In the event of a merger, acquisition, or sale of assets, your data may be transferred to the new entity, subject to this Privacy Policy.",
        vi: "Trong trường hợp sáp nhập, mua lại hoặc bán tài sản, dữ liệu của bạn có thể được chuyển giao cho thực thể mới, tuân theo Chính sách Bảo mật này.",
      },
    ],
  },
  {
    id: "retention",
    icon: Calendar,
    title: "6. Data Retention",
    titleVi: "6. Lưu trữ Dữ liệu",
    items: [
      {
        en: "We retain your personal data only for as long as necessary to provide our services and comply with legal obligations.",
        vi: "Chúng tôi chỉ lưu giữ dữ liệu cá nhân của bạn trong thời gian cần thiết để cung cấp dịch vụ và tuân thủ các nghĩa vụ pháp lý.",
      },
      {
        en: "Transaction data is retained for a minimum of 7 years to comply with financial regulations and tax requirements.",
        vi: "Dữ liệu giao dịch được lưu giữ tối thiểu 7 năm để tuân thủ các quy định chi tiêu và yêu cầu về thuế.",
      },
      {
        en: "Deleted data is permanently removed from our active systems within 30 days, and from backups within 90 days.",
        vi: "Dữ liệu đã xóa được loại bỏ vĩnh viễn khỏi hệ thống hoạt động của chúng tôi trong vòng 30 ngày và khỏi các bản sao lưu trong vòng 90 ngày.",
      },
      {
        en: "Anonymized data used for analytics may be retained indefinitely as it cannot be linked back to individual users.",
        vi: "Dữ liệu ẩn danh được sử dụng cho phân tích có thể được lưu giữ vô thời hạn vì nó không thể được liên kết trở lại với người dùng cá nhân.",
      },
    ],
  },
  {
    id: "cookies",
    icon: Key,
    title: "7. Cookies & Tracking",
    titleVi: "7. Cookies & Theo dõi",
    items: [
      {
        en: "We use essential cookies to maintain your session and ensure the security of your account.",
        vi: "Chúng tôi sử dụng cookies cần thiết để duy trì phiên của bạn và đảm bảo bảo mật tài khoản của bạn.",
      },
      {
        en: "Analytics cookies help us understand how users interact with our service to improve user experience.",
        vi: "Cookies phân tích giúp chúng tôi hiểu cách người dùng tương tác với dịch vụ của chúng tôi để cải thiện trải nghiệm người dùng.",
      },
      {
        en: "You can control cookie preferences through your browser settings. Note that disabling essential cookies may limit functionality.",
        vi: "Bạn có thể kiểm soát tùy chọn cookie thông qua cài đặt trình duyệt của mình. Lưu ý rằng việc vô hiệu hóa cookies cần thiết có thể hạn chế chức năng.",
      },
      {
        en: "We do not use third-party advertising cookies or sell your browsing data to advertisers.",
        vi: "Chúng tôi không sử dụng cookies quảng cáo của bên thứ ba hoặc bán dữ liệu duyệt web của bạn cho các nhà quảng cáo.",
      },
    ],
  },
  {
    id: "updates",
    icon: AlertCircle,
    title: "8. Policy Updates",
    titleVi: "8. Cập nhật Chính sách",
    items: [
      {
        en: "We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements.",
        vi: "Chúng tôi có thể cập nhật Chính sách Bảo mật này theo thời gian để phản ánh các thay đổi trong thực tiễn hoặc yêu cầu pháp lý của chúng tôi.",
      },
      {
        en: "Material changes will be notified through in-app notifications and email at least 30 days before taking effect.",
        vi: "Các thay đổi quan trọng sẽ được thông báo thông qua thông báo trong phần mềm và email ít nhất 30 ngày trước khi có hiệu lực.",
      },
      {
        en: "Your continued use of our services after policy updates constitutes acceptance of the revised policy.",
        vi: "Việc bạn tiếp tục sử dụng dịch vụ của chúng tôi sau khi cập nhật chính sách tạo thành sự chấp nhận chính sách đã sửa đổi.",
      },
      {
        en: "The 'Last Updated' date at the top of this page indicates when the policy was last revised.",
        vi: "Ngày 'Cập nhật lần cuối' ở đầu trang này cho biết khi nào chính sách được sửa đổi lần cuối.",
      },
    ],
  },
];

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      {/* HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0066FF] via-[#0088FF] to-[#00D4FF] text-white py-32">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

        {/* Decorative circles */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-300/10 rounded-full blur-3xl"></div>

        {/* Floating shapes */}
        <motion.div
          className="absolute top-20 left-20 w-20 h-20 border-2 border-white/20 rounded-lg"
          animate={{ rotate: 360, y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-20 right-32 w-16 h-16 border-2 border-white/20 rounded-full"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 15, repeat: Infinity }}
        />

        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-8"
            >
              <Shield className="w-10 h-10" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl font-light text-cyan-100 mb-8">
              Chính sách Bảo mật
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Calendar className="w-4 h-4" />
                <span>Last Updated: January 1, 2025</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <FileText className="w-4 h-4" />
                <span>Version 2.0</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TABLE OF CONTENTS */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="text-2xl font-bold mb-6 text-slate-900">
            Table of Contents
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {sections.map((section, index) => (
              <motion.a
                key={section.id}
                href={`#${section.id}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-4 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-cyan-100 transition-colors">
                  <section.icon className="w-5 h-5 text-slate-600 group-hover:text-cyan-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900 group-hover:text-cyan-600 transition-colors">
                    {section.title}
                  </div>
                  <div className="text-sm text-slate-500">
                    {section.titleVi}
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="space-y-16">
            {sections.map((section, index) => (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="scroll-mt-20"
              >
                {/* Section Header */}
                <div className="flex items-start gap-6 mb-8">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <section.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-black text-slate-900 mb-2">
                      {section.title}
                    </h2>
                    <p className="text-xl font-semibold text-slate-600">
                      {section.titleVi}
                    </p>
                  </div>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 lg:p-10">
                  <div className="space-y-6">
                    {section.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="pb-6 border-b border-slate-100 last:border-0 last:pb-0"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <CheckCircle className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                          <p className="text-slate-700 leading-relaxed flex-1">
                            {item.en}
                          </p>
                        </div>
                        <div className="ml-8">
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg mb-2">
                            <span className="text-xs font-semibold text-slate-600">
                              🇻🇳 Tiếng Việt
                            </span>
                          </div>
                          <p className="text-slate-600 leading-relaxed">
                            {item.vi}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.section>
            ))}
          </div>

          {/* FOOTER NOTICE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-20 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-10 border border-cyan-200"
          >
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Your Privacy Matters / Quyền riêng tư của bạn rất quan trọng
                </h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  We are committed to protecting your privacy and maintaining
                  the security of your personal information. This Privacy Policy
                  explains how we collect, use, and safeguard your data. If you
                  have any questions or concerns, please contact our privacy
                  team at privacy@meme.app.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Chúng tôi cam kết bảo vệ quyền riêng tư và duy trì bảo mật
                  thông tin cá nhân của bạn. Chính sách Bảo mật này giải thích
                  cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu của bạn.
                  Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào, vui lòng liên hệ
                  với đội ngũ bảo mật của chúng tôi tại privacy@meme.app.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* CTA SECTION */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-black mb-6">
              Questions About Your Privacy?
            </h2>
            <p className="text-xl text-slate-300 mb-10">
              Có câu hỏi về Quyền riêng tư của bạn?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:privacy@meme.app"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors"
              >
                <Mail className="w-5 h-5" />
                Contact Privacy Team
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-700 text-white font-bold rounded-xl hover:bg-slate-600 transition-colors"
              >
                <Phone className="w-5 h-5" />
                Contact Support
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPage;
