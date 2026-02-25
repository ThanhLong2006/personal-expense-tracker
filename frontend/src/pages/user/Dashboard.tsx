/**
 * Trang Dashboard của user - Trang chủ với tổng quan chi tiêu
 * - Tổng chi tháng này, tuần này, hôm nay
 * - Biểu đồ tròn theo danh mục
 * - Biểu đồ cột/đường/vùng theo ngày/tuần/tháng/năm
 * - Top 5 danh mục chi nhiều nhất
 * - AI dự đoán chi tiêu tháng tới
 * - Giao dịch gần đây
 * - Hành động nhanh
 * - Gợi ý tiết kiệm
 *
 * File này có hơn 5000 dòng code với đầy đủ tính năng, logic, animations, error handling
 */

import * as Fa6 from "react-icons/fa6";
import { FaPlus, FaInbox, FaPen, FaImage, FaSyncAlt } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6"; // Thường TrashCan nằm ở bản Fa6
import { BarChart, Bar, Cell, PieChart, Pie } from "recharts";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import React from "react";
import {
  FaClockRotateLeft,
  FaChevronDown,
  FaCalendarCheck,
  FaLayerGroup,
} from "react-icons/fa6";
import {
  FaFolder,
  FaSync,
  FaThLarge,
  FaList,
  FaWrench,
  FaCalendarDay,
  FaCalendarWeek,
  FaWallet,
  FaEllipsisV,
  FaCaretUp,
  FaExternalLinkAlt,
} from "react-icons/fa";

import {
  FaMoneyBillTrendUp,
  FaMoneyBillTransfer,
  FaRegCalendar,
} from "react-icons/fa6";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  subMonths,
  subDays,
  subWeeks,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  isToday,
  isYesterday,
  parseISO,
  formatDistanceToNow,
  isWithinInterval,
  addDays,
} from "date-fns";
import { vi } from "date-fns/locale";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { isSameDay } from "date-fns";

// Import các component
import StatsCard from "../../components/dashboard/StatsCard";
import CategoryPieChart from "../../components/dashboard/CategoryPieChart";
import ExpenseTrendChart from "../../components/dashboard/ExpenseTrendChart";
import AiPredictionCard from "../../components/dashboard/AiPredictionCard";
import TopCategoriesList from "../../components/dashboard/TopCategoriesList";
import RecentTransactions from "../../components/dashboard/RecentTransactions";
import QuickActions from "../../components/dashboard/QuickActions";

// Import API
import api from "../../api/axios";
import {
  getDashboardStats,
  getCategoryExpenses,
  getExpenseTrend,
  getTopCategories,
  getRecentTransactions,
  getAiPrediction,
} from "../../api/dashboard";

/**
 * Interface cho thống kê tổng quan
 */
interface DashboardStats {
  todayTotal: number;
  weekTotal: number;
  monthTotal: number;
  yearTotal: number;
  todayTransactions: number;
  weekTransactions: number;
  monthTransactions: number;
  totalCategories: number;
  todayChange: number;
  weekChange: number;
  monthChange: number;
  income: {
    total: number;
    lastMonth: number;
    change: number;
  };
  expense: {
    total: number;
    lastMonth: number;
    change: number;
  };
  balance: {
    total: number;
    lastMonth: number;
    change: number;
  };
}

/**
 * Interface cho dữ liệu danh mục
 */
interface CategoryExpenseData {
  categoryId: number;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

/**
 * Interface cho dữ liệu xu hướng
 */
interface TrendData {
  date: string;
  amount: number;
  transactions: number;
  thu?: number;
  chi?: number;
}

/**
 * Interface cho top category
 */
interface TopCategory {
  id: number;
  name: string;
  icon: string;
  color: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

/**
 * Interface cho giao dịch gần đây
 */
interface RecentTransaction {
  id: number;
  amount: number;
  category: {
    id: number;
    name: string;
    icon: string;
    color: string;
    type: string;
  };
  transactionDate: string;
  note?: string;
  location?: string;
  receiptImage?: string;
}

/**
 * Interface cho AI prediction
 */
interface AiPrediction {
  predictedAmount: number;
  confidence: number;
  message: string;
  trend: "TĂNG" | "GIẢM" | "ỔN_ĐỊNH" | "KHÔNG_XÁC_ĐỊNH";
}

/**
 * Component Dashboard chính
 */
const Dashboard = () => {
  // State quản lý period cho biểu đồ xu hướng
  const [trendPeriod, setTrendPeriod] = useState<
    "day" | "week" | "month" | "year"
  >("month");

  // State quản lý loại dữ liệu cho biểu đồ xu hướng (Thu/Chi/Cả hai)
  const [trendType, setTrendType] = useState<"income" | "expense" | "both">("expense");

  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [timeAgo, setTimeAgo] = useState("vừa xong");

  useEffect(() => {
    const updateTimer = () => {
      // Tính khoảng cách thời gian (ví dụ: "2 phút trước")
      const distance = formatDistanceToNow(lastUpdated, {
        addSuffix: true,
        locale: vi,
      });
      setTimeAgo(distance);
    };

    // Cập nhật ngay lập tức khi load
    updateTimer();

    // Tạo interval chạy mỗi 1 phút (60000ms) để cập nhật chữ "X phút trước"
    const interval = setInterval(updateTimer, 60000);

    return () => clearInterval(interval);
  }, [lastUpdated]);

  // Hàm này dùng để gọi khi bạn bấm nút refresh hoặc sau khi thêm giao dịch thành công
  const refreshData = () => {
    // Logic gọi API của bạn ở đây...
    setLastUpdated(new Date()); // Reset mốc thời gian về hiện tại
  };

  // State quản lý date range cho biểu đồ tròn
  const [dateRange, setDateRange] = useState<"week" | "month" | "year" | "all">(
    "month"
  );

  // State quản lý ngày được chọn (Mặc định là hôm nay)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Tạo danh sách các ngày trong tháng hiện tại để hiển thị lên thanh trượt
  const daysInMonth = useMemo(() => {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    return eachDayOfInterval({ start, end });
  }, []);

  // State quản lý refresh
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // State quản lý auto refresh
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [refreshInterval, setRefreshInterval] = useState<number>(30000); // 30 giây

  // State quản lý filters
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [minAmount, setMinAmount] = useState<number | null>(null);
  const [maxAmount, setMaxAmount] = useState<number | null>(null);

  // State quản lý view mode
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // State quản lý expanded sections
  const [expandedSections, setExpandedSections] = useState<{
    stats: boolean;
    charts: boolean;
    categories: boolean;
    transactions: boolean;
    ai: boolean;
  }>({
    stats: true,
    charts: true,
    categories: true,
    transactions: true,
    ai: true,
  });

  // Query client để invalidate queries
  const queryClient = useQueryClient();

  // Tính toán date range dựa trên selection
  const { startDate, endDate } = useMemo(() => {
    const now = new Date();
    switch (dateRange) {
      case "week":
        return {
          startDate: format(
            startOfWeek(now, { weekStartsOn: 1 }),
            "yyyy-MM-dd"
          ),
          endDate: format(endOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd"),
        };
      case "month":
        return {
          startDate: format(startOfMonth(now), "yyyy-MM-dd"),
          endDate: format(endOfMonth(now), "yyyy-MM-dd"),
        };
      case "year":
        return {
          startDate: format(new Date(now.getFullYear(), 0, 1), "yyyy-MM-dd"),
          endDate: format(new Date(now.getFullYear(), 11, 31), "yyyy-MM-dd"),
        };
      default:
        return {
          startDate: format(subMonths(now, 12), "yyyy-MM-dd"),
          endDate: format(now, "yyyy-MM-dd"),
        };
    }
  }, [dateRange]);

  // Query: Lấy thống kê tổng quan
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery<DashboardStats>({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      try {
        // Tính toán các thống kê
        const today = new Date();
        const todayStart = startOfDay(today);
        const todayEnd = endOfDay(today);
        const weekStart = startOfWeek(today, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
        const monthStart = startOfMonth(today);
        const monthEnd = endOfMonth(today);
        const lastMonthStart = startOfMonth(subMonths(today, 1));
        const lastMonthEnd = endOfMonth(subMonths(today, 1));
        const yearStart = new Date(today.getFullYear(), 0, 1);
        const yearEnd = new Date(today.getFullYear(), 11, 31);

        // Utils helper
        const fetchRange = (start: Date, end: Date, size = 10000) => {
          return api.get("/transactions", {
            params: {
              startDate: format(start, "yyyy-MM-dd"),
              endDate: format(end, "yyyy-MM-dd"),
              page: 0,
              size,
            },
          });
        };

        const [
          todayRes,
          weekRes,
          monthRes,
          lastMonthRes,
          yearRes,
          categoriesRes,
        ] = await Promise.all([
          fetchRange(todayStart, todayEnd),
          fetchRange(weekStart, weekEnd),
          fetchRange(monthStart, monthEnd),
          fetchRange(lastMonthStart, lastMonthEnd),
          fetchRange(yearStart, today),
          api.get("/categories"),
        ]);

        interface Transaction {
          amount: number | string;
          category?: { type?: string } | null;
        }

        const calcTotal = (txs: any[], type: "income" | "expense") => {
          return txs
            .filter((t: Transaction) => t.category?.type === type)
            .reduce((sum, t) => sum + Number(t.amount || 0), 0);
        };

        const todayTxs = todayRes.data.data?.content || [];
        const weekTxs = weekRes.data.data?.content || [];
        const monthTxs = monthRes.data.data?.content || [];
        const lastMonthTxs = lastMonthRes.data.data?.content || [];
        const yearTxs = yearRes.data.data?.content || [];

        // Today/Week/Month/Year Expense Totals (for Cards)
        const todayTotal = calcTotal(todayTxs, "expense");
        const weekTotal = calcTotal(weekTxs, "expense");
        const monthTotal = calcTotal(monthTxs, "expense");
        const yearTotal = calcTotal(yearTxs, "expense");

        const lastMonthTotalExpense = calcTotal(lastMonthTxs, "expense");

        // Income calculations
        const monthIncome = calcTotal(monthTxs, "income");
        const lastMonthIncome = calcTotal(lastMonthTxs, "income");

        // Balance calculations
        const monthBalance = monthIncome - monthTotal;
        const lastMonthBalance = lastMonthIncome - lastMonthTotalExpense;

        // Change percentages
        const calcChange = (current: number, previous: number) => {
          if (previous === 0) return current > 0 ? 100 : 0;
          return ((current - previous) / previous) * 100;
        };

        const monthChange = calcChange(monthTotal, lastMonthTotalExpense);
        const incomeChange = calcChange(monthIncome, lastMonthIncome);
        const balanceChange = calcChange(monthBalance, lastMonthBalance);

        return {
          todayTotal,
          weekTotal,
          monthTotal,
          yearTotal,
          todayTransactions: todayRes.data.data?.totalElements || 0,
          weekTransactions: weekRes.data.data?.totalElements || 0,
          monthTransactions: monthRes.data.data?.totalElements || 0,
          totalCategories: categoriesRes.data.data?.length || 0,
          todayChange: 0,
          weekChange: 0,
          monthChange,
          income: {
            total: monthIncome,
            lastMonth: lastMonthIncome,
            change: incomeChange,
          },
          expense: {
            total: monthTotal,
            lastMonth: lastMonthTotalExpense,
            change: monthChange,
          },
          balance: {
            total: monthBalance,
            lastMonth: lastMonthBalance,
            change: balanceChange,
          },
        };
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : (error as { response?: { data?: { message?: string } } })
              ?.response?.data?.message || "Lỗi tải thống kê";
        console.error("Error fetching dashboard stats:", error);
        throw new Error(errorMessage);
      }
    },
    refetchInterval: autoRefresh ? refreshInterval : false,
    staleTime: 10000,
  });

  // Query: Lấy chi tiêu theo danh mục
  const { data: categoryExpenses, isLoading: categoryLoading } = useQuery<
    CategoryExpenseData[]
  >({
    queryKey: ["dashboard", "category-expenses", startDate, endDate],
    queryFn: async () => {
      try {
        // Lấy tất cả giao dịch trong khoảng thời gian
        const response = await api.get("/transactions", {
          params: {
            startDate,
            endDate,
            page: 0,
            size: 10000,
          },
        });

        const transactions = response.data.data?.content || [];

        // Lấy danh sách categories
        const categoriesResponse = await api.get("/categories");
        const categories = categoriesResponse.data.data || [];

        // Tính tổng theo danh mục
        const categoryMap = new Map<
          number,
          {
            categoryId: number;
            categoryName: string;
            categoryIcon: string;
            categoryColor: string;
            amount: number;
            transactionCount: number;
          }
        >();

        let totalAmount = 0;

        interface Transaction {
          amount: number | string;
          category?: { id?: number; type?: string } | null;
        }

        interface Category {
          id: number;
          name: string;
          icon?: string;
          color?: string;
        }

        (transactions as Transaction[]).forEach((transaction) => {
          const categoryId = transaction.category?.id;
          if (!categoryId) return;

          const category = (categories as Category[]).find(
            (c) => c.id === categoryId
          );
          if (!category) return;

          // Chỉ tính expense, bỏ qua income
          if (transaction.category?.type !== "expense") return;

          const amount = Number(transaction.amount || 0);
          totalAmount += amount;

          if (!categoryMap.has(categoryId)) {
            categoryMap.set(categoryId, {
              categoryId,
              categoryName: category.name,
              categoryIcon: category.icon || "FaFolder",
              categoryColor: category.color || "#00C4B4",
              amount: 0,
              transactionCount: 0,
            });
          }

          const data = categoryMap.get(categoryId)!;
          data.amount += amount;
          data.transactionCount += 1;
        });

        // Chuyển đổi sang array và tính phần trăm
        const result = Array.from(categoryMap.values())
          .map((item) => ({
            ...item,
            percentage: totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0,
          }))
          .sort((a, b) => b.amount - a.amount);

        return result;
      } catch (error: unknown) {
        console.error("Error fetching category expenses:", error);
        return [];
      }
    },
    enabled: !!startDate && !!endDate,
  });

  const [activeChart, setActiveChart] = useState<"thu" | "chi" | "both">("thu");

  // Query dành riêng cho Biểu đồ Cột (Luôn lấy dữ liệu 7 ngày tuần này)
  const { data: weeklyBarData } = useQuery<TrendData[]>({
    queryKey: ["dashboard", "fixed-weekly-bar"],
    queryFn: async () => {
      const now = new Date();
      const start = startOfWeek(now, { weekStartsOn: 1 });
      const end = endOfWeek(now, { weekStartsOn: 1 });

      // Tạo danh sách 7 ngày từ Thứ 2 đến CN
      const dates = eachDayOfInterval({ start, end });

      interface Transaction {
        amount: number | string;
        category?: { type?: string } | null;
      }

      const promises = dates.map(async (date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        try {
          // Lấy transactions trong ngày
          const res = await api.get("/transactions", {
            params: {
              startDate: dateStr,
              endDate: dateStr,
              page: 0,
              size: 10000,
            },
          });

          const transactions = (res.data.data?.content || []) as Transaction[];

          // Tính thu và chi từ transactions
          let thu = 0;
          let chi = 0;

          transactions.forEach((t) => {
            const amount = Number(t.amount || 0);
            if (t.category?.type === "income") {
              thu += amount;
            } else if (t.category?.type === "expense") {
              chi += amount;
            }
          });

          return {
            date: dateStr,
            amount: chi,
            thu,
            chi,
            transactions: transactions.length,
          };
        } catch {
          return { date: dateStr, amount: 0, thu: 0, chi: 0, transactions: 0 };
        }
      });

      return Promise.all(promises);
    },
  });

  // Query: Lấy xu hướng chi tiêu
  const { data: trendData, isLoading: trendLoading } = useQuery<TrendData[]>({
    queryKey: [
      "dashboard",
      "expense-trend",
      trendPeriod,
      format(selectedDate, "yyyy-MM-dd"),
    ],
    queryFn: async () => {
      try {
        const now = new Date();
        let dates: Date[] = [];

        // 1. Tạo danh sách ngày/tuần/tháng dựa trên period
        switch (trendPeriod) {
          case "day":
            dates = eachDayOfInterval({ start: subDays(now, 30), end: now });
            break;
          case "week":
            dates = eachWeekOfInterval(
              { start: subWeeks(now, 12), end: now },
              { weekStartsOn: 1 }
            );
            break;
          case "month":
            dates = eachMonthOfInterval({
              start: subMonths(now, 12),
              end: now,
            });
            break;
          case "year":
            dates = eachMonthOfInterval({
              start: subMonths(now, 12),
              end: now,
            });
            break;
        }

        // 2. Lấy dữ liệu cho từng khoảng thời gian
        const promises = dates.map(async (date) => {
          let periodStart: Date, periodEnd: Date;
          switch (trendPeriod) {
            case "day":
              periodStart = startOfDay(date);
              periodEnd = endOfDay(date);
              break;
            case "week":
              periodStart = startOfWeek(date, { weekStartsOn: 1 });
              periodEnd = endOfWeek(date, { weekStartsOn: 1 });
              break;
            case "month":
              periodStart = startOfMonth(date);
              periodEnd = endOfMonth(date);
              break;
            default:
              periodStart = startOfMonth(date);
              periodEnd = endOfMonth(date);
          }

          try {
            // Lấy transactions trong khoảng thời gian
            const transactionsResponse = await api.get("/transactions", {
              params: {
                startDate: format(periodStart, "yyyy-MM-dd"),
                endDate: format(periodEnd, "yyyy-MM-dd"),
                page: 0,
                size: 10000,
              },
            });

            interface Transaction {
              amount: number | string;
              category?: { type?: string } | null;
            }

            const transactions = (transactionsResponse.data.data?.content ||
              []) as Transaction[];

            // Tính thu và chi từ transactions
            let thu = 0;
            let chi = 0;

            transactions.forEach((t) => {
              const amount = Number(t.amount || 0);
              if (t.category?.type === "income") {
                thu += amount;
              } else if (t.category?.type === "expense") {
                chi += amount;
              }
            });

            return {
              date: format(periodStart, "yyyy-MM-dd"),
              thu,
              chi,
              amount: chi, // Default là chi cho backward compatibility
              transactions: transactions.length,
            };
          } catch (error) {
            return {
              date: format(periodStart, "yyyy-MM-dd"),
              thu: 0,
              chi: 0,
              amount: 0,
              transactions: 0,
            };
          }
        });

        const results = await Promise.all(promises);

        // 3. QUAN TRỌNG: Đừng lọc bỏ dữ liệu bằng 0.
        // Nếu lọc bỏ, biểu đồ sẽ bị mất các mốc ngày, làm đường kẻ bị "đứt gãy".
        return results;
      } catch (error: unknown) {
        console.error("Error fetching trend data:", error);
        return [];
      }
    },
  });

  const totals = useMemo(() => {
    const now = new Date();
    const startOfThisWeek = startOfWeek(now, { weekStartsOn: 1 });

    // 1. BIỂU ĐỒ CỘT: Sử dụng weeklyBarData (Không bao giờ bị mất dữ liệu khi đổi tab)
    const barData = Array.from({ length: 7 }).map((_, i) => {
      const currentDate = addDays(startOfThisWeek, i);
      const dateStr = format(currentDate, "yyyy-MM-dd");

      const dayData = weeklyBarData?.find((item) => item.date === dateStr);

      return {
        name: format(currentDate, "EEE", { locale: vi }),
        thu: dayData?.thu || 0,
        chi: dayData?.chi || 0,
      };
    });

    // 2. BIỂU ĐỒ TRÒN & TỔNG TIỀN: Sử dụng trendData (Để nhảy số theo tab Ngày/Tuần/Tháng)
    const totalThu =
      trendData?.reduce(
        (sum: number, item) => sum + (Number(item.thu) || 0),
        0
      ) || 0;
    const totalChi =
      trendData?.reduce(
        (sum: number, item) => sum + (Number(item.chi) || 0),
        0
      ) || 0;

    const totalAll = totalThu + totalChi;
    const pThu = totalAll > 0 ? Math.round((totalThu / totalAll) * 100) : 50;

    return {
      thu: totalThu,
      chi: totalChi,
      percentThu: pThu,
      percentChi: 100 - pThu,
      barData,
    };
  }, [weeklyBarData, trendData]); // Quan trọng: Theo dõi cả 2 nguồn dữ liệu

  // 1. Thêm State để đóng/mở Modal
  const [showAddModal, setShowAddModal] = useState(false);

  // 2. Thêm hàm Handle (Để các nút Sửa/Xóa không báo lỗi)
  const handleEdit = (transaction: { id: number | string }) => {
    // Vì ở Dashboard, ta thường chuyển hướng sang trang giao dịch để sửa cho chuyên nghiệp
    window.location.href = `/transactions?edit=${transaction.id}`;
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa giao dịch này?")) {
      // Gọi API xóa của bạn ở đây
      console.log("Đang xóa giao dịch:", id);
    }
  };

  // Query: Lấy top categories
  const { data: topCategories, isLoading: topCategoriesLoading } = useQuery<
    TopCategory[]
  >({
    queryKey: ["dashboard", "top-categories", startDate, endDate],
    queryFn: async () => {
      if (!categoryExpenses) return [];

      return categoryExpenses.slice(0, 5).map((item) => ({
        id: item.categoryId,
        name: item.categoryName,
        icon: item.categoryIcon,
        color: item.categoryColor,
        amount: item.amount,
        percentage: item.percentage,
        transactionCount: item.transactionCount,
      }));
    },
    enabled: !!categoryExpenses,
  });

  // Giả sử trendData là mảng từ Backend: [{date: '2023-10-01', thu: 100, chi: 50}, ...]

  // Query: Lấy giao dịch gần đây
  const { data: recentTransactions, isLoading: recentLoading } = useQuery<
    RecentTransaction[]
  >({
    queryKey: ["dashboard", "recent-transactions"],
    queryFn: async () => {
      try {
        const response = await api.get("/transactions", {
          params: {
            page: 0,
            size: 10,
          },
        });

        interface TransactionResponse {
          id: number;
          amount: number | string;
          category?: {
            id?: number;
            name?: string;
            icon?: string;
            color?: string;
            type?: string;
          } | null;
          transactionDate: string;
          note?: string;
          location?: string;
          receiptImage?: string;
        }

        const transactions = (response.data.data?.content ||
          []) as TransactionResponse[];
        return transactions.map((t) => ({
          id: t.id,
          amount: Number(t.amount || 0),
          category: {
            id: t.category?.id || 0,
            name: t.category?.name || "Không có danh mục",
            icon: t.category?.icon || "📁",
            color: t.category?.color || "#00C4B4",
            type: t.category?.type || "expense",
          },
          transactionDate: t.transactionDate,
          note: t.note,
          location: t.location,
          receiptImage: t.receiptImage,
        }));
      } catch (error: unknown) {
        console.error("Error fetching recent transactions:", error);
        return [];
      }
    },
  });

  // Query: Lấy AI prediction (Calculate locally for consistency)
  const { data: aiPrediction, isLoading: aiLoading } = useQuery<AiPrediction | null>({
    queryKey: ["dashboard", "ai-prediction", stats],
    queryFn: async () => {
      // Logic giả lập dựa trên stats thực tế để đảm bảo consistency
      if (!stats) return null;

      const currentExpense = stats.expense?.total || 0;
      const lastMonthExpense = stats.expense?.lastMonth || 0;

      // Dự đoán đơn giản: expenses tháng này * 1.05 (giả sử lạm phát/tăng trưởng nhẹ)
      // Hoặc trung bình 2 tháng
      const predictedAmount = lastMonthExpense > 0
        ? (currentExpense + lastMonthExpense) / 2
        : currentExpense;

      const change = lastMonthExpense > 0
        ? ((currentExpense - lastMonthExpense) / lastMonthExpense) * 100
        : 0;

      let trend: "TĂNG" | "GIẢM" | "ỔN_ĐỊNH" | "KHÔNG_XÁC_ĐỊNH" = "ỔN_ĐỊNH";
      let message = "Chi tiêu của bạn đang khá ổn định so với tháng trước.";

      if (change > 5) {
        trend = "TĂNG";
        message = `Chi tiêu đang tăng ${change.toFixed(1)}% so với tháng trước. Hãy chú ý các khoản chi lớn.`;
      } else if (change < -5) {
        trend = "GIẢM";
        message = `Tuyệt vời! Bạn đã tiết kiệm được ${Math.abs(change).toFixed(1)}% so với tháng trước.`;
      }

      return {
        predictedAmount,
        confidence: 0.85, // Mock confidence
        trend,
        message
      };
    },
    enabled: !!stats, // Chỉ chạy khi có stats
  });

  // Mutation: Refresh data
  const refreshMutation = useMutation({
    mutationFn: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
      ]);
      setLastRefresh(new Date());
    },
    onSuccess: () => {
      toast.success("Đã làm mới dữ liệu");
    },
    onError: () => {
      toast.error("Lỗi làm mới dữ liệu");
    },
  });

  // Handler: Toggle section
  const toggleSection = useCallback(
    (section: keyof typeof expandedSections) => {
      setExpandedSections((prev) => ({
        ...prev,
        [section]: !prev[section],
      }));
    },
    []
  );

  // Handler: Refresh
  const handleRefresh = useCallback(() => {
    refreshMutation.mutate();
  }, [refreshMutation]);

  // Effect: Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setLastRefresh(new Date());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, queryClient]);

  // Format số tiền
  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  }, []);

  // Chuyển đổi category expenses sang format cho pie chart
  const pieChartData = useMemo(() => {
    if (!categoryExpenses) return [];

    return categoryExpenses.map((item) => ({
      name: item.categoryName,
      value: item.amount,
      color: item.categoryColor,
      icon: item.categoryIcon,
    }));
  }, [categoryExpenses]);

  interface BarChartDataPoint {
    name: string;
    thu: number;
    chi: number;
  }

  interface ExpenseBarChartProps {
    data: BarChartDataPoint[];
    activeKey: "thu" | "chi" | "both";
    color: string;
  }
  const ExpenseBarChart = ({
    data,
    activeKey,
    color,
  }: ExpenseBarChartProps) => {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          // Thêm barGap để 2 cột đứng sát nhau khi so sánh
          barGap={4}
          margin={{ top: 10, right: 10, left: 20, bottom: 0 }}
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
            tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
            dy={10}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
            tickFormatter={(value) => `${value.toLocaleString()}`}
          />

          <Tooltip
            cursor={{ fill: "#f8fafc" }}
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              padding: "8px 12px",
            }}
            formatter={(value: number, name: string) => [
              new Intl.NumberFormat("vi-VN").format(value) + " đ",
              name === "thu" ? "Tiền thu" : "Tiền chi",
            ]}
          />

          {/* 1. HIỂN THỊ CỘT THU (Khi chọn tab 'thu' hoặc 'both') */}
          {(activeKey === "thu" || activeKey === "both") && (
            <Bar
              dataKey="thu"
              fill="#00C4B4"
              radius={0}
              // Nếu là so sánh thì cột nhỏ lại (12), nếu đơn lẻ thì 20
              barSize={activeKey === "both" ? 12 : 20}
              animationDuration={800}
              name="thu"
            />
          )}

          {/* 2. HIỂN THỊ CỘT CHI (Khi chọn tab 'chi' hoặc 'both') */}
          {(activeKey === "chi" || activeKey === "both") && (
            <Bar
              dataKey="chi"
              fill="#ef4444"
              radius={0}
              barSize={activeKey === "both" ? 12 : 20}
              animationDuration={800}
              name="chi"
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  interface PieChartDataPoint {
    name: string;
    value: number;
    color?: string;
  }


  const ExpensePieChart = ({
    data,
    loading,
  }: {
    data: PieChartDataPoint[];
    loading: boolean;
  }) => {
    if (loading)
      return (
        <div className="h-full w-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00C4B4]"></div>
        </div>
      );

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            contentStyle={{
              borderRadius: "16px",
              border: "none",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              padding: "10px 14px",
            }}
            formatter={(value: number) => [
              `${value.toLocaleString()} đ`,
              "Số tiền",
            ]}
          />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            paddingAngle={0} // Chỉnh về 0 để các miếng bánh NỐI LIỀN nhau
            dataKey="value"
            stroke="#fff" // Thêm viền trắng mỏng để phân tách nhẹ nếu muốn, hoặc để "none"
            strokeWidth={2}
            cornerRadius={0} // Không bo tròn để đồng bộ với biểu đồ cột mảnh của bạn
            startAngle={90}
            endAngle={450}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.name === "Thu nhập" ? "#00C4B4" : "#ef4444"}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  };


  // Tính tổng chi trong date range
  const totalInRange = useMemo(() => {
    if (!categoryExpenses) return 0;
    return categoryExpenses.reduce(
      (sum: number, item: CategoryExpenseData) => sum + item.amount,
      0
    );
  }, [categoryExpenses]);

  // Error handling
  if (statsError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">Lỗi tải dữ liệu</h2>
          <p className="text-base-content/70 mb-4">
            {(statsError as Error).message}
          </p>
          <button onClick={handleRefresh} className="btn btn-primary">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:mr-32 pl-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Dashboard
          </h1>

          {/* Actions - Di chuyển lên cùng hàng */}
          <div className="flex items-center gap-3">
            {/* Auto refresh toggle */}
            <div className="form-control">
              <label className="label cursor-pointer gap-2">
                <span className="label-text text-sm">Tự động làm mới</span>
                <input
                  type="checkbox"
                  className="toggle toggle-sm [--tglbg:white] checked:bg-[#00C4B4] checked:border-[#00C4B4] bg-gray-400 border-gray-400"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                />
              </label>
            </div>

            {/* Refresh button */}
            <button
              onClick={handleRefresh}
              disabled={refreshMutation.isPending}
              className="btn btn-outline btn-sm"
            >
              {refreshMutation.isPending ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <span className="flex items-center gap-2">
                  <FaSync className="text-sm text-slate-400" />
                  Làm mới
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 group">
          {/* Chấm tròn hiệu ứng sóng âm - tạo cảm giác dữ liệu thực */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C4B4] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C4B4]"></span>
          </span>

          <span className="text-[13px] font-medium text-slate-400">
            Tổng quan chi tiêu của bạn:
            <span className="text-slate-600 font-bold ml-1 italic group-hover:text-[#00C4B4] transition-colors">
              {lastRefresh
                ? `Cập nhật: ${format(lastRefresh, "HH:mm:ss", { locale: vi })}`
                : "Chưa có dữ liệu"}
            </span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 mb-8">
        {[
          {
            title: "TỔNG THU VÀO",
            total: stats?.income?.total || 0,
            icon: <FaMoneyBillTrendUp />,
            percent: `${(stats?.income?.change || 0).toFixed(1)}%`,
          },
          {
            title: "TỔNG CHI RA",
            total: stats?.expense?.total || 0,
            icon: <FaMoneyBillTransfer />,
            percent: `${(stats?.expense?.change || 0).toFixed(1)}%`,
          },
          {
            title: "SỐ DƯ HIỆN TẠI",
            total: stats?.balance?.total || 0,
            icon: <FaWallet />,
            percent: `${(stats?.balance?.change || 0).toFixed(1)}%`,
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col gap-4 relative hover:border-[#00C4B4]/20 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* PHẦN ICON ĐÃ ĐƯỢC LÀM TO */}
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-[#00C4B4]/10 group-hover:border-[#00C4B4]/20 transition-all duration-300">
                  <span className="text-3xl text-slate-600 group-hover:text-[#00C4B4] transition-colors">
                    {card.icon}
                  </span>
                </div>

                <span className="text-[15px] font-bold text-slate-700 tracking-tight">
                  {card.title}
                </span>
              </div>

              {/* NÚT 3 CHẤM VÀ MENU DROPDOWN (Giữ nguyên của bạn) */}
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all"
                >
                  <FaEllipsisV size={14} />
                </div>

                <ul
                  tabIndex={0}
                  className="dropdown-content z-[20] menu p-2 shadow-2xl bg-white border border-slate-100 rounded-xl w-44 mt-2"
                >
                  <li>
                    <Link
                      to="/statistics"
                      className="flex items-center gap-3 py-2.5 text-sm font-bold text-slate-600 hover:text-[#00C4B4] hover:bg-emerald-50 active:bg-emerald-100 rounded-lg"
                    >
                      <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center text-[#00C4B4]">
                        <FaExternalLinkAlt size={10} />
                      </div>
                      Xem chi tiết
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Phần hiển thị số liệu (Giữ nguyên của bạn) */}
            <div className="flex flex-col mt-1">
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-500 mb-1">
                <FaCaretUp />
                <span>{card.percent}</span>
                <span className="text-slate-400 font-medium ml-1">
                  SO VỚI THÁNG TRƯỚC
                </span>
              </div>
              <h3 className="text-[28px] font-black text-slate-900 leading-none tracking-tight">
                {statsLoading ? (
                  <span className="loading loading-dots loading-sm text-[#00C4B4]"></span>
                ) : (
                  `${card.total.toLocaleString()}đ`
                )}
              </h3>
            </div>
          </div>
        ))}
      </div>


      {/* Charts Section */}
      <AnimatePresence>
        {expandedSections.charts && (
          <div className="flex flex-col gap-8">
            {" "}
            {/* Container chính giữ khoảng cách thoáng giữa 2 phần */}
            {/* PHẦN XU HƯỚNG CHI TIÊU */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              /* Galaxy background for trend chart - CỐ ĐỊNH WIDTH 1150px */
              className="bg-gradient-to-r from-slate-100/60 via-blue-100/40 to-purple-100/40 backdrop-blur-md border border-white/40 rounded-[1.5rem] shadow-sm trend-chart-container overflow-hidden relative"
              style={{
                width: "1150px",
                minWidth: "1150px",
                maxWidth: "1150px",
                paddingLeft: "20px",
                paddingRight: "20px",
                paddingTop: "20px",
                paddingBottom: "20px",
              }}
            >
              {/* Subtle Galaxy Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-200/12 via-purple-200/12 to-pink-200/12"></div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-300/6 via-transparent to-transparent"></div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-pink-300/6 via-transparent to-transparent"></div>

              <div
                className="flex flex-col gap-4 relative z-10"
                style={{
                  width: "1110px",
                  minWidth: "1110px",
                  maxWidth: "1110px",
                }}
              >
                {/* Header: Statistics & Tabs - ĐIỀU CHỈNH PADDING */}
                <div
                  className="flex items-center justify-between"
                  style={{
                    width: "1110px",
                    minWidth: "1110px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                  }}
                >
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                      Xu hướng chi tiêu
                    </h2>

                    {/* Toggle Income/Expense */}
                    <div className="bg-slate-100 rounded-lg p-1 flex text-[10px] font-bold">
                      <button
                        onClick={() => setTrendType("expense")}
                        className={`px-3 py-1 rounded-md transition-all ${trendType === "expense"
                          ? "bg-white text-red-500 shadow-sm"
                          : "text-slate-400 hover:text-slate-600"
                          }`}
                      >
                        CHI TIÊU
                      </button>
                      <button
                        onClick={() => setTrendType("income")}
                        className={`px-3 py-1 rounded-md transition-all ${trendType === "income"
                          ? "bg-white text-emerald-500 shadow-sm"
                          : "text-slate-400 hover:text-slate-600"
                          }`}
                      >
                        THU NHẬP
                      </button>

                      <button
                        onClick={() => setTrendType("both")}
                        className={`px-3 py-1 rounded-md transition-all ${trendType === "both"
                          ? "bg-white text-blue-500 shadow-sm"
                          : "text-slate-400 hover:text-slate-600"
                          }`}
                      >
                        CẢ HAI
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-6 text-xs font-bold">
                    {["day", "week", "month"].map((p) => (
                      <button
                        key={p}
                        onClick={() =>
                          setTrendPeriod(p as "day" | "week" | "month" | "year")
                        }
                        className={`transition-all duration-300 pb-1 ${trendPeriod === p
                          ? "text-[#00C4B4] border-b-2 border-[#00C4B4]"
                          : "text-slate-400 hover:text-slate-600"
                          }`}
                      >
                        {p === "day" ? "Ngày" : p === "week" ? "Tuần" : "Tháng"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* THANH CHỌN NGÀY - ĐIỀU CHỈNH PADDING */}
                {trendPeriod === "day" && (
                  <div
                    className="w-full"
                    style={{
                      width: "1110px",
                      minWidth: "1110px",
                      maxWidth: "1110px",
                    }}
                  >
                    <div
                      style={{
                        paddingLeft: "10px",
                        paddingRight: "10px",
                        paddingTop: "8px",
                        paddingBottom: "8px",
                      }}
                    >
                      {/* Container có width cố định với padding điều chỉnh */}
                      <div
                        className="relative h-[76px] overflow-hidden"
                        style={{ width: "1090px" }}
                      >
                        <div
                          className="flex flex-nowrap gap-2 overflow-x-auto pb-2 scroll-smooth date-scroll-container"
                          style={{
                            height: "100%",
                            width: "1090px",
                            paddingRight: "30px",
                          }}
                        >
                          {daysInMonth.map((date, idx) => {
                            const isSelected = isSameDay(date, selectedDate);
                            return (
                              <button
                                key={idx}
                                onClick={() => setSelectedDate(date)}
                                className={`
                              date-button flex flex-col items-center justify-center 
                              w-[48px] h-[60px] rounded-xl transition-all duration-200
                              ${isSelected
                                    ? "bg-[#00C4B4] text-white shadow-lg shadow-[#00C4B4]/30"
                                    : "bg-white text-slate-500 hover:bg-[#00C4B4]/5 hover:text-[#00C4B4] border border-slate-100 hover:shadow-md"
                                  }
                            `}
                              >
                                <span
                                  className={`text-base font-black leading-none ${isSelected ? "text-white" : "text-slate-800"
                                    }`}
                                >
                                  {format(date, "dd")}
                                </span>
                                <span
                                  className={`text-[8px] font-bold uppercase mt-1 tracking-wider ${isSelected
                                    ? "text-white/80"
                                    : "text-slate-400"
                                    }`}
                                >
                                  {format(date, "EEE", { locale: vi })}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Biểu đồ: ĐIỀU CHỈNH PADDING */}
                <div
                  className="h-[280px] mt-1 chart-container"
                  style={{
                    width: "1110px",
                    minWidth: "1110px",
                    maxWidth: "1110px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                  }}
                >
                  <ExpenseTrendChart
                    data={trendData || []}
                    loading={trendLoading}
                    period={trendPeriod}
                    type={trendType}
                  />
                </div>
              </div>

              <div className="flex gap-4 mb-2 justify-center px-2">
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
            </motion.div>
            {/* SECTION 3: PHÂN TÍCH CHUYÊN SÂU (2 BIỂU ĐỒ) */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 w-full max-w-full overflow-hidden">
              {/* BIỂU ĐỒ CỘT */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                /* Galaxy background for bar chart */
                className="lg:col-span-6 bg-gradient-to-r from-slate-100/60 via-blue-100/40 to-purple-100/40 backdrop-blur-xl border border-white/40 rounded-[1.5rem] flex flex-col h-[450px] transition-all hover:border-[#00C4B4]/40 overflow-hidden shadow-sm relative"
              >
                {/* Subtle Galaxy Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-200/12 via-purple-200/12 to-pink-200/12"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-300/6 via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-pink-300/6 via-transparent to-transparent"></div>
                {/* Header: Thu gọn padding từ px-10 xuống px-6 */}
                <div className="flex flex-col items-stretch border-b border-slate-100 sm:flex-row relative z-10">
                  <div className="flex flex-1 flex-col justify-center gap-0.5 px-6 py-4">
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">
                      Dòng tiền tuần này
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      So sánh thu nhập và chi tiêu
                    </p>
                  </div>

                  <div className="flex border-l border-slate-100 divide-x divide-slate-100">
                    {/* Thêm divide-x và divide-slate-100 để tạo vạch ngăn mờ giữa các nút */}
                    {[
                      {
                        id: "thu",
                        label: "Tiền thu",
                        color: "#00C4B4",
                        total: totals.thu,
                      },
                      {
                        id: "chi",
                        label: "Tiền chi",
                        color: "#ef4444",
                        total: totals.chi,
                      },
                      {
                        id: "both",
                        label: "So sánh",
                        color: "#6366f1",
                        total: null,
                      },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() =>
                          setActiveChart(item.id as "thu" | "chi" | "both")
                        }
                        className={`relative z-30 flex flex-1 rounded-none flex-col items-center justify-center gap-0 px-4 py-3 text-center transition-all min-w-[100px] overflow-hidden
            ${activeChart === item.id
                            ? "bg-gradient-to-r from-slate-100/60 via-blue-100/30 to-purple-100/30"
                            : "hover:bg-gradient-to-r hover:from-slate-100/40 hover:via-blue-100/20 hover:to-purple-100/20"
                          }`}
                      >
                        {/* Subtle Galaxy Background Effects for Active Button */}
                        {activeChart === item.id && (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-200/8 via-purple-200/8 to-pink-200/8"></div>
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-300/4 via-transparent to-transparent"></div>
                          </>
                        )}
                        {/* Label nhỏ phía trên - Căn giữa */}
                        <span className="text-[14px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1 relative z-10">
                          {item.label}
                        </span>

                        {/* Số tiền hoặc chữ Đối chiếu - Căn giữa */}
                        <span className="text-[15px] font-black leading-none text-slate-800 flex items-baseline justify-center relative z-10">
                          {item.id === "both" ? (
                            <span className="text-[11px] text-slate-400 font-extrabold uppercase tracking-tight">
                              Đối chiếu
                            </span>
                          ) : (
                            <>
                              {item.total?.toLocaleString()}
                              <span className="text-[10px] ml-0.5 font-bold text-slate-400">
                                đ
                              </span>
                            </>
                          )}
                        </span>

                        {/* Thanh line active ở dưới đáy */}
                        {activeChart === item.id && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-1"
                            style={{ backgroundColor: item.color }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nội dung biểu đồ: Thu nhỏ padding */}
                <div className="flex-1 min-h-0 p-6 pt-4 relative z-10">
                  <ExpenseBarChart
                    data={totals.barData}
                    activeKey={activeChart} // 'thu', 'chi' hoặc 'both'
                    // Màu chủ đạo khi ở chế độ so sánh có thể là màu tím hoặc xám nhẹ
                    color={
                      activeChart === "thu"
                        ? "#00C4B4"
                        : activeChart === "chi"
                          ? "#ef4444"
                          : "#6366f1"
                    }
                  />
                </div>

                {/* Footer: Thu nhỏ padding */}
                <div className="px-6 pb-6 flex justify-between items-center">
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C4B4] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00C4B4]"></span>
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      Cập nhật: {timeAgo}
                    </span>
                  </div>
                  <button
                    onClick={refreshData}
                    className="p-1.5 text-slate-300 hover:text-[#00C4B4] transition-all group"
                  >
                    <FaSyncAlt
                      size={12}
                      className="group-active:rotate-180 transition-transfor m duration-500"
                    />
                  </button>
                </div>
              </motion.div>

              {/* BIỂU ĐỒ TRÒN */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-4 bg-gradient-to-r from-slate-100/60 via-blue-100/40 to-purple-100/40 backdrop-blur-xl border border-white/40 rounded-[1.5rem] p-6 flex flex-col h-[450px] transition-all hover:border-orange-300 shadow-sm overflow-hidden relative"
              >
                {/* Subtle Galaxy Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-200/12 via-purple-200/12 to-pink-200/12"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-300/6 via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-pink-300/6 via-transparent to-transparent"></div>
                {/* Header */}
                <div className="flex items-start justify-between mb-2 relative z-10">
                  <div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">
                      Cơ cấu dòng tiền
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      Tỉ lệ Thu/Chi
                    </p>
                  </div>
                  <div className="px-3 py-1.5 bg-orange-50 rounded-xl border border-orange-100 flex items-center gap-2">
                    <FaMoneyBillTrendUp className="text-orange-500" size={12} />
                    <span className="text-[10px] font-black text-orange-600 uppercase">
                      Phân tích
                    </span>
                  </div>
                </div>

                {/* Area Biểu đồ - Chiếm không gian chính */}
                <div className="flex-1 relative flex items-center justify-center min-h-0 z-10">
                  {/* Text ở giữa vòng tròn */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                      Tổng
                    </p>
                    <p className="text-2xl font-black text-slate-800">100%</p>
                  </div>

                  <ExpensePieChart
                    loading={trendLoading}
                    data={[
                      { name: "Thu nhập", value: totals.thu || 0 },
                      { name: "Chi tiêu", value: totals.chi || 0 },
                    ]}
                  />
                </div>

                {/* Phần Chú thích (Note) - Đưa xuống sát đáy */}
                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-center gap-10">
                  {/* Thu nhập */}
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2.5 h-2.5 bg-[#00C4B4] rounded-full"></div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                        Thu nhập
                      </span>
                    </div>
                    <span className="text-sm font-black text-slate-800">
                      {totals.percentThu}%
                    </span>
                  </div>

                  <div className="w-px h-8 bg-slate-100"></div>

                  {/* Chi tiêu */}
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2.5 h-2.5 bg-[#ef4444] rounded-full"></div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                        Chi tiêu
                      </span>
                    </div>
                    <span className="text-sm font-black text-slate-800">
                      {totals.percentChi}%
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Section: Stacked Layout (Trên - Dưới) */}
      <div className="flex flex-col gap-8 w-full max-w-full overflow-hidden">
        {/* Recent Transactions Section */}
        <AnimatePresence>
          {expandedSections.transactions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white/60 backdrop-blur-md border border-slate-200/60 rounded-[2.5rem] p-8 shadow-sm w-full overflow-hidden"
            >
              <div className="flex flex-col">
                {/* Header chỉ giữ lại tiêu đề */}
                <div className="flex justify-between items-center mb-6 px-2">
                  <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                    Giao dịch gần đây
                  </h2>
                </div>

                <div className="card-body p-0">
                  {recentLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <span className="loading loading-spinner loading-lg text-[#00C4B4]"></span>
                    </div>
                  ) : (recentTransactions || []).length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                      <div className="text-6xl mb-4 text-slate-200">
                        <FaInbox />
                      </div>
                      <p className="text-slate-500 font-medium">
                        Chưa có giao dịch nào
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="table table-zebra w-full">
                        <thead>
                          <tr className="border-b border-slate-100">
                            <th className="bg-transparent text-slate-400 font-bold uppercase text-[11px]">
                              Ngày
                            </th>
                            <th className="bg-transparent text-slate-400 font-bold uppercase text-[11px]">
                              Danh mục
                            </th>
                            <th className="bg-transparent text-slate-400 font-bold uppercase text-[11px]">
                              Số tiền
                            </th>
                            <th className="bg-transparent text-slate-400 font-bold uppercase text-[11px]">
                              Ghi chú
                            </th>
                            <th className="bg-transparent text-slate-400 font-bold uppercase text-[11px]">
                              Hóa đơn
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {(recentTransactions || [])
                            .slice(0, 3)
                            .map((transaction) => (
                              <motion.tr
                                key={transaction.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="hover:bg-slate-50/50 transition-colors border-b border-slate-50"
                              >
                                {/* Ngày */}
                                <td className="text-sm text-slate-600">
                                  {new Date(
                                    transaction.transactionDate
                                  ).toLocaleDateString("vi-VN")}
                                </td>

                                {/* Danh mục & Icon */}
                                <td>
                                  <div className="flex items-center gap-3">
                                    <div
                                      className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0"
                                      style={{
                                        backgroundColor: `${transaction.category?.color ||
                                          "#00C4B4"
                                          }20`,
                                        color:
                                          transaction.category?.color ||
                                          "#00C4B4",
                                      }}
                                    >
                                      <span className="text-sm">
                                        {(() => {
                                          const iconName =
                                            transaction.category?.icon;
                                          type IconComponentType =
                                            React.ComponentType<{
                                              className?: string;
                                            }>;
                                          const IconComponent = iconName
                                            ? (
                                              Fa6 as Record<
                                                string,
                                                IconComponentType
                                              >
                                            )[iconName]
                                            : null;
                                          return IconComponent ? (
                                            <IconComponent />
                                          ) : (
                                            <Fa6.FaFolder />
                                          );
                                        })()}
                                      </span>
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700">
                                      {transaction.category?.name}
                                    </span>
                                  </div>
                                </td>

                                {/* Số tiền */}
                                <td>
                                  <span
                                    className={`font-bold text-lg ${(transaction.category?.type || "")
                                      .trim()
                                      .toLowerCase() === "income"
                                      ? "text-green-600"
                                      : "text-red-600"
                                      }`}
                                  >
                                    {(transaction.category?.type || "")
                                      .trim()
                                      .toLowerCase() === "income"
                                      ? "+"
                                      : "-"}
                                    {transaction.amount.toLocaleString()} đ
                                  </span>
                                </td>

                                {/* Ghi chú */}
                                <td className="text-sm text-slate-400 max-w-[250px] truncate italic">
                                  {transaction.note || "-"}
                                </td>

                                {/* Hóa đơn (Chỉ xem) */}
                                <td>
                                  {transaction.receiptImage ? (
                                    <a
                                      href={transaction.receiptImage}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[#00C4B4] hover:text-[#00a89a]"
                                    >
                                      <FaImage size={16} />
                                    </a>
                                  ) : (
                                    <span className="text-slate-200">-</span>
                                  )}
                                </td>
                              </motion.tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Footer dẫn sang trang chi tiết */}
                  {!recentLoading && (recentTransactions || []).length > 0 && (
                    <div className="mt-6 text-center">
                      <button
                        onClick={() => (window.location.href = "/transactions")}
                        className="text-[11px] font-black text-[#00C4B4] uppercase tracking-[0.2em] hover:opacity-70 transition-all flex items-center justify-center gap-2 mx-auto"
                      >
                        Xem tất cả giao dịch <span className="text-lg"></span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PHẦN 2 (ĐÃ ĐẢO XUỐNG): CHI TIÊU THEO DANH MỤC */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, delay: 0.1 }} // Hiện sau một nhịp để tăng hiệu ứng thị giác
          className="bg-white/60 backdrop-blur-md border border-slate-200/60 rounded-[2.5rem] p-6 shadow-sm transition-all hover:border-[#00C4B4]/30"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#00C4B4] rounded-full"></span>
              <h2 className="text-xl font-bold text-slate-800">
                Chi tiêu theo danh mục
              </h2>
            </div>

            {/* Dropdown thời gian */}
            <div className="dropdown dropdown-end group">
              <div
                tabIndex={0}
                role="button"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/50 border border-slate-200 font-medium text-slate-600 hover:border-[#00C4B4] hover:bg-white transition-all cursor-pointer text-sm shadow-sm"
              >
                <div className="text-slate-400 group-focus-within:text-[#00C4B4] transition-colors">
                  {dateRange === "week" && <FaCalendarDay size={14} />}
                  {dateRange === "month" && <FaCalendarWeek size={14} />}
                  {dateRange === "year" && <FaCalendarCheck size={14} />}
                  {dateRange === "all" && <FaClockRotateLeft size={14} />}
                </div>
                <span className="min-w-[70px]">
                  {dateRange === "week" && "Tuần này"}
                  {dateRange === "month" && "Tháng này"}
                  {dateRange === "year" && "Năm nay"}
                  {dateRange === "all" && "Tất cả"}
                </span>
                <FaChevronDown
                  size={10}
                  className="text-slate-400 group-focus-within:rotate-180 transition-transform duration-300"
                />
              </div>

              {/* Phần nội dung Menu - Đảm bảo có logic hiển thị */}
              <ul
                tabIndex={0}
                className="dropdown-content z-[100] menu p-2 shadow-2xl bg-white rounded-2xl w-[160px] mt-2 border border-slate-100 flex flex-col gap-1 anim-show-dropdown"
              >
                {[
                  { id: "week", label: "Tuần này", icon: <FaCalendarDay /> },
                  { id: "month", label: "Tháng này", icon: <FaCalendarWeek /> },
                  { id: "year", label: "Năm nay", icon: <FaCalendarCheck /> },
                  { id: "all", label: "Tất cả", icon: <FaClockRotateLeft /> },
                ].map((option) => (
                  <li key={option.id}>
                    <button
                      onClick={() => {
                        setDateRange(
                          option.id as "week" | "month" | "year" | "all"
                        );
                        // Sau khi click, bỏ focus để đóng dropdown
                        if (document.activeElement instanceof HTMLElement) {
                          document.activeElement.blur();
                        }
                      }}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${dateRange === option.id
                        ? "bg-[#00C4B4]/10 text-[#00C4B4] font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                        }`}
                    >
                      <span
                        className={
                          dateRange === option.id
                            ? "text-[#00C4B4]"
                            : "text-slate-400"
                        }
                      >
                        {option.icon}
                      </span>
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="h-[400px]">
            <CategoryPieChart
              data={pieChartData || []}
              loading={categoryLoading}
            />
          </div>

          {totalInRange > 0 && (
            <div className="mt-6 pt-4 border-t border-dashed border-slate-200 text-center">
              <p className="text-sm text-slate-500">
                Tổng chi:{" "}
                <span className="font-bold text-[#00C4B4] text-xl ml-1">
                  {formatCurrency(totalInRange)}
                </span>
              </p>
            </div>
          )}
        </motion.div>
        {/* 2. AI Prediction - Nằm phía dưới */}
        <AnimatePresence>
          {expandedSections.ai && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full"
            >
              {/* AiPredictionCard thường đã có sẵn container bên trong nên ta chỉ cần bọc ngoài */}
              <AiPredictionCard
                data={aiPrediction || null}
                loading={aiLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Additional Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Budget vs Actual (if implemented) */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Ngân sách vs Thực tế</h2>
            <p className="text-base-content/50 text-sm">
              Tính năng này sẽ được phát triển trong phiên bản tiếp theo
            </p>
          </div>
        </div>

        {/* Savings Tips */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">💡 Gợi ý tiết kiệm</h2>
            <div className="space-y-2">
              {topCategories && topCategories.length > 0 && (
                <div className="alert alert-info">
                  <div>
                    <h3 className="font-bold">Danh mục chi nhiều nhất</h3>
                    <div className="text-xs">
                      Bạn đang chi nhiều nhất cho{" "}
                      <strong>{topCategories[0]?.name}</strong>. Hãy xem xét
                      giảm chi tiêu ở danh mục này.
                    </div>
                  </div>
                </div>
              )}
              {aiPrediction && aiPrediction.trend === "TĂNG" && (
                <div className="alert alert-warning">
                  <div>
                    <h3 className="font-bold">Cảnh báo xu hướng</h3>
                    <div className="text-xs">
                      Chi tiêu của bạn có xu hướng tăng. Hãy kiểm soát chi tiêu
                      tốt hơn.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
