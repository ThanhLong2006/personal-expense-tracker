import { motion } from "framer-motion";
import {
  Scale,
  Shield,
  FileText,
  AlertCircle,
  CheckCircle,
  Mail,
  Calendar,
  User,
  Lock,
  Database,
  Ban,
  UserX,
  RefreshCw,
  Phone,
} from "lucide-react";

const sections = [
  {
    id: "acceptance",
    icon: CheckCircle,
    title: "1. Acceptance of Terms",
    titleVi: "1. Chấp nhận Điều khoản",
    content: [
      "By accessing and using MeMe's services (the 'Service'), you accept and agree to be bound by the terms and provision of this agreement.",
      "These Terms of Service ('Terms') apply to all users of the Service, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.",
      "If you do not agree to all the terms and conditions of this agreement, then you may not access the Service or use any services. If these Terms are considered an offer, acceptance is expressly limited to these Terms.",
    ],
    contentVi: [
      "Bằng việc truy cập và sử dụng các dịch vụ của MeMe ('Dịch vụ'), bạn chấp nhận và đồng ý bị ràng buộc bởi các điều khoản và điều kiện của thỏa thuận này.",
      "Các Điều khoản Dịch vụ này ('Điều khoản') áp dụng cho tất cả người dùng của Dịch vụ, bao gồm nhưng không giới hạn người dùng là người duyệt web, nhà cung cấp, khách hàng, thương nhân và/hoặc những người đóng góp nội dung.",
      "Nếu bạn không đồng ý với tất cả các điều khoản và điều kiện của thỏa thuận này, thì bạn không được phép truy cập Dịch vụ hoặc sử dụng bất kỳ dịch vụ nào. Nếu các Điều khoản này được coi là một đề nghị, việc chấp nhận bị giới hạn rõ ràng trong các Điều khoản này.",
    ],
  },
  {
    id: "account",
    icon: User,
    title: "2. Account Terms",
    titleVi: "2. Điều khoản Tài khoản",
    content: [
      "You must provide accurate and complete information when creating your account.",
      "You are responsible for maintaining the security of your account and password. MeMe cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.",
      "You are responsible for all content posted and activity that occurs under your account.",
      "You must immediately notify MeMe of any unauthorized uses of your account or any other breaches of security.",
      "We strongly recommend enabling Two-Factor Authentication (2FA) to enhance your account security.",
    ],
    contentVi: [
      "Bạn phải cung cấp thông tin chính xác và đầy đủ khi tạo tài khoản của mình.",
      "Bạn chịu trách nhiệm duy trì bảo mật tài khoản và mật khẩu của mình. MeMe không thể và sẽ không chịu trách nhiệm cho bất kỳ mất mát hoặc thiệt hại nào từ việc bạn không tuân thủ nghĩa vụ bảo mật này.",
      "Bạn chịu trách nhiệm cho tất cả nội dung được đăng và hoạt động xảy ra dưới tài khoản của bạn.",
      "Bạn phải thông báo ngay cho MeMe về bất kỳ việc sử dụng trái phép nào đối với tài khoản của bạn hoặc bất kỳ vi phạm bảo mật nào khác.",
      "Chúng tôi đặc biệt khuyến nghị bật Xác thực Hai yếu tố (2FA) để tăng cường bảo mật tài khoản của bạn.",
    ],
  },
  {
    id: "privacy",
    icon: Shield,
    title: "3. Privacy and Data Collection",
    titleVi: "3. Quyền riêng tư và Thu thập Dữ liệu",
    content: [
      "Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information.",
      "By using the Service, you agree to the collection and use of information in accordance with our Privacy Policy.",
      "We collect the following types of information:",
      "• Account information (name, email, phone number)",
      "• Financial transaction data",
      "• Device and usage information",
      "• Location data (with your consent)",
      "Your data is encrypted using industry-standard AES-256 encryption and stored securely on our servers located in Vietnam.",
      "We do not sell, trade, or transfer your personally identifiable information to third parties without your consent, except as required by law.",
    ],
    contentVi: [
      "Quyền riêng tư của bạn rất quan trọng đối với chúng tôi. Chính sách Bảo mật của chúng tôi giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.",
      "Bằng việc sử dụng Dịch vụ, bạn đồng ý với việc thu thập và sử dụng thông tin theo Chính sách Bảo mật của chúng tôi.",
      "Chúng tôi thu thập các loại thông tin sau:",
      "• Thông tin tài khoản (tên, email, số điện thoại)",
      "• Dữ liệu giao dịch tài chính",
      "• Thông tin thiết bị và sử dụng",
      "• Dữ liệu vị trí (với sự đồng ý của bạn)",
      "Dữ liệu của bạn được mã hóa bằng mã hóa AES-256 tiêu chuẩn ngành và được lưu trữ an toàn trên máy chủ của chúng tôi đặt tại Việt Nam.",
      "Chúng tôi không bán, trao đổi hoặc chuyển giao thông tin nhận dạng cá nhân của bạn cho bên thứ ba mà không có sự đồng ý của bạn, trừ khi được yêu cầu bởi pháp luật.",
    ],
  },
  {
    id: "prohibited",
    icon: Ban,
    title: "4. Prohibited Uses",
    titleVi: "4. Các Hành vi Bị cấm",
    content: [
      "You agree not to use the Service:",
      "• For any unlawful purpose or to solicit others to perform or participate in any unlawful acts",
      "• To violate any international, federal, provincial or state regulations, rules, laws, or local ordinances",
      "• To infringe upon or violate our intellectual property rights or the intellectual property rights of others",
      "• To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate",
      "• To submit false or misleading information",
      "• To upload or transmit viruses or any other type of malicious code",
      "• To collect or track the personal information of others",
      "• To engage in any automated use of the system",
      "• To interfere with, disrupt, or create an undue burden on the Service or the networks or services connected to the Service",
      "Violation of these prohibitions may result in immediate termination of your account and potential legal action.",
    ],
    contentVi: [
      "Bạn đồng ý không sử dụng Dịch vụ:",
      "• Cho bất kỳ mục đích bất hợp pháp nào hoặc để thúc giục người khác thực hiện hoặc tham gia vào bất kỳ hành vi bất hợp pháp nào",
      "• Vi phạm bất kỳ quy định, quy tắc, luật quốc tế, liên bang, tỉnh, bang hoặc điều lệ địa phương nào",
      "• Xâm phạm hoặc vi phạm quyền sở hữu trí tuệ của chúng tôi hoặc quyền sở hữu trí tuệ của người khác",
      "• Quấy rối, lạm dụng, xúc phạm, gây hại, phỉ báng, vu khống, chê bai, đe dọa hoặc phân biệt đối xử",
      "• Gửi thông tin sai lệch hoặc gây hiểu lầm",
      "• Tải lên hoặc truyền virus hoặc bất kỳ loại mã độc hại nào khác",
      "• Thu thập hoặc theo dõi thông tin cá nhân của người khác",
      "• Tham gia vào bất kỳ việc sử dụng tự động nào của hệ thống",
      "• Can thiệp, gián đoạn hoặc tạo gánh nặng quá mức cho Dịch vụ hoặc mạng hoặc dịch vụ được kết nối với Dịch vụ",
      "Vi phạm các điều cấm này có thể dẫn đến chấm dứt tài khoản của bạn ngay lập tức và có thể có hành động pháp lý.",
    ],
  },
  {
    id: "limitation",
    icon: AlertCircle,
    title: "5. Limitation of Liability",
    titleVi: "5. Giới hạn Trách nhiệm",
    content: [
      "The Service is provided on an 'as is' and 'as available' basis. MeMe makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.",
      "In no case shall MeMe, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind, including, without limitation lost profits, lost revenue, lost savings, loss of data, replacement costs, or any similar damages.",
      "Some jurisdictions do not allow the exclusion of certain warranties or the limitation or exclusion of liability for incidental or consequential damages. Accordingly, some of the above limitations may not apply to you.",
    ],
    contentVi: [
      "Dịch vụ được cung cấp trên cơ sở 'nguyên trạng' và 'có sẵn'. MeMe không đưa ra bất kỳ bảo đảm nào, dù rõ ràng hay ngụ ý, và từ chối và phủ nhận tất cả các bảo đảm khác bao gồm, không giới hạn, các bảo đảm ngụ ý hoặc điều kiện về khả năng bán được, sự phù hợp cho một mục đích cụ thể, hoặc không vi phạm sở hữu trí tuệ hoặc vi phạm quyền khác.",
      "Trong mọi trường hợp, MeMe, các giám đốc, cán bộ, nhân viên, chi nhánh, đại lý, nhà thầu, thực tập sinh, nhà cung cấp, nhà cung cấp dịch vụ hoặc người được cấp phép của chúng tôi sẽ không chịu trách nhiệm cho bất kỳ thương tích, mất mát, yêu cầu bồi thường, hoặc bất kỳ thiệt hại trực tiếp, gián tiếp, ngẫu nhiên, trừng phạt, đặc biệt hoặc do hậu quả của bất kỳ loại nào, bao gồm, không giới hạn lợi nhuận bị mất, doanh thu bị mất, tiết kiệm bị mất, mất dữ liệu, chi phí thay thế, hoặc bất kỳ thiệt hại tương tự nào.",
      "Một số khu vực pháp lý không cho phép loại trừ một số bảo đảm nhất định hoặc giới hạn hoặc loại trừ trách nhiệm pháp lý đối với thiệt hại ngẫu nhiên hoặc do hậu quả. Theo đó, một số giới hạn trên có thể không áp dụng cho bạn.",
    ],
  },
  {
    id: "termination",
    icon: UserX,
    title: "6. Account Termination",
    titleVi: "6. Chấm dứt Tài khoản",
    content: [
      "We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.",
      "If you wish to terminate your account, you may simply discontinue using the Service or contact our support team.",
      "Upon termination, your right to use the Service will cease immediately. If you wish to delete your account data, you must submit a written request to our support team.",
      "All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.",
    ],
    contentVi: [
      "Chúng tôi có thể chấm dứt hoặc đình chỉ tài khoản của bạn và chặn quyền truy cập vào Dịch vụ ngay lập tức, mà không cần thông báo trước hoặc chịu trách nhiệm, theo quyết định riêng của chúng tôi, vì bất kỳ lý do gì và không giới hạn, bao gồm nhưng không giới hạn ở việc vi phạm Điều khoản.",
      "Nếu bạn muốn chấm dứt tài khoản của mình, bạn có thể đơn giản là ngừng sử dụng Dịch vụ hoặc liên hệ với đội ngũ hỗ trợ của chúng tôi.",
      "Sau khi chấm dứt, quyền sử dụng Dịch vụ của bạn sẽ chấm dứt ngay lập tức. Nếu bạn muốn xóa dữ liệu tài khoản của mình, bạn phải gửi yêu cầu bằng văn bản cho đội ngũ hỗ trợ của chúng tôi.",
      "Tất cả các điều khoản của Điều khoản mà theo bản chất của chúng nên tồn tại sau khi chấm dứt sẽ tồn tại sau khi chấm dứt, bao gồm, không giới hạn, các điều khoản về quyền sở hữu, từ chối bảo đảm, bồi thường và giới hạn trách nhiệm pháp lý.",
    ],
  },
  {
    id: "changes",
    icon: RefreshCw,
    title: "7. Changes to Terms",
    titleVi: "7. Thay đổi Điều khoản",
    content: [
      "We reserve the right, at our sole discretion, to modify or replace these Terms at any time.",
      "If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect through in-app notifications and email.",
      "What constitutes a material change will be determined at our sole discretion.",
      "By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Service.",
      "We recommend reviewing these Terms periodically for any changes.",
    ],
    contentVi: [
      "Chúng tôi có quyền, theo quyết định riêng của mình, sửa đổi hoặc thay thế các Điều khoản này bất cứ lúc nào.",
      "Nếu một sửa đổi là quan trọng, chúng tôi sẽ thông báo ít nhất 30 ngày trước khi bất kỳ điều khoản mới nào có hiệu lực thông qua thông báo trong ứng dụng và email.",
      "Những gì cấu thành một thay đổi quan trọng sẽ được xác định theo quyết định riêng của chúng tôi.",
      "Bằng việc tiếp tục truy cập hoặc sử dụng Dịch vụ của chúng tôi sau khi bất kỳ sửa đổi nào có hiệu lực, bạn đồng ý bị ràng buộc bởi các điều khoản được sửa đổi. Nếu bạn không đồng ý với các điều khoản mới, bạn không còn được phép sử dụng Dịch vụ.",
      "Chúng tôi khuyến nghị xem xét các Điều khoản này định kỳ để biết bất kỳ thay đổi nào.",
    ],
  },
  {
    id: "contact",
    icon: Phone,
    title: "8. Contact Information",
    titleVi: "8. Thông tin Liên hệ",
    content: [
      "If you have any questions about these Terms, please contact us:",
      "Email: legal@meme.app",
      "Support: support@meme.app",
      "Phone: +84 1800-888-999",
      "Address: 15th Floor, Viettel Complex Building, 285 Cach Mang Thang Tam Street, Ward 12, District 10, Ho Chi Minh City, Vietnam",
      "Business Hours: Monday - Sunday, 8:00 AM - 10:00 PM (GMT+7)",
    ],
    contentVi: [
      "Nếu bạn có bất kỳ câu hỏi nào về các Điều khoản này, vui lòng liên hệ với chúng tôi:",
      "Email: legal@meme.app",
      "Hỗ trợ: support@meme.app",
      "Điện thoại: +84 1800-888-999",
      "Địa chỉ: Tầng 15, Tòa nhà Viettel Complex, 285 Cách Mạng Tháng Tám, Phường 12, Quận 10, TP. Hồ Chí Minh, Việt Nam",
      "Giờ làm việc: Thứ Hai - Chủ Nhật, 8:00 SA - 10:00 CH (GMT+7)",
    ],
  },
];

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      {/* HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0066FF] via-[#0088FF] to-[#00D4FF] text-white py-32">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-transparent to-blue-400/20 animate-pulse"></div>

        {/* Decorative blur circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl animate-pulse"
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

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

        {/* Snowflakes effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 50 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 3 + 2}s`,
            animationDelay: `${Math.random() * 5}s`,
            fontSize: `${Math.random() * 10 + 10}px`,
            opacity: Math.random() * 0.6 + 0.3,
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

        {/* Decorative elements */}
        <motion.div
          className="absolute top-10 right-10 w-32 h-32 border-2 border-white/20 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-10 left-10 w-24 h-24 border-2 border-white/20 rounded-lg rotate-45"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 right-20 w-16 h-16 border-2 border-cyan-200/30 rounded-xl"
          animate={{
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/3 left-20"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 360],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          <Scale className="w-12 h-12 text-white/20" />
        </motion.div>
        <motion.div
          className="absolute top-40 left-1/4"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <Shield className="w-16 h-16 text-cyan-200/30" />
        </motion.div>

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
              <Scale className="w-10 h-10" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight drop-shadow-2xl">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-white">
                Terms of Service
              </span>
            </h1>
            <p className="text-xl md:text-2xl font-light text-cyan-100 mb-8">
              Điều khoản Dịch vụ
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
              <motion.div
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
                whileHover={{ scale: 1.05 }}
              >
                <Calendar className="w-4 h-4" />
                <span>Last Updated: January 1, 2025</span>
              </motion.div>
              <div className="hidden sm:block w-1 h-1 bg-white/50 rounded-full"></div>
              <motion.div
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
                whileHover={{ scale: 1.05 }}
              >
                <FileText className="w-4 h-4" />
                <span>Version 2.0</span>
              </motion.div>
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
                  {/* English Content */}
                  <div className="mb-8 pb-8 border-b border-slate-200">
                    <div className="prose prose-slate max-w-none">
                      {section.content.map((paragraph, pIndex) => (
                        <p
                          key={pIndex}
                          className="text-slate-700 leading-relaxed mb-4 last:mb-0"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Vietnamese Content */}
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg mb-4">
                      <span className="text-sm font-semibold text-slate-600">
                        🇻🇳 Tiếng Việt
                      </span>
                    </div>
                    <div className="prose prose-slate max-w-none">
                      {section.contentVi.map((paragraph, pIndex) => (
                        <p
                          key={pIndex}
                          className="text-slate-600 leading-relaxed mb-4 last:mb-0"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.section>
            ))}
          </div>

          {/* FOOTER NOTICE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-20 bg-gradient-to-br from-slate-50 to-cyan-50 rounded-2xl p-10 border border-slate-200"
          >
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Important Notice / Lưu ý Quan trọng
                </h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  These Terms of Service constitute a legally binding agreement
                  between you and MeMe. Please read them carefully before using
                  our services. If you have any questions or concerns, please
                  contact our legal team at legal@meme.app.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Các Điều khoản Dịch vụ này tạo thành một thỏa thuận ràng buộc
                  về mặt pháp lý giữa bạn và MeMe. Vui lòng đọc kỹ trước khi sử
                  dụng dịch vụ của chúng tôi. Nếu bạn có bất kỳ câu hỏi hoặc
                  thắc mắc nào, vui lòng liên hệ với đội ngũ pháp lý của chúng
                  tôi tại legal@meme.app.
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
              Questions About Our Terms?
            </h2>
            <p className="text-xl text-slate-300 mb-10">
              Có câu hỏi về Điều khoản của chúng tôi?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:legal@meme.app"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors"
              >
                <Mail className="w-5 h-5" />
                Contact Legal Team
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

export default TermsPage;
