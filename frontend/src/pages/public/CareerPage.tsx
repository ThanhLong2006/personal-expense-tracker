import { useState } from "react";
import { motion } from "framer-motion";

// -------------------- DATA --------------------
const openings = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    type: "Toàn thời gian • Hà Nội / Remote",
    description:
      "Xây dựng và tối ưu UI/UX cho dashboard người dùng, đảm bảo hiệu năng cao với React + Vite + Zustand.",
    longDetail:
      "Bạn sẽ tham gia vào việc thiết kế và phát triển giao diện người dùng cho nền tảng quản lý tài chính cá nhân Meme. Công việc bao gồm xây dựng component tái sử dụng, tối ưu hoá hiệu năng, áp dụng best practices trong React 18, xử lý animation bằng Framer Motion, và đảm bảo tính ổn định cross-browser. Bạn cũng sẽ phối hợp chặt chẽ với team Backend & Product để đưa ra giải pháp UI tối ưu cho hàng triệu người dùng.",
    responsibilities: [
      "Xây dựng component tái sử dụng, tối ưu performance và accessibility.",
      "Viết unit/integration test và tham gia code review.",
      "Tối ưu hoá bundle, lazy-load và cải thiện thời gian load trang.",
      "Phối hợp chặt chẽ với Product để hiện thực hoá yêu cầu người dùng.",
    ],
    requirements: [
      "3+ năm kinh nghiệm làm frontend với React.",
      "Thành thạo TypeScript, Tailwind và hệ sinh thái React.",
      "Hiểu biết về trình duyệt, performance và security cơ bản.",
    ],
    tags: ["React 18", "TypeScript", "Tailwind", "Testing"],
    salary: "35–55 triệu VNĐ",
    location: "Hà Nội",
  },
  {
    id: 2,
    title: "Backend Engineer (Java/Spring)",
    type: "Toàn thời gian • TP.HCM / Hybrid",
    description:
      "Phát triển API bảo mật cao với Spring Boot 3, tối ưu hiệu năng MySQL, Redis, thiết kế mô-đun backup.",
    longDetail:
      "Bạn sẽ chịu trách nhiệm xây dựng hệ thống backend xử lý lượng request lớn, bao gồm authentication, OTP, bảo mật JWT nâng cao, quản lý tài nguyên, caching với Redis, tối ưu truy vấn database, thiết kế kiến trúc microservices trong tương lai và đảm bảo hệ thống có khả năng scale linh hoạt. Bạn cũng tham gia xử lý CI/CD, logging, monitoring.",
    responsibilities: [
      "Thiết kế API, tối ưu truy vấn và schema database.",
      "Triển khai caching, queue và cơ chế retry khi cần.",
      "Viết test cho service và tích hợp CI/CD.",
    ],
    requirements: [
      "2+ năm kinh nghiệm Java/Spring Boot.",
      "Kinh nghiệm tối ưu hoá MySQL và Redis.",
    ],
    tags: ["Spring Boot", "MySQL", "Redis", "Security"],
    salary: "30–50 triệu VNĐ",
    location: "TP.HCM",
  },
  {
    id: 3,
    title: "Product Designer",
    type: "Toàn thời gian • Hà Nội",
    description:
      "Thiết kế trải nghiệm người dùng hiện đại, đảm bảo thống nhất brand guideline và accessibility.",
    longDetail:
      "Bạn sẽ thiết kế toàn bộ workflow trải nghiệm người dùng từ wireframe → prototype → UI Final. Công việc bao gồm xây dựng Design System, thiết kế biểu đồ tài chính, tối ưu UX cho mobile-first, và làm việc chặt chẽ với team Frontend để đảm bảo UI pixel-perfect. Các công cụ sử dụng: Figma, Protopie, Notion.",
    responsibilities: [
      "Thiết kế wireframe, prototype và design system.",
      "Thực hiện user research và usability testing.",
    ],
    requirements: ["Kinh nghiệm với Figma và design system."],
    tags: ["Figma", "Design System", "User Research"],
    salary: "25–40 triệu VNĐ",
    location: "Hà Nội",
  },
];

const perks = [
  "Lương cạnh tranh + thưởng dự án + ESOP",
  "Laptop cấu hình cao, màn hình phụ 27 inch",
  "18 ngày nghỉ phép / năm + remote linh hoạt",
  "Team trẻ, năng động, không drama",
  "Ngân sách học tập 10–20 triệu/năm",
  "Bảo hiểm sức khoẻ cao cấp",
  "Du lịch công ty 2 lần/năm",
  "Môi trường startup tốc độ cao",
];

const culture = [
  "Tư duy sản phẩm mạnh mẽ — làm ra thứ người dùng thật sự cần",
  "Tối ưu hoá liên tục — không ngừng cải thiện UI, hiệu năng, trải nghiệm",
  "Teamwork rõ ràng — luôn hỗ trợ nhau để tiến bộ nhanh hơn",
  "Tập trung vào chất lượng code — sạch, dễ mở rộng, có test",
  "Khuyến khích sáng tạo — mọi ý tưởng đều được thử nghiệm",
];

const steps = [
  "Ứng tuyển online hoặc gửi CV qua email",
  "Phỏng vấn kỹ thuật + xử lý tình huống",
  "Phỏng vấn văn hoá + phù hợp đội ngũ",
  "Nhận offer trong 24–72 giờ",
];

// -------------------- MAIN PAGE --------------------
type Job = (typeof openings)[number];

export default function CareerPage() {
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [filter, setFilter] = useState("Tất cả");
  const [query, setQuery] = useState("");

  const filteredOpenings = openings.filter((j) => {
    if (filter !== "Tất cả" && j.location !== filter) return false;
    if (
      query &&
      !`${j.title} ${j.description}`.toLowerCase().includes(query.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {/* -------- HERO -------- */}
      <section className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white py-24 text-center shadow-xl">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-6"
          >
            Gia nhập đội ngũ Meme
          </motion.h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Xây dựng cùng chúng tôi một nền tảng quản lý chi tiêu cho hàng triệu
            người Việt — nơi bạn có thể tạo ra ảnh hưởng thật sự.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm vị trí, kỹ năng..."
              className="px-4 py-3 rounded-full w-96 max-w-full text-black"
              aria-label="Tìm kiếm"
            />
            <div className="bg-white/10 rounded-full px-3 py-2 flex items-center gap-2">
              <button
                onClick={() => setFilter("Tất cả")}
                className={`px-4 py-2 rounded-full ${
                  filter === "Tất cả"
                    ? "bg-white text-blue-600"
                    : "text-white/90"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setFilter("Hà Nội")}
                className={`px-4 py-2 rounded-full ${
                  filter === "Hà Nội"
                    ? "bg-white text-blue-600"
                    : "text-white/90"
                }`}
              >
                Hà Nội
              </button>
              <button
                onClick={() => setFilter("TP.HCM")}
                className={`px-4 py-2 rounded-full ${
                  filter === "TP.HCM"
                    ? "bg-white text-blue-600"
                    : "text-white/90"
                }`}
              >
                TP.HCM
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* -------- JOB LIST -------- */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8 text-center">
            Vị trí đang tuyển
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {filteredOpenings.length === 0 ? (
              <div className="col-span-3 text-center text-gray-500">
                Không tìm thấy vị trí phù hợp.
              </div>
            ) : (
              filteredOpenings.map((job) => (
                <motion.article
                  key={job.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-base-200 rounded-2xl p-6 shadow hover:shadow-2xl transition cursor-pointer flex flex-col"
                  onClick={() => setActiveJob(job)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-blue-600 font-semibold">
                        {job.type}
                      </p>
                      <h3 className="text-2xl font-bold mt-2">{job.title}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-base-content/70">{job.location}</p>
                      <p className="text-blue-600 font-medium">{job.salary}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-base-content/80 line-clamp-3">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {job.tags?.map((t) => (
                      <span
                        key={t}
                        className="badge border-blue-500 text-blue-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button className="btn bg-blue-600 text-white rounded-full px-5 py-2">
                      Ứng tuyển
                    </button>
                    <button
                      onClick={() => setActiveJob(job)}
                      className="btn btn-outline rounded-full px-5 py-2"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </motion.article>
              ))
            )}
          </div>
        </div>
      </section>

      {/* -------- WHY JOIN / PERKS / CULTURE / STEPS -------- */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-4 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-4 text-blue-600">
              Tại sao nên gia nhập Meme
            </h2>
            <p className="opacity-80 mb-6">
              Chúng tôi xây dựng một môi trường nơi bạn được tự do thử nghiệm,
              học hỏi và tạo ra sản phẩm có ý nghĩa.
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              {culture.map((c) => (
                <div key={c} className="p-4 bg-base-100 rounded-lg shadow">
                  {c}
                </div>
              ))}
            </div>

            <h3 className="text-2xl font-bold mt-8 mb-4">Quyền lợi nổi bật</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {perks.map((p) => (
                <div key={p} className="p-4 bg-base-100 rounded-lg shadow">
                  {p}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-base-100 rounded-2xl shadow">
            <h3 className="text-xl font-bold mb-4">Quy trình tuyển dụng</h3>
            <ol className="list-decimal ml-6 space-y-2">
              {steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>

            <div className="mt-6">
              <h4 className="font-semibold">Liên hệ tuyển dụng</h4>
              <p className="text-sm opacity-80">hr@example.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* -------- JOB DETAIL MODAL (SAFE ACCESS) -------- */}
      {activeJob ? (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-blue-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="job-detail-title"
          >
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 id="job-detail-title" className="text-3xl font-bold">
                    {activeJob?.title ?? ""}
                  </h2>
                  <p className="opacity-90 mt-1">
                    {activeJob?.type ?? ""} • {activeJob?.location ?? ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{activeJob?.salary ?? ""}</p>
                </div>
              </div>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto text-gray-700 space-y-6">
              <section>
                <h3 className="text-2xl font-semibold text-blue-600">
                  Mô tả công việc
                </h3>
                <p className="mt-2">{activeJob?.longDetail ?? ""}</p>
              </section>

              <section>
                <h3 className="text-2xl font-semibold text-blue-600">
                  Nhiệm vụ chính
                </h3>
                <ul className="list-disc ml-6 mt-2 space-y-2">
                  {(activeJob?.responsibilities ?? []).map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-2xl font-semibold text-blue-600">
                  Yêu cầu
                </h3>
                <ul className="list-disc ml-6 mt-2 space-y-2">
                  {(activeJob?.requirements ?? []).map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-2xl font-semibold text-blue-600">
                  Kỹ năng & Công cụ
                </h3>
                <div className="flex flex-wrap gap-2 mt-3">
                  {(activeJob?.tags ?? []).map((t) => (
                    <span
                      key={t}
                      className="badge border-blue-500 text-blue-600"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-2xl font-semibold text-blue-600">
                  Quyền lợi mở rộng
                </h3>
                <ul className="list-disc ml-6 mt-2 space-y-2">
                  <li>Thưởng 13 + thưởng hiệu suất.</li>
                  <li>Khoá đào tạo nâng cao kỹ năng miễn phí.</li>
                  <li>Thiết bị làm việc cao cấp.</li>
                  <li>Cơ hội lên Senior/Leader sau 6–12 tháng.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-2xl font-semibold text-blue-600">
                  Quy trình phỏng vấn chi tiết
                </h3>
                <ol className="list-decimal ml-6 mt-2 space-y-2">
                  <li>Nộp CV & portfolio (nếu có)</li>
                  <li>Phỏng vấn kỹ thuật (live coding / system design)</li>
                  <li>Bài task thực tế (nếu cần)</li>
                  <li>Phỏng vấn văn hóa với lead</li>
                </ol>
              </section>

              {/* Apply form (simple) */}
              <section>
                <h3 className="text-2xl font-semibold text-blue-600">
                  Ứng tuyển ngay
                </h3>
                <p className="mt-2 text-sm opacity-80">
                  Gửi CV & thư ứng tuyển — chúng tôi sẽ liên hệ trong 3–5 ngày
                  làm việc.
                </p>
                <form
                  className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    name="name"
                    placeholder="Họ và tên"
                    className="p-3 border rounded"
                  />
                  <input
                    name="email"
                    placeholder="Email"
                    className="p-3 border rounded"
                  />
                  <input
                    name="phone"
                    placeholder="Số điện thoại"
                    className="p-3 border rounded"
                  />
                  <input
                    name="portfolio"
                    placeholder="Link portfolio / GitHub (tuỳ chọn)"
                    className="p-3 border rounded"
                  />
                  <textarea
                    name="cover"
                    placeholder="Thư ứng tuyển (tối đa 500 từ)"
                    className="p-3 border rounded md:col-span-2"
                    rows={4}
                  />

                  <div className="md:col-span-2 flex gap-3 items-center">
                    <input type="file" className="hidden" id="cvfile" />
                    <label htmlFor="cvfile" className="btn btn-outline">
                      Tải lên CV
                    </label>
                    <button
                      type="submit"
                      className="btn bg-blue-600 text-white ml-auto"
                    >
                      Gửi ứng tuyển
                    </button>
                  </div>
                </form>
              </section>
            </div>

            <div className="p-4 border-t flex justify-end gap-3">
              <button
                className="btn btn-outline"
                onClick={() => setActiveJob(null)}
              >
                Đóng
              </button>
              <button
                className="btn bg-blue-600 text-white"
                onClick={() => alert("Ứng tuyển gửi (demo)")}
              >
                Gửi ứng tuyển
              </button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </div>
  );
}
