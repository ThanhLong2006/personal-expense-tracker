import { motion } from 'framer-motion'
import { ReactNode } from 'react'

/**
 * Component hiển thị thẻ thống kê
 * - Có animation khi hover
 * - Hiển thị icon, title, value, change percentage
 */
interface StatsCardProps {
  title: string
  value: string | number
  icon: ReactNode
  change?: number // Phần trăm thay đổi
  changeLabel?: string
  color?: 'primary' | 'success' | 'warning' | 'error'
  loading?: boolean
}

const StatsCard = ({
  title,
  value,
  icon,
  change,
  changeLabel,
  color = 'primary',
  loading = false,
}: StatsCardProps) => {
  // Màu sắc theo loại
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-green-500/10 text-green-500',
    warning: 'bg-yellow-500/10 text-yellow-500',
    error: 'bg-red-500/10 text-red-500',
  }

  // Format số tiền
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(val)
    }
    return val
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
    >
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
            {icon}
          </div>
          {change !== undefined && (
            <div
              className={`badge ${
                change >= 0 ? 'badge-error' : 'badge-success'
              }`}
            >
              {change >= 0 ? '+' : ''}
              {change.toFixed(1)}%
            </div>
          )}
        </div>
        <h3 className="text-sm font-medium text-base-content/70 mb-1">
          {title}
        </h3>
        {loading ? (
          <div className="h-8 w-32 bg-base-200 animate-pulse rounded" />
        ) : (
          <p className="text-3xl font-bold text-primary">
            {formatValue(value)}
          </p>
        )}
        {changeLabel && (
          <p className="text-xs text-base-content/50 mt-2">{changeLabel}</p>
        )}
      </div>
    </motion.div>
  )
}

export default StatsCard

