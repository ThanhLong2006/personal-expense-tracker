import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  ArrowRight,
  Heart,
  MessageCircle,
  Sparkles,
  Mail,
  TrendingUp,
} from "lucide-react";

const featuredPost = {
  slug: "tu-het-tien-den-tu-do-tai-chinh",
  title: "Từ “hết tiền trước lương” đến tự do chi tiêu chỉ trong 18 tháng",
  excerpt:
    "Câu chuyện thật của một cô gái 27 tuổi ở Sài Gòn: làm sao để từ lương 15 triệu/tháng xây dựng quỹ dự phòng 8 tháng và bắt đầu đầu tư chứng khoán — chỉ dùng duy nhất MeMe.",
  author: "Nguyễn Thảo Linh",
  role: "Content Creator • Người dùng MeMe từ ngày đầu",
  date: "28 tháng 11, 2025",
  readTime: "12 phút đọc",
  likes: 31294,
  comments: 2481,
  // Thay bằng ảnh thật của bạn
  image:
    "https://cafefcdn.com/203337114487263232/2025/8/4/1e51ecb2fd54c64742ed5012e7c04b23-17539281565181788021437-1754267255980-17542672612551354727739-1754291512622-17542915130301130812212.png",
  avatar:
    "https://cafefcdn.com/203337114487263232/2025/8/4/1e51ecb2fd54c64742ed5012e7c04b23-17539281565181788021437-1754267255980-17542672612551354727739-1754291512622-17542915130301130812212.png",
};

const posts = [
  {
    slug: "ai-du-doan-chi-tieu-meme",
    title: "Công nghệ AI dự đoán chi tiêu của MeMe hoạt động như thế nào?",
    excerpt:
      "Giải mã thuật toán đạt độ chính xác 94,7% đang giúp hàng triệu người Việt kiểm soát chi tiêu tốt hơn mỗi ngày.",
    author: "TS. Trần Quốc Minh",
    role: "Trưởng phòng AI • MeMe Labs",
    date: "25 tháng 11, 2025",
    readTime: "15 phút đọc",
    likes: 19832,
    comments: 1034,
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=85&fm=jpg",
  },
  {
    slug: "zero-based-budgeting-vietnam",
    title:
      "Zero-Based Budgeting: Bí quyết giúp tôi dư tiền dù lương chỉ 18 triệu",
    excerpt:
      "Phương pháp phân bổ từng đồng một đang thay đổi hoàn toàn cách người trẻ Việt Nam quản lý chi tiêu.",
    author: "Phạm Khánh",
    role: "Chuyên gia chi tiêu cá nhân",
    date: "22 tháng 11, 2025",
    readTime: "11 phút đọc",
    likes: 35421,
    comments: 1923,
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=85&fm=jpg",
  },
  {
    slug: "import-giao-dich-ngan-hang",
    title:
      "Hướng dẫn import toàn bộ lịch sử giao dịch từ 7 ngân hàng chỉ trong 60 giây",
    excerpt:
      "File mẫu, cách xử lý lỗi, tự động phân loại danh mục — chuyển sang MeMe mà không mất một giao dịch nào.",
    author: "Team MeMe",
    role: "Đội ngũ Sản phẩm",
    date: "20 tháng 11, 2025",
    readTime: "8 phút đọc",
    likes: 22104,
    comments: 892,
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=85&fm=jpg",
  },
  {
    slug: "tuong-lai-tai-chinh-ca-nhan",
    title: "Tương lai chi tiêu cá nhân không còn là ghi chép — mà là dự đoán",
    excerpt:
      "Tại sao các phần mềm truyền thống đang dần biến mất, và tại sao AI-first như MeMe đang trở thành tiêu chuẩn toàn cầu.",
    author: "Alex Chen",
    role: "Partner • Sequoia Capital Southeast Asia",
    date: "18 tháng 11, 2025",
    readTime: "13 phút đọc",
    likes: 45892,
    comments: 3102,
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0bc6596e?w=1200&q=85&fm=jpg",
  },
  {
    slug: "review-meme-pro-2025",
    title:
      "MeMe Pro 2025 có thực sự đáng tiền? Đánh giá không quảng cáo sau 10 tháng",
    excerpt:
      "Tôi đã tiết kiệm được hơn 100 triệu đồng nhờ AI gợi ý tự động — đây là bảng so sánh chi tiết từng tính năng.",
    author: "Hoàng Hà Anh",
    role: "Freelancer • Digital Nomad",
    date: "15 tháng 11, 2025",
    readTime: "14 phút đọc",
    likes: 42391,
    comments: 3456,
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2b033f?w=1200&q=85&fm=jpg",
  },
];

const BlogListPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      {/* HERO – SANG TRỌNG & CHUYÊN NGHIỆP */}
      <section className="pt-40 pb-32 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0055FF]/5 to-[#00D4FF]/5"></div>
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="inline-flex items-center gap-3 bg-white border border-cyan-200 text-[#0055FF] px-8 py-4 rounded-full text-sm font-bold tracking-wider mb-10 shadow-lg">
              <Sparkles className="w-5 h-5" />
              Blog chính thức của MeMe • Thành lập 2025
            </div>

            <h1 className="text-6xl md:text-8xl font-black leading-tight max-w-6xl mx-auto">
              Kiến thức chi tiêu
              <br />
              <span className="bg-gradient-to-r from-[#0055FF] to-[#00D4FF] bg-clip-text text-transparent">
                thực tế & dễ áp dụng
              </span>
            </h1>

            <p className="mt-10 text-2xl md:text-3xl text-gray-700 font-light max-w-4xl mx-auto leading-relaxed">
              Hàng trăm câu chuyện thật, bài học sâu sắc và mẹo chi tiêu từ
              cộng đồng MeMe — được kể một cách trung thực, không giáo điều.
            </p>

            <div className="grid grid-cols-3 gap-12 mt-20 max-w-4xl mx-auto">
              <div>
                <div className="text-5xl font-black text-[#0055FF]">100K+</div>
                <div className="text-gray-600 mt-2">Người đọc/tháng</div>
              </div>
              <div>
                <div className="text-5xl font-black text-[#0055FF]">500+</div>
                <div className="text-gray-600 mt-2">Bài viết</div>
              </div>
              <div>
                <div className="text-5xl font-black text-[#0055FF]">4.9/5</div>
                <div className="text-gray-600 mt-2">Đánh giá</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* BÀI VIẾT NỔI BẬT – CÓ ẢNH THẬT LỚN */}
      <section className="px-6 pb-32">
        <div className="container mx-auto max-w-7xl">
          <motion.article
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-cyan-100"
          >
            <div className="grid lg:grid-cols-2">
              {/* Ảnh lớn bên phải */}
              <div className="relative h-96 lg:h-full order-1 lg:order-2">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-8 left-8 text-white">
                  <span className="bg-[#0055FF] px-6 py-3 rounded-full text-sm font-bold backdrop-blur">
                    {featuredPost.readTime}
                  </span>
                </div>
              </div>

              {/* Nội dung bên trái */}
              <div className="p-12 lg:p-20 flex flex-col justify-center order-2 lg:order-1">
                <div className="flex items-center gap-3 text-[#0055FF] font-bold text-sm uppercase tracking-wider mb-6">
                  <TrendingUp className="w-5 h-5" />
                  Câu chuyện nổi bật tuần này
                </div>

                <h2 className="text-4xl md:text-6xl font-black leading-tight mb-8">
                  {featuredPost.title}
                </h2>

                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-10">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center gap-6 mb-8">
                  <img
                    src={featuredPost.avatar || featuredPost.image}
                    alt={featuredPost.author}
                    className="w-20 h-20 rounded-full ring-4 ring-cyan-100 object-cover"
                  />
                  <div>
                    <div className="text-xl font-bold">
                      {featuredPost.author}
                    </div>
                    <div className="text-gray-600">{featuredPost.role}</div>
                  </div>
                </div>

                <div className="flex items-center gap-8 text-gray-500 mb-10">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {featuredPost.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    {featuredPost.readTime}
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="flex items-center gap-1">
                      <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                      {featuredPost.likes.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-5 h-5" />
                      {featuredPost.comments}
                    </div>
                  </div>
                </div>
                <a
                  href="https://cafef.vn/co-gai-27-tuoi-song-mot-minh-o-tphcm-chia-se-bang-chi-tieu-8-trieu-thang-khong-de-danh-duoc-nhung-cung-khong-no-la-song-on-hay-tha-troi-tai-chinh-188250804141342138.chn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 border-2 border-[#0055FF] text-[#0055FF] font-bold text-lg rounded-full hover:bg-[#0055FF] hover:text-white transition-all"
                >
                  Đọc toàn bộ câu chuyện <ArrowRight className="w-7 h-7" />
                </a>
              </div>
            </div>
          </motion.article>
        </div>
      </section>

      {/* TẤT CẢ BÀI VIẾT – CÓ ẢNH THẬT */}
      <section className="py-20 px-6 bg-gradient-to-b from-cyan-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-[#0055FF] to-[#00D4FF] bg-clip-text text-transparent">
              Bài viết mới nhất
            </h2>
            <p className="text-xl text-gray-600">
              Cập nhật mỗi tuần từ đội ngũ và cộng đồng MeMe
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {posts.map((post, i) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-500 hover:-translate-y-3"
              >
                {/* Ảnh thật */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-5 left-6 text-white">
                    <span className="bg-[#0055FF] px-5 py-2 rounded-full text-sm font-bold">
                      {post.readTime}
                    </span>
                  </div>
                </div>

                {/* Nội dung */}
                <div className="p-8">
                  <h3 className="text-2xl md:text-3xl font-black mb-5 leading-tight line-clamp-3 group-hover:text-[#0055FF] transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 text-lg leading-relaxed mb-8 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#0055FF] to-[#00D4FF] rounded-full flex-shrink-0"></div>
                      <div>
                        <div className="font-bold text-gray-900">
                          {post.author}
                        </div>
                        <div>{post.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                        {(post.likes / 1000).toFixed(1)}k
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-5 h-5" />
                        {post.comments}
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-[#0055FF] font-bold text-lg hover:pl-2 transition-all"
                  >
                    Đọc bài viết →
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Nút Load More */}
          <div className="text-center mt-20">
            <button className="px-16 py-6 bg-gradient-to-r from-[#0055FF] to-[#00D4FF] text-white font-black text-xl rounded-full shadow-2xl hover:scale-105 transition-all duration-300">
              Xem thêm bài viết
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogListPage;
