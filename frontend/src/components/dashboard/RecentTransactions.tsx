import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

/**
 * Component hiển thị các giao dịch gần đây
 * - Hiển thị 5-10 giao dịch mới nhất
 * - Có icon danh mục, ngày, số tiền
 * - Click để xem chi tiết
 */
interface Transaction {
  id: number
  amount: number
  category: {
    id: number
    name: string
    icon: string
    color: string
  }
  transactionDate: string
  note?: string
  location?: string
}

interface RecentTransactionsProps {
  transactions: Transaction[]
  loading?: boolean
}

const RecentTransactions = ({
  transactions,
  loading = false,
}: RecentTransactionsProps) => {
  // Format số tiền
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Format ngày
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Hôm nay'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hôm qua'
    } else {
      return format(date, 'dd/MM/yyyy', { locale: vi })
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-base-200 animate-pulse rounded-xl" />
        ))}
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-base-content/50 mb-2">Chưa có giao dịch</p>
        <Link to="/transactions" className="btn btn-primary btn-sm">
          Thêm giao dịch đầu tiên
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {transactions.map((transaction, index) => (
        <motion.div
          key={transaction.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <Link to={`/transactions/${transaction.id}`}>
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                {/* Left: Icon + Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{
                      backgroundColor: `${transaction.category.color}20`,
                    }}
                  >
                    <span style={{ color: transaction.category.color }}>
                      {transaction.category.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">
                      {transaction.category.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-base-content/50">
                      <span>{formatDate(transaction.transactionDate)}</span>
                      {transaction.location && (
                        <>
                          <span>•</span>
                          <span className="truncate">{transaction.location}</span>
                        </>
                      )}
                    </div>
                    {transaction.note && (
                      <p className="text-xs text-base-content/40 truncate mt-1">
                        {transaction.note}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Amount */}
                <div className="text-right ml-4 flex-shrink-0">
                  <p className="font-bold text-base text-primary">
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}

      {/* Xem tất cả */}
      <div className="text-center pt-2">
        <Link
          to="/transactions"
          className="link link-primary text-sm font-medium"
        >
          Xem tất cả giao dịch →
        </Link>
      </div>
    </div>
  )
}

export default RecentTransactions

