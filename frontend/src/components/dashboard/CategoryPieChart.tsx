import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { motion } from 'framer-motion'

/**
 * Component biểu đồ tròn hiển thị chi tiêu theo danh mục
 * - Sử dụng Recharts
 * - Có animation
 * - Hiển thị tooltip và legend
 */
interface CategoryData {
  name: string
  value: number
  color: string
  icon?: string
}

interface CategoryPieChartProps {
  data: CategoryData[]
  loading?: boolean
}

const CategoryPieChart = ({ data, loading = false }: CategoryPieChartProps) => {
  // Màu sắc mặc định nếu không có
  const COLORS = [
    '#00C4B4',
    '#4DD0E1',
    '#26A69A',
    '#00897B',
    '#00695C',
    '#F59E0B',
    '#EF5350',
    '#AB47BC',
    '#5C6BC0',
    '#42A5F5',
  ]

  // Tính tổng để hiển thị phần trăm
  const total = data.reduce((sum, item) => sum + item.value, 0)

  // Format số tiền
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const percent = ((data.value / total) * 100).toFixed(1)
      return (
        <div className="bg-base-100 p-3 rounded-xl shadow-lg border border-base-300">
          <p className="font-semibold">{data.name}</p>
          <p className="text-primary font-bold">{formatCurrency(data.value)}</p>
          <p className="text-sm text-base-content/70">{percent}% tổng chi</p>
        </div>
      )
    }
    return null
  }

  // Custom label
  const renderLabel = (entry: any) => {
    const percent = ((entry.value / total) * 100).toFixed(0)
    return `${entry.name}: ${percent}%`
  }

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <p className="text-base-content/50">Chưa có dữ liệu chi tiêu</p>
          <p className="text-sm text-base-content/30 mt-2">
            Thêm giao dịch để xem biểu đồ
          </p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-80"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry: any) => (
              <span style={{ color: entry.color }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

export default CategoryPieChart

