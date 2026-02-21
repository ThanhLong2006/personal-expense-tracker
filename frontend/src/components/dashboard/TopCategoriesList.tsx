import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

/**
 * Component hiển thị Top 5 danh mục chi nhiều nhất
 * - Hiển thị icon, tên, số tiền, phần trăm
 * - Có progress bar
 * - Click để xem chi tiết
 */
interface CategoryData {
  id: number
  name: string
  icon: string
  color: string
  amount: number
  percentage: number
  transactionCount: number
}

interface TopCategoriesListProps {
  categories: CategoryData[]
  totalAmount: number
  loading?: boolean
}

const TopCategoriesList = ({
  categories,
  totalAmount,
  loading = false,
}: TopCategoriesListProps) => {
  // Format số tiền
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-base-200 animate-pulse rounded-xl" />
        ))}
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-base-content/50">Chưa có dữ liệu</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        >
          <Link to={`/transactions?category=${category.id}`}>
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                {/* Left: Icon + Name */}
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <span style={{ color: category.color }}>
                      {category.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate">
                      {category.name}
                    </h3>
                    <p className="text-xs text-base-content/50">
                      {category.transactionCount} giao dịch
                    </p>
                  </div>
                </div>

                {/* Right: Amount + Percentage */}
                <div className="text-right ml-4">
                  <p className="font-bold text-lg text-primary">
                    {formatCurrency(category.amount)}
                  </p>
                  <p className="text-sm text-base-content/50">
                    {category.percentage.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="w-full bg-base-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${category.percentage}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="h-2 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}

      {/* Xem tất cả */}
      {categories.length >= 5 && (
        <div className="text-center pt-2">
          <Link
            to="/categories"
            className="link link-primary text-sm font-medium"
          >
            Xem tất cả danh mục →
          </Link>
        </div>
      )}
    </div>
  )
}

export default TopCategoriesList

