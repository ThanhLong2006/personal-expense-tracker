import { useParams, Link } from 'react-router-dom'

const mockPosts: Record<string, { title: string; content: string; date: string }> = {
  'cam-nang-quan-ly-chi-tieu-2024': {
    title: 'Cẩm nang quản lý chi tiêu 2024',
    date: '10/01/2024',
    content: `
## 1. Theo dõi mọi khoản chi
- Ghi nhận ngay khi phát sinh
- Phân loại rõ ràng
- Sử dụng OCR để tiết kiệm thời gian

## 2. Đặt ngân sách theo danh mục
- Ăn uống: 30%
- Đi lại: 15%
- Tiết kiệm: 20%

## 3. Phân tích hàng tháng
- Sử dụng biểu đồ tròn để xem tỷ trọng
- Dùng AI để dự đoán chi tiêu tháng tới
    `,
  },
}

const BlogDetailPage = () => {
  const { id } = useParams()
  const post = id && mockPosts[id]

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Bài viết không tồn tại</h1>
        <Link to="/blog" className="btn btn-primary">
          Quay lại blog
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100">
      <section className="bg-base-200 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link to="/blog" className="link link-primary">
            ← Quay lại blog
          </Link>
          <h1 className="text-4xl font-bold mt-4 mb-3">{post.title}</h1>
          <p className="text-base-content/60">{post.date}</p>
        </div>
      </section>
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl prose prose-slate">
          {post.content.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      </section>
    </div>
  )
}

export default BlogDetailPage

