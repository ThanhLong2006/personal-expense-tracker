import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  format,
  startOfMonth,
  endOfMonth,
  subMonths,
  eachDayOfInterval,
} from "date-fns";
import { vi } from "date-fns/locale";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import api from "../../api/axios";
import StatCard from "../../components/ui/StatCard";
import ChartCard from "../../components/ui/ChartCard";

interface TopCategory {
  name: string;
  value: number;
  type: "income" | "expense";
  percentage: string;
}

const StatisticsPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [chartView, setChartView] = useState<"total" | "income" | "expense">(
    "total"
  );
  const [comparisonMonths, setComparisonMonths] = useState(6); // Số tháng để so sánh

  // Tính toán khoảng thời gian dựa trên tháng hiện tại
  const dateRange = useMemo(
    () => ({
      start: format(startOfMonth(currentMonth), "yyyy-MM-dd"),
      end: format(endOfMonth(currentMonth), "yyyy-MM-dd"),
    }),
    [currentMonth]
  );

  // Tính toán khoảng thời gian so sánh dựa trên các tháng đã chọn
  const comparisonDateRange = useMemo(() => {
    const endDate = endOfMonth(currentMonth);
    const startDate = startOfMonth(
      subMonths(currentMonth, comparisonMonths - 1)
    );
    return {
      start: format(startDate, "yyyy-MM-dd"),
      end: format(endDate, "yyyy-MM-dd"),
    };
  }, [currentMonth, comparisonMonths]);

  // Lấy dữ liệu giao dịch cho tháng hiện tại
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["statistics-transactions", dateRange],
    queryFn: async () => {
      const res = await api.get("/transactions", {
        params: {
          startDate: dateRange.start,
          endDate: dateRange.end,
          size: 1000,
        },
      });
      return res.data.data?.content || [];
    },
  });

  // Lấy dữ liệu giao dịch cho biểu đồ so sánh (phạm vi mở rộng)
  const { data: allTransactions, isLoading: isAllTransactionsLoading } =
    useQuery({
      queryKey: ["all-transactions", comparisonDateRange],
      queryFn: async () => {
        const res = await api.get("/transactions", {
          params: {
            startDate: comparisonDateRange.start,
            endDate: comparisonDateRange.end,
            size: 10000,
          },
        });
        return res.data.data?.content || [];
      },
    });

  // Fetch categories data (không sử dụng nhưng giữ lại cho tương lai)
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data.data || [];
    },
  });

  const stats = useMemo(() => {
    if (!transactions)
      return {
        totalTransactions: 0,
        totalIncome: 0,
        totalExpense: 0,
        dailyData: [],
        categoryData: [],
        topCategories: [] as TopCategory[],
      };

    let totalIncome = 0;
    let totalExpense = 0;
    const dailyStats: Record<string, { income: number; expense: number }> = {};
    const categoryStats: Record<string, { amount: number; type: string }> = {};

    interface Transaction {
      amount: number | string;
      category?: { type?: string; name?: string } | null;
      transactionDate: string;
    }

    (transactions as Transaction[]).forEach((t) => {
      const amount =
        typeof t.amount === "string" ? parseFloat(t.amount) : t.amount;
      const type = t.category?.type || "expense";
      const date = format(new Date(t.transactionDate), "yyyy-MM-dd");
      const categoryName = t.category?.name || "Khác";

      // Daily stats
      if (!dailyStats[date]) {
        dailyStats[date] = { income: 0, expense: 0 };
      }

      if (type === "income") {
        totalIncome += amount;
        dailyStats[date].income += amount;
        categoryStats[categoryName] = {
          amount: (categoryStats[categoryName]?.amount || 0) + amount,
          type: "income",
        };
      } else {
        totalExpense += amount;
        dailyStats[date].expense += amount;
        categoryStats[categoryName] = {
          amount: (categoryStats[categoryName]?.amount || 0) + amount,
          type: "expense",
        };
      }
    });

    // Generate daily data for chart
    const days = eachDayOfInterval({
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth),
    });

    const dailyData = days.map((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      const dayData = dailyStats[dateStr] || { income: 0, expense: 0 };
      return {
        date: format(day, "dd/MM"),
        income: dayData.income,
        expense: dayData.expense,
        negativeExpense: -dayData.expense, // Thêm dữ liệu âm cho biểu đồ chi tiêu
        net: dayData.income - dayData.expense,
      };
    });

    // Category data for pie chart (chỉ chi tiêu)
    const expenseCategories = Object.entries(categoryStats)
      .filter(([_, data]) => data.type === "expense")
      .map(([name, data]) => ({ name, value: data.amount }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    // Top categories (bao gồm cả thu nhập và chi tiêu)
    const topCategories: TopCategory[] = Object.entries(categoryStats)
      .map(([name, data]) => ({
        name,
        value: data.amount,
        type: data.type as "income" | "expense",
        percentage:
          data.type === "income"
            ? ((data.amount / totalIncome) * 100).toFixed(1)
            : ((data.amount / totalExpense) * 100).toFixed(1),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return {
      totalTransactions: transactions.length,
      totalIncome,
      totalExpense,
      dailyData,
      categoryData: expenseCategories,
      topCategories,
    };
  }, [transactions, currentMonth]);

  // Calculate monthly comparison data separately
  const monthlyComparison = useMemo(() => {
    if (!allTransactions || allTransactions.length === 0) return [];

    interface Transaction {
      amount: number | string;
      category?: { type?: string } | null;
      transactionDate: string;
    }

    const monthlyStats: Record<
      string,
      { income: number; expense: number; count: number }
    > = {};

    (allTransactions as Transaction[]).forEach((t) => {
      const amount =
        typeof t.amount === "string" ? parseFloat(t.amount) : t.amount;
      const type = t.category?.type || "expense";
      const month = format(new Date(t.transactionDate), "yyyy-MM");

      if (!monthlyStats[month]) {
        monthlyStats[month] = { income: 0, expense: 0, count: 0 };
      }

      monthlyStats[month].count += 1;

      if (type === "income") {
        monthlyStats[month].income += amount;
      } else {
        monthlyStats[month].expense += amount;
      }
    });

    // Generate monthly comparison data for selected months
    const months = [];
    for (let i = comparisonMonths - 1; i >= 0; i--) {
      const monthDate = subMonths(currentMonth, i);
      const monthKey = format(monthDate, "yyyy-MM");
      const monthData = monthlyStats[monthKey] || {
        income: 0,
        expense: 0,
        count: 0,
      };

      months.push({
        month: format(monthDate, "MM/yyyy"),
        income: monthData.income,
        expense: monthData.expense,
        count: monthData.count,
        net: monthData.income - monthData.expense,
      });
    }

    return months;
  }, [allTransactions, currentMonth, comparisonMonths]);

  // Calculate Percentage Changes based on monthlyComparison
  const percentageChanges = useMemo(() => {
    if (monthlyComparison.length < 2)
      return { income: 0, expense: 0, transactions: 0 };

    const currentIdx = monthlyComparison.length - 1;
    const lastIdx = monthlyComparison.length - 2;

    const current = monthlyComparison[currentIdx];
    const last = monthlyComparison[lastIdx];

    const calculateChange = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return ((curr - prev) / prev) * 100;
    };

    return {
      income: calculateChange(current.income, last.income),
      expense: calculateChange(current.expense, last.expense),
      transactions: calculateChange(current.count, last.count),
    };
  }, [monthlyComparison]);

  const COLORS = [
    "#6366f1",
    "#8b5cf6",
    "#06b6d4",
    "#10b981",
    "#f59e0b",
    "#ef4444",
  ];

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);

  const formatNumber = (val: number) =>
    new Intl.NumberFormat("vi-VN").format(val);

  return (
    <div className="space-y-6 pl-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-[10px]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-slate-800 tracking-tight">
            Thống kê
          </h1>

          <div className="flex items-center gap-2 group">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C4B4] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C4B4]"></span>
            </span>

            <span className="text-[13px] font-medium text-slate-400">
              Dữ liệu cập nhật:
              <span className="text-slate-600 font-bold ml-1 italic group-hover:text-[#00C4B4] transition-colors">
                {format(new Date(), "dd/MM/yyyy", { locale: vi })}
              </span>
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Month Navigation */}
          <div className="flex items-center gap-2  rounded-xl p-4 ">
            <button
              onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}
              className="flex items-center justify-center w-10 h-10 border rounded-lg bg-slate-50 hover:bg-[#00C4B4] hover:text-white transition-all duration-200 group"
            >
              <svg
                className="w-5 h-5 text-slate-600 group-hover:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="flex-1 text-center px-4">
              <div className="text-lg font-bold text-slate-900 mb-1">
                Tháng {format(currentMonth, "MM", { locale: vi })}
              </div>
              <div className="text-sm text-slate-500 font-medium">
                Năm {format(currentMonth, "yyyy", { locale: vi })}
              </div>
            </div>

            <button
              onClick={() =>
                setCurrentMonth((prev) => {
                  const nextMonth = new Date(
                    prev.getFullYear(),
                    prev.getMonth() + 1,
                    1
                  );
                  const now = new Date();
                  // Không cho phép chọn tháng trong tương lai
                  if (nextMonth <= now) {
                    return nextMonth;
                  }
                  return prev;
                })
              }
              disabled={
                format(currentMonth, "yyyy-MM") >= format(new Date(), "yyyy-MM")
              }
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-50 border hover:bg-[#00C4B4] hover:text-white transition-all duration-200 group disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-50"
            >
              <svg
                className="w-5 h-5 text-slate-600 group-hover:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isLoading || isAllTransactionsLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg text-[#00C4B4]"></div>
        </div>
      ) : (
        <>
          {/* Top Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Tổng giao dịch"
              value={formatNumber(stats.totalTransactions)}
              change={{
                value: `${Math.abs(percentageChanges.transactions).toFixed(
                  1
                )}%`,
                type:
                  percentageChanges.transactions >= 0 ? "increase" : "decrease",
              }}
              iconColor="#6366f1"
              borderColor="#6366f1"
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              }
            />

            <StatCard
              title="Tổng thu nhập"
              value={formatCurrency(stats.totalIncome)}
              change={{
                value: `${Math.abs(percentageChanges.income).toFixed(1)}%`,
                type: percentageChanges.income >= 0 ? "increase" : "decrease",
              }}
              iconColor="#10b981"
              borderColor="#10b981"
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              }
            />

            <StatCard
              title="Tổng chi tiêu"
              value={formatCurrency(stats.totalExpense)}
              change={{
                value: `${Math.abs(percentageChanges.expense).toFixed(1)}%`,
                type: percentageChanges.expense >= 0 ? "increase" : "decrease",
              }}
              iconColor="#f59e0b"
              borderColor="#f59e0b"
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              }
            />
          </div>

          {/* Charts Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Daily Trend Chart */}
                <div className="lg:col-span-2 bg-gradient-to-r from-slate-100/60 via-blue-100/40 to-purple-100/40 backdrop-blur-md border border-white/40 rounded-[1.5rem] shadow-sm overflow-hidden relative">
                  {/* Subtle Galaxy Background Effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-200/12 via-purple-200/12 to-pink-200/12"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-300/6 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-pink-300/6 via-transparent to-transparent"></div>

                  <div className="flex flex-col gap-4 relative z-10 p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                        Xu hướng thu chi
                      </h2>

                      {/* Chart View Controls */}
                      <div className="flex items-center gap-1 bg-white/50 rounded-lg p-1">
                        <button
                          onClick={() => setChartView("total")}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                            chartView === "total"
                              ? "bg-white text-slate-700 shadow-sm"
                              : "text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          Tổng
                        </button>
                        <button
                          onClick={() => setChartView("income")}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                            chartView === "income"
                              ? "bg-white text-slate-700 shadow-sm"
                              : "text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          Thu nhập
                        </button>
                        <button
                          onClick={() => setChartView("expense")}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                            chartView === "expense"
                              ? "bg-white text-slate-700 shadow-sm"
                              : "text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          Chi tiêu
                        </button>
                      </div>
                    </div>

                    {/* Chart */}
                    <div className="h-[280px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={
                            chartView === "expense"
                              ? stats.dailyData.map((d) => ({
                                  ...d,
                                  expense: -d.expense,
                                }))
                              : stats.dailyData
                          }
                        >
                          <defs>
                            <linearGradient
                              id="colorThu"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#00C4B4"
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor="#00C4B4"
                                stopOpacity={0}
                              />
                            </linearGradient>
                            <linearGradient
                              id="colorChi"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#ef4444"
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor="#ef4444"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#f1f5f9"
                          />
                          <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: "#94a3b8" }}
                            interval="preserveStartEnd"
                            minTickGap={20}
                            orientation={
                              chartView === "expense" ? "top" : "bottom"
                            }
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: "#94a3b8" }}
                            width={60}
                            domain={
                              chartView === "expense"
                                ? ["dataMin", 0]
                                : [0, "dataMax"]
                            }
                            tickFormatter={(value) => {
                              const absValue = Math.abs(value);
                              let formattedValue = "";

                              if (absValue === 0) {
                                formattedValue = "0";
                              } else if (absValue >= 1000000) {
                                formattedValue = `${(
                                  absValue / 1000000
                                ).toFixed(1)} Tr`;
                              } else if (absValue >= 1000) {
                                formattedValue = `${(absValue / 1000).toFixed(
                                  0
                                )} k`;
                              } else {
                                formattedValue = absValue.toString();
                              }

                              // Thêm dấu trừ cho chế độ chi tiêu khi value < 0
                              return chartView === "expense" && value < 0
                                ? `-${formattedValue}`
                                : formattedValue;
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
                            formatter={(value: number, name: string) => {
                              const isThu = name === "income";
                              const label = isThu ? "Thu nhập" : "Chi tiêu";
                              const color = isThu ? "#00C4B4" : "#ef4444";
                              const displayValue = Math.abs(value);

                              // Hiển thị dấu trừ cho chi tiêu khi ở chế độ expense
                              const prefix =
                                !isThu && chartView === "expense" ? "-" : "";

                              return [
                                <span
                                  key="val"
                                  style={{ color: color, fontWeight: "800" }}
                                >
                                  {prefix}
                                  {formatCurrency(displayValue)}
                                </span>,
                                <span
                                  key="lbl"
                                  style={{
                                    color: "#64748b",
                                    fontSize: "11px",
                                    fontWeight: "600",
                                  }}
                                >
                                  {label}
                                </span>,
                              ];
                            }}
                          />

                          {/* Render areas based on chart view */}
                          {(chartView === "total" ||
                            chartView === "income") && (
                            <Area
                              type="monotone"
                              dataKey="income"
                              stroke="#00C4B4"
                              strokeWidth={1}
                              strokeDasharray="8 4"
                              fillOpacity={1}
                              fill="url(#colorThu)"
                              connectNulls={true}
                              animationDuration={1000}
                            />
                          )}

                          {(chartView === "total" ||
                            chartView === "expense") && (
                            <Area
                              type="monotone"
                              dataKey="expense"
                              stroke="#ef4444"
                              strokeWidth={1}
                              strokeDasharray="8 4"
                              fillOpacity={1}
                              fill="url(#colorChi)"
                              connectNulls={true}
                              animationDuration={1000}
                            />
                          )}
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Legend - Only show for total view */}
                    {chartView === "total" && (
                      <div className="flex gap-4 justify-center">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-[#00C4B4]"></div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase">
                            Thu nhập
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-[#ef4444]"></div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase">
                            Chi tiêu
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Device/Category Distribution */}
                <div className="bg-gradient-to-r from-slate-100/60 via-blue-100/40 to-purple-100/40 backdrop-blur-md border border-white/40 rounded-[1.5rem] shadow-sm overflow-hidden relative">
                  {/* Subtle Galaxy Background Effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-200/12 via-purple-200/12 to-pink-200/12"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-300/6 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-pink-300/6 via-transparent to-transparent"></div>

                  <div className="flex flex-col gap-4 relative z-10 p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                        Chi tiêu theo danh mục
                      </h2>
                    </div>

                    {/* Content - Pie Chart Left, Legend Right */}
                    <div className="flex items-start gap-6">
                      {/* Pie Chart - Left side, centered vertically */}
                      <div className="flex-shrink-0 flex items-center justify-center h-full">
                        <ResponsiveContainer width={210} height={230}>
                          <PieChart>
                            <Pie
                              data={stats.categoryData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={110}
                              innerRadius={55}
                            >
                              {stats.categoryData.map((_, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <RechartsTooltip
                              formatter={(value: number) =>
                                formatCurrency(value)
                              }
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Legend - Right side, aligned to start */}
                      <div className="flex-1 space-y-2">
                        {stats.categoryData.slice(0, 6).map((item, index) => (
                          <div
                            key={item.name}
                            className="flex items-center gap-2 text-sm"
                          >
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: COLORS[index] }}
                            ></div>
                            <span className="text-slate-600 flex-1 truncate">
                              {item.name}
                            </span>
                            <span className="font-medium text-slate-800 flex-shrink-0">
                              {stats.totalExpense > 0
                                ? (
                                    (item.value / stats.totalExpense) *
                                    100
                                  ).toFixed(1)
                                : 0}
                              %
                            </span>
                          </div>
                        ))}

                        {stats.categoryData.length === 0 && (
                          <div className="text-center text-slate-500 py-4">
                            Chưa có dữ liệu chi tiêu
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6 items-stretch">
                {/* Top Categories Table - 2/5 width */}
                <div className="lg:col-span-2 h-full">
                  <div className="bg-gradient-to-r from-slate-100/60 via-blue-100/40 to-purple-100/40 backdrop-blur-md border border-white/40 rounded-[1.5rem] shadow-sm overflow-hidden relative h-full">
                    {/* Subtle Galaxy Background Effects */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-200/12 via-purple-200/12 to-pink-200/12"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-300/6 via-transparent to-transparent"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-pink-300/6 via-transparent to-transparent"></div>

                    <div className="flex flex-col h-full relative z-10 p-6">
                      {/* Header */}
                      <div className="mb-4">
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-3">
                          Top danh mục chi tiêu
                        </h2>
                        {/* Column Headers */}
                        <div className="flex items-center px-[20px] justify-between text-sm text-slate-500 font-medium border-b border-slate-200 pb-2">
                          <span className="flex-1">Danh mục</span>
                          <span className="flex-1 text-center">Số tiền</span>
                          <span className="flex-1 text-right">So sánh</span>
                        </div>
                      </div>

                      {/* Content - Flex grow to fill remaining space */}
                      <div className="flex-1 overflow-y-auto">
                        <div className="space-y-4">
                          {stats.topCategories.length > 0 ? (
                            stats.topCategories.map((category, index) => (
                              <div
                                key={category.name}
                                className="flex items-center justify-between py-2"
                              >
                                {/* Danh mục */}
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className="flex items-center justify-center w-8 h-8 bg-slate-100 rounded-full text-sm font-medium text-slate-600 flex-shrink-0">
                                    {index + 1}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="font-medium text-slate-900 truncate">
                                      {category.name}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                      {category.percentage}%
                                    </p>
                                  </div>
                                </div>

                                {/* Số tiền - ở giữa */}
                                <div className="flex-1 text-center">
                                  <p className="font-medium text-slate-900 text-sm">
                                    {formatCurrency(category.value)}
                                  </p>
                                </div>

                                {/* So sánh - ở cuối */}
                                <div className="flex-1 text-right">
                                  <div className="w-16 bg-slate-200 rounded-full h-2 ml-auto">
                                    <div
                                      className={`h-2 rounded-full ${
                                        category.type === "income"
                                          ? "bg-[#10b981]"
                                          : "bg-[#ef4444]"
                                      }`}
                                      style={{
                                        width: `${Math.min(
                                          parseFloat(category.percentage),
                                          100
                                        )}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center text-slate-500 py-8">
                              Chưa có dữ liệu giao dịch
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monthly Comparison - 3/5 width */}
                <div className="lg:col-span-3 h-full">
                  <div className="bg-gradient-to-r from-slate-100/60 via-blue-100/40 to-purple-100/40 backdrop-blur-md border border-white/40 rounded-[1.5rem] shadow-sm overflow-visible relative h-full">
                    {/* Subtle Galaxy Background Effects */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-200/12 via-purple-200/12 to-pink-200/12"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-300/6 via-transparent to-transparent"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-pink-300/6 via-transparent to-transparent"></div>

                    <div className="flex flex-col h-full relative z-10 p-6">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                          So sánh theo tháng
                        </h2>

                        {/* Month Selection Controls */}
                        <div className="flex items-center gap-1 bg-white/50 rounded-lg p-1">
                          <button
                            onClick={() => setComparisonMonths(3)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                              comparisonMonths === 3
                                ? "bg-white text-slate-700 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                            }`}
                          >
                            3 tháng
                          </button>
                          <button
                            onClick={() => setComparisonMonths(6)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                              comparisonMonths === 6
                                ? "bg-white text-slate-700 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                            }`}
                          >
                            6 tháng
                          </button>
                          <button
                            onClick={() => setComparisonMonths(12)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                              comparisonMonths === 12
                                ? "bg-white text-slate-700 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                            }`}
                          >
                            12 tháng
                          </button>
                        </div>
                      </div>

                      {/* Chart - Flex grow to fill remaining space */}
                      <div className="flex-1 min-h-0 relative pl-16 overflow-visible">
                        {monthlyComparison.length > 0 ? (
                          <div className="h-full flex flex-col">
                            {/* Chart Area */}
                            <div className="flex-1 flex items-end justify-center gap-4 px-4 pb-4">
                              {monthlyComparison.map((item, index) => {
                                const maxValue = Math.max(
                                  ...monthlyComparison.map((m) =>
                                    Math.max(m.income, m.expense)
                                  )
                                );
                                const incomeHeight =
                                  (item.income / maxValue) * 200;
                                const expenseHeight =
                                  (item.expense / maxValue) * 200;

                                return (
                                  <div
                                    key={index}
                                    className="flex flex-col items-center gap-2 min-w-0 flex-1 group"
                                  >
                                    {/* Bars Container */}
                                    <div className="flex items-end gap-1 h-52 relative">
                                      {/* Income Bar */}
                                      <div className="relative">
                                        <div
                                          className="bg-gradient-to-t from-green-500 to-green-400 w-8 rounded-t-sm transition-all duration-300 hover:from-green-600 hover:to-green-500 cursor-pointer"
                                          style={{
                                            height: `${incomeHeight}px`,
                                            minHeight:
                                              item.income > 0 ? "8px" : "0px",
                                          }}
                                        />
                                      </div>

                                      {/* Expense Bar */}
                                      <div className="relative">
                                        <div
                                          className="bg-gradient-to-t from-red-500 to-red-400 w-8 rounded-t-sm transition-all duration-300 hover:from-red-600 hover:to-red-500 cursor-pointer"
                                          style={{
                                            height: `${expenseHeight}px`,
                                            minHeight:
                                              item.expense > 0 ? "8px" : "0px",
                                          }}
                                        />
                                      </div>

                                      {/* Combined Tooltip for both bars */}
                                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 pointer-events-none">
                                        <div
                                          className="bg-white rounded-lg shadow-xl border border-gray-200 p-3 min-w-[180px] whitespace-nowrap"
                                          style={{ marginTop: "-5px" }}
                                        >
                                          {/* Date */}
                                          <div className="text-center text-gray-800 font-semibold text-sm mb-2">
                                            {item.month}
                                          </div>

                                          {/* Income */}
                                          <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-1">
                                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                              <span className="text-xs text-gray-600">
                                                Thu nhập
                                              </span>
                                            </div>
                                            <span className="text-sm font-medium text-green-600">
                                              {item.income.toLocaleString(
                                                "vi-VN"
                                              )}{" "}
                                              đ
                                            </span>
                                          </div>

                                          {/* Expense */}
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                              <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                              <span className="text-xs text-gray-600">
                                                Chi tiêu
                                              </span>
                                            </div>
                                            <span className="text-sm font-medium text-red-600">
                                              {item.expense.toLocaleString(
                                                "vi-VN"
                                              )}{" "}
                                              đ
                                            </span>
                                          </div>

                                          {/* Arrow pointing down */}
                                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-200 mt-px"></div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Month Label */}
                                    <div className="text-xs font-medium text-slate-600 text-center">
                                      {item.month}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Y-axis Labels */}
                            <div className="absolute left-0 top-0 h-52 flex flex-col justify-between text-xs text-slate-500 w-14">
                              {[0, 1, 2, 3, 4, 5].map((i) => {
                                const maxValue = Math.max(
                                  ...monthlyComparison.map((m) =>
                                    Math.max(m.income, m.expense)
                                  )
                                );
                                const value = (maxValue / 5) * (5 - i);
                                return (
                                  <div key={i} className="text-right pr-2">
                                    {value > 0
                                      ? `${(value / 1000000).toFixed(1)}Tr`
                                      : "0"}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center text-slate-500">
                              <div className="text-lg mb-2">📊</div>
                              <div className="text-sm">Đang tải dữ liệu...</div>
                              {isAllTransactionsLoading && (
                                <div className="loading loading-spinner loading-sm mt-2"></div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Custom Legend */}
                      <div className="flex gap-6 justify-center mt-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            THU NHẬP
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            CHI TIÊU
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StatisticsPage;
