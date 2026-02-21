import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts'
import { motion } from 'framer-motion'
import React, { useState } from 'react'

/**
 * Component biểu đồ xu hướng chi tiêu
 * - Có thể chuyển đổi giữa Bar, Line, Area chart
 * - Hiển thị theo ngày/tuần/tháng/năm
 * - Có animation
 */
interface TrendData {
  date: string
  amount: number
  transactions: number
  thu?: number
  chi?: number
}

export interface ExpenseTrendChartProps {
  data: TrendData[]
  period: 'day' | 'week' | 'month' | 'year'
  loading?: boolean
  type?: 'income' | 'expense' | 'both'
}

const ExpenseTrendChart = ({
  data,
  period,
  loading = false,
  type = 'expense',
}: ExpenseTrendChartProps) => {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>('bar')

  // Format số tiền
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-base-100 p-3 rounded-xl shadow-lg border border-base-300">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="font-medium">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // Format label theo period
  const formatXAxisLabel = (tickItem: string) => {
    try {
      if (period === 'day') {
        return new Date(tickItem).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
        })
      } else if (period === 'week') {
        // Nếu tickItem là ngày đầu tuần dạng yyyy-MM-dd
        const date = new Date(tickItem);
        if (isNaN(date.getTime())) return `Tuần ${tickItem}`;
        // Lấy số tuần trong năm (thư viện date-fns có phương thức này nhưng ở đây ta dùng logic đơn giản)
        // Hoặc hiển thị ngày bắt đầu tuần
        return format(date, "dd/MM");
      } else if (period === 'month') {
        const date = new Date(tickItem);
        if (isNaN(date.getTime())) return tickItem;
        return date.toLocaleDateString('vi-VN', {
          month: 'short',
          year: 'numeric',
        })
      }
      return tickItem
    } catch {
      return tickItem
    }
  }

  // Helper date formatter for week since we don't have date-fns imported here directly unless we import it.
  // We can use Intl.
  const format = (date: Date, fmt: string) => {
    // Basic fallback since we don't want to add huge dependencies if not needed
    // But Dashboard passes ISO strings inside TrendData
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
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
          <p className="text-base-content/50">Chưa có dữ liệu</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      {/* Chart type selector */}
      <div className="flex justify-end mb-4 gap-2">
        <button
          onClick={() => setChartType('bar')}
          className={`btn btn-sm ${chartType === 'bar' ? 'btn-primary' : 'btn-ghost'
            }`}
        >
          Cột
        </button>
        <button
          onClick={() => setChartType('line')}
          className={`btn btn-sm ${chartType === 'line' ? 'btn-primary' : 'btn-ghost'
            }`}
        >
          Đường
        </button>
        <button
          onClick={() => setChartType('area')}
          className={`btn btn-sm ${chartType === 'area' ? 'btn-primary' : 'btn-ghost'
            }`}
        >
          Vùng
        </button>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="date"
                tickFormatter={formatXAxisLabel}
                stroke="#666"
              />
              <YAxis
                tickFormatter={(value) => formatCurrency(value)}
                stroke="#666"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {(type === 'expense' || type === 'both') && (
                <Bar
                  dataKey="chi"
                  fill="#ef4444"
                  name="Chi tiêu"
                  radius={[4, 4, 0, 0]}
                  animationDuration={800}
                />
              )}
              {(type === 'income' || type === 'both') && (
                <Bar
                  dataKey="thu"
                  fill="#10b981"
                  name="Thu nhập"
                  radius={[4, 4, 0, 0]}
                  animationDuration={800}
                />
              )}
            </BarChart>
          ) : chartType === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="date"
                tickFormatter={formatXAxisLabel}
                stroke="#666"
              />
              <YAxis
                tickFormatter={(value) => formatCurrency(value)}
                stroke="#666"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {(type === 'expense' || type === 'both') && (
                <Line
                  type="monotone"
                  dataKey="chi"
                  stroke="#ef4444"
                  strokeWidth={3}
                  name="Chi tiêu"
                  dot={{ fill: '#ef4444', r: 4 }}
                  animationDuration={800}
                />
              )}
              {(type === 'income' || type === 'both') && (
                <Line
                  type="monotone"
                  dataKey="thu"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Thu nhập"
                  dot={{ fill: '#10b981', r: 4 }}
                  animationDuration={800}
                />
              )}
            </LineChart>
          ) : (
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="date"
                tickFormatter={formatXAxisLabel}
                stroke="#666"
              />
              <YAxis
                tickFormatter={(value) => formatCurrency(value)}
                stroke="#666"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {(type === 'expense' || type === 'both') && (
                <Area
                  type="monotone"
                  dataKey="chi"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.3}
                  name="Chi tiêu"
                  animationDuration={800}
                />
              )}
              {(type === 'income' || type === 'both') && (
                <Area
                  type="monotone"
                  dataKey="thu"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                  name="Thu nhập"
                  animationDuration={800}
                />
              )}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

export default ExpenseTrendChart

