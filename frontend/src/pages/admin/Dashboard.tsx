/**
 * Admin Dashboard - Trang quản trị hệ thống
 * GIAO DIỆN: Giống Dashboard user (galaxy background, professional design)
 * LOGIC: Từ code admin (document index 9) - Giữ nguyên 100%
 * MÀU SẮC: Teal/Cyan cho admin (thay vì blue)
 */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  subMonths,
} from "date-fns";
import { vi } from "date-fns/locale";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
} from "recharts";
import { Link } from "react-router-dom";
import {
  getSystemStatistics,
  getUsers,
  getAllTransactions,
  type SystemStatistics,
  type User,
  type Transaction,
} from "../../api/admin";
import {
  FaUsers,
  FaMoneyBillWave,
  FaChartLine,
  FaClock,
  FaEye,
  FaDownload,
  FaCheckCircle,
} from "react-icons/fa";

/**
 * LOGIC TỪ CODE 9 - GIỮ NGUYÊN 100%
 */
const AdminDashboard = () => {
  const [dateRange, setDateRange] = useState<"week" | "month" | "year" | "all">(
    "month"
  );

  // Query: Lấy thống kê hệ thống
  const { data: stats, isLoading: statsLoading } = useQuery<SystemStatistics>({
    queryKey: ["admin", "statistics"],
    queryFn: async () => {
      const response = await getSystemStatistics();
      return response.data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Query: Lấy top users (theo số transactions)
  const { data: topUsers } = useQuery<User[]>({
    queryKey: ["admin", "top-users"],
    queryFn: async () => {
      const response = await getUsers({ size: 10 });
      return response.data?.content || [];
    },
  });

  // Query: Lấy recent transactions
  const { data: recentTransactions } = useQuery<Transaction[]>({
    queryKey: ["admin", "recent-transactions"],
    queryFn: async () => {
      const response = await getAllTransactions({ size: 10 });
      return response.data?.content || [];
    },
  });

  // Query: Lấy thống kê theo thời gian
  const { data: timeStats } = useQuery({
    queryKey: ["admin", "time-stats", dateRange],
    queryFn: async () => {
      const now = new Date();
      let startDate: string;
      let endDate: string;

      switch (dateRange) {
        case "week":
          startDate = format(
            startOfWeek(now, { weekStartsOn: 1 }),
            "yyyy-MM-dd"
          );
          endDate = format(endOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd");
          break;
        case "month":
          startDate = format(startOfMonth(now), "yyyy-MM-dd");
          endDate = format(endOfMonth(now), "yyyy-MM-dd");
          break;
        case "year":
          startDate = format(new Date(now.getFullYear(), 0, 1), "yyyy-MM-dd");
          endDate = format(new Date(now.getFullYear(), 11, 31), "yyyy-MM-dd");
          break;
        default:
          startDate = format(subMonths(now, 12), "yyyy-MM-dd");
          endDate = format(now, "yyyy-MM-dd");
      }

      const [usersResponse, transactionsResponse] = await Promise.all([
        getUsers({ size: 1000 }),
        getAllTransactions({ startDate, endDate, size: 1000 }),
      ]);

      const users = usersResponse.data?.content || [];
      const transactions = transactionsResponse.data?.content || [];

      // Calculate daily/weekly/monthly stats
      const chartData = calculateChartData(transactions, dateRange);

      return {
        totalUsers: users.length,
        totalTransactions: transactions.length,
        totalAmount: transactions.reduce(
          (sum: number, t: Transaction) => sum + (Number(t.amount) || 0),
          0
        ),
        chartData,
      };
    },
  });

  const calculateChartData = (
    transactions: Transaction[],
    range: "week" | "month" | "year" | "all"
  ) => {
    const data: Record<string, number> = {};

    transactions.forEach((t) => {
      const date = new Date(t.transactionDate);
      let key: string;

      switch (range) {
        case "week":
          key = format(date, "EEEE", { locale: vi });
          break;
        case "month":
          key = format(date, "dd/MM");
          break;
        case "year":
          key = format(date, "MM/yyyy");
          break;
        default:
          key = format(date, "MM/yyyy");
      }

      data[key] = (data[key] || 0) + Number(t.amount || 0);
    });

    return Object.entries(data)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => {
        if (range === "week") {
          const order = [
            "Thứ Hai",
            "Thứ Ba",
            "Thứ Tư",
            "Thứ Năm",
            "Thứ Sáu",
            "Thứ Bảy",
            "Chủ nhật",
          ];
          return order.indexOf(a.name) - order.indexOf(b.name);
        }
        return a.name.localeCompare(b.name);
      });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
  };

  const formatNumber = (val: number) =>
    new Intl.NumberFormat("vi-VN").format(val);

  return (
    <div className="space-y-6 lg:mr-32 pl-6">
      {/* Header - Giống Dashboard User */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-[10px]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-slate-800 tracking-tight">
            Bảng điều khiển Admin
          </h1>

          <div className="flex items-center gap-2 group">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>

            <span className="text-[13px] font-medium text-slate-400">
              Cập nhật lúc:
              <span className="text-slate-600 font-bold ml-1 italic group-hover:text-teal-500 transition-colors">
                {format(new Date(), "HH:mm:ss", { locale: vi })}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards - Galaxy Style, Teal Colors */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Card 1: Total Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-300 rounded-2xl p-6 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
              <FaUsers className="text-teal-400 text-xl" />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
              Tổng Users
            </p>
            <p className="text-3xl font-black text-slate-800">
              {statsLoading ? "..." : formatNumber(stats?.totalUsers || 0)}
            </p>
            <p className="text-xs text-slate-400">
              <span className="font-semibold text-green-500">
                {stats?.activeUsers || 0}
              </span>{" "}
              đang hoạt động
            </p>
          </div>
        </motion.div>

        {/* Card 2: Total Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white border border-slate-300 rounded-2xl p-6 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
              <FaMoneyBillWave className="text-teal-400 text-xl" />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
              Tổng Giao dịch
            </p>
            <p className="text-3xl font-black text-slate-800">
              {statsLoading
                ? "..."
                : formatNumber(stats?.totalTransactions || 0)}
            </p>
            <p className="text-xs text-slate-400">Trong hệ thống</p>
          </div>
        </motion.div>

        {/* Card 3: Total Amount */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-300 rounded-2xl p-6 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
              <FaChartLine className="text-teal-400 text-xl" />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
              Tổng Số dư
            </p>
            <p className="text-2xl font-black text-slate-800">
              {statsLoading
                ? "..."
                : formatCurrency(Number(stats?.totalAmount || 0))}
            </p>
            <p className="text-xs text-slate-400">Tất cả giao dịch</p>
          </div>
        </motion.div>

        {/* Card 4: Today Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white border border-slate-300 rounded-2xl p-6 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
              <FaClock className="text-teal-400 text-xl" />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
              Hôm nay
            </p>
            <p className="text-3xl font-black text-slate-800">
              {formatNumber(timeStats?.totalTransactions || 0)}
            </p>
            <p className="text-xs text-slate-400">
              {formatCurrency(timeStats?.totalAmount || 0)}
            </p>
          </div>
        </motion.div>
      </div>
      {/* Actions */}
      <div className="flex items-center gap-3 flex-wrap justify-end">
        {/* Date Range Selector */}
        <div className="flex items-center gap-2 bg-white rounded-xl p-1 border-2 border-slate-200 shadow-sm">
          <button
            onClick={() => setDateRange("week")}
            className={`px-4 py-2 rounded-3xl text-sm font-medium transition-all duration-200 ${
              dateRange === "week"
                ? "bg-teal-500 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Tuần
          </button>
          <button
            onClick={() => setDateRange("month")}
            className={`px-4 py-2 rounded-3xl text-sm font-medium transition-all duration-200 ${
              dateRange === "month"
                ? "bg-teal-500 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Tháng
          </button>
          <button
            onClick={() => setDateRange("year")}
            className={`px-4 py-2 rounded-3xl text-sm font-medium transition-all duration-200 ${
              dateRange === "year"
                ? "bg-teal-500 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Năm
          </button>
          <button
            onClick={() => setDateRange("all")}
            className={`px-4 py-2 rounded-3xl text-sm font-medium transition-all duration-200 ${
              dateRange === "all"
                ? "bg-teal-500 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Tất cả
          </button>
        </div>

        <button className="btn border-none bg-slate-200 hover:bg-orange-500 hover:text-white text-slate-700 gap-2 transition-all duration-300 shadow-sm">
          <FaDownload size={14} />
          <span className="font-bold">Export</span>
        </button>
      </div>
      {/* Transaction Trend Chart - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-slate-100/60 via-teal-100/40 to-cyan-100/40 backdrop-blur-md border border-white/40 rounded-[1.5rem] shadow-sm overflow-hidden relative"
        style={{ width: "1150px" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-200/12 via-cyan-200/12 to-blue-200/12"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-300/6 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-cyan-300/6 via-transparent to-transparent"></div>

        <div className="flex flex-col gap-4 relative z-10 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Giao dịch theo thời gian
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">
                {dateRange === "week" && "7 ngày gần đây"}
                {dateRange === "month" && "Tháng này"}
                {dateRange === "year" && "Năm nay"}
                {dateRange === "all" && "12 tháng gần đây"}
              </span>
            </div>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeStats?.chartData || []}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  interval="preserveStartEnd"
                  minTickGap={20}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  width={60}
                  tickFormatter={(value) => {
                    if (value >= 1000000)
                      return `${(value / 1000000).toFixed(1)} Tr`;
                    if (value >= 1000) return `${(value / 1000).toFixed(0)} k`;
                    return value;
                  }}
                />
                <RechartsTooltip
                  cursor={{ stroke: "#f1f5f9", strokeWidth: 2 }}
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    padding: "12px",
                  }}
                  formatter={(value: number) => [
                    formatCurrency(value),
                    "Tổng tiền",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#14b8a6"
                  strokeWidth={2}
                  strokeDasharray="8 4"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                  connectNulls={true}
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex gap-4 justify-center">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-teal-500"></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                Giao dịch
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Section: Bar Chart + Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users Statistics Bar Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-slate-100/60 via-teal-100/40 to-cyan-100/40 backdrop-blur-md border border-white/40 rounded-[1.5rem] shadow-sm overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-200/12 via-cyan-200/12 to-blue-200/12"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-300/6 via-transparent to-transparent"></div>

          <div className="relative z-10 p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-6">
              Thống kê người dùng
            </h3>

            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    {
                      name: "Tổng",
                      value: stats?.totalUsers || 0,
                      fill: "#14b8a6",
                    },
                    {
                      name: "Hoạt động",
                      value: stats?.activeUsers || 0,
                      fill: "#10b981",
                    },
                    {
                      name: "Vô hiệu",
                      value:
                        (stats?.totalUsers || 0) - (stats?.activeUsers || 0),
                      fill: "#ef4444",
                    },
                  ]}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    width={40}
                  />
                  <RechartsTooltip
                    cursor={{ fill: "rgba(241, 245, 249, 0.3)" }}
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                      padding: "12px",
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* System Status Pie Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-slate-100/60 via-teal-100/40 to-cyan-100/40 backdrop-blur-md border border-white/40 rounded-[1.5rem] shadow-sm overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-200/12 via-cyan-200/12 to-blue-200/12"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-300/6 via-transparent to-transparent"></div>

          <div className="relative z-10 p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-6">
              Trạng thái hệ thống
            </h3>

            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <ResponsiveContainer width={210} height={230}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Database", value: 99.9, fill: "#10b981" },
                        { name: "API", value: 99.5, fill: "#14b8a6" },
                        { name: "Storage", value: 98.8, fill: "#06b6d4" },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={110}
                      innerRadius={55}
                    />
                    <RechartsTooltip
                      formatter={(value: number) => `${value}% Uptime`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-slate-600 flex-1">Database</span>
                  <span className="font-medium text-slate-800">99.9%</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                  <span className="text-slate-600 flex-1">API Server</span>
                  <span className="font-medium text-slate-800">99.5%</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                  <span className="text-slate-600 flex-1">Storage</span>
                  <span className="font-medium text-slate-800">98.8%</span>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-xs text-green-600 font-semibold">
                    <FaCheckCircle />
                    <span>Tất cả dịch vụ hoạt động tốt</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top Users & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Users */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-r from-slate-100/60 via-teal-100/40 to-cyan-100/40 backdrop-blur-md border border-white/40 rounded-[1.5rem] shadow-sm overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-200/12 via-cyan-200/12 to-blue-200/12"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-300/6 via-transparent to-transparent"></div>

          <div className="relative z-10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">
                Top Người dùng
              </h3>
              <Link
                to="/admin/users"
                className="flex items-center gap-2 px-3 py-1.5 text-teal-600 hover:bg-teal-50 rounded-lg font-medium transition-colors text-sm"
              >
                <span>Xem tất cả</span>
                <FaEye size={12} />
              </Link>
            </div>

            <div className="space-y-3">
              {topUsers?.slice(0, 5).map((user, index) => (
                <Link
                  key={user.id}
                  to={`/admin/users/${user.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/50 transition-all duration-200 border border-transparent hover:border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {user.fullName?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white border-2 border-white flex items-center justify-center text-[10px] font-bold text-teal-600">
                        {index + 1}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                      user.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status === "ACTIVE" ? "Hoạt động" : "Vô hiệu"}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-r from-slate-100/60 via-teal-100/40 to-cyan-100/40 backdrop-blur-md border border-white/40 rounded-[1.5rem] shadow-sm overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-200/12 via-cyan-200/12 to-blue-200/12"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-300/6 via-transparent to-transparent"></div>

          <div className="relative z-10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">
                Giao dịch gần đây
              </h3>
              <Link
                to="/admin/transactions"
                className="flex items-center gap-2 px-3 py-1.5 text-teal-600 hover:bg-teal-50 rounded-lg font-medium transition-colors text-sm"
              >
                <span>Xem tất cả</span>
                <FaEye size={12} />
              </Link>
            </div>

            <div className="space-y-3">
              {recentTransactions?.slice(0, 5).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/50 transition-all duration-200 border border-transparent hover:border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm"
                      style={{
                        backgroundColor: `${
                          transaction.category?.color || "#14b8a6"
                        }15`,
                      }}
                    >
                      <span
                        style={{
                          color: transaction.category?.color || "#14b8a6",
                        }}
                      >
                        {transaction.category?.icon || "📁"}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">
                        {transaction.category?.name || "Không có danh mục"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatDate(transaction.transactionDate)}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-teal-600 text-sm">
                    {formatCurrency(Number(transaction.amount || 0))}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
