/**
 * Admin Transactions Page - Quản lý giao dịch
 * GIAO DIỆN: Chuyên nghiệp, phù hợp với AdminDashboard (teal theme, galaxy style)
 * LOGIC: Từ code 11 (document index 11) - Giữ nguyên 100%
 */

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaUser,
  FaEye,
  FaMoneyBillWave,
  FaChartBar,
  FaCalculator,
  FaFileInvoice,
} from "react-icons/fa";
import {
  getAllTransactions,
  getUsers,
  type Transaction,
  type User,
} from "../../api/admin";

/**
 * LOGIC TỪ CODE 11 - GIỮ NGUYÊN 100%
 */
const AdminTransactionsPage = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Query: Lấy danh sách users (cho filter)
  const { data: usersData } = useQuery({
    queryKey: ["admin", "users", "all"],
    queryFn: async () => {
      const response = await getUsers({ size: 1000 });
      return response.data?.content || [];
    },
  });

  // Query: Lấy transactions
  const {
    data: transactionsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "admin",
      "transactions",
      page,
      size,
      search,
      userId,
      startDate,
      endDate,
    ],
    queryFn: async () => {
      const response = await getAllTransactions({
        keyword: search || undefined,
        userId: userId || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        page,
        size,
      });
      return response.data;
    },
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
  };

  // Tính toán thống kê
  const statistics = useMemo(() => {
    if (!transactionsData?.content) {
      return {
        total: 0,
        count: 0,
        average: 0,
      };
    }

    const amounts = transactionsData.content.map((t: Transaction) =>
      Number(t.amount || 0)
    );
    const total = amounts.reduce((sum: number, a: number) => sum + a, 0);
    const count = amounts.length;
    const average = count > 0 ? total / count : 0;

    return { total, count, average };
  }, [transactionsData]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">Lỗi tải dữ liệu</h2>
          <p className="text-slate-600">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  /**
   * GIAO DIỆN CHUYÊN NGHIỆP - TEAL THEME
   */
  return (
    <div className="space-y-6 pl-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-[10px]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-slate-800 tracking-tight">
            Quản lý Giao dịch
          </h1>

          <div className="flex items-center gap-2 group">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>

            <span className="text-[13px] font-medium text-slate-400">
              Tổng cộng:
              <span className="text-slate-600 font-bold ml-1 italic group-hover:text-teal-500 transition-colors">
                {transactionsData?.totalElements || 0} giao dịch
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Statistics Cards - Galaxy Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-400 rounded-2xl p-6 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
              <FaFileInvoice className="text-teal-400 text-xl" />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
              Tổng giao dịch
            </p>
            <p className="text-3xl font-black text-slate-800">
              {statistics.count.toLocaleString()}
            </p>
          </div>
        </motion.div>

        {/* Total Amount */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white border border-slate-400 rounded-2xl p-6 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
              <FaMoneyBillWave className="text-teal-400 text-xl" />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
              Tổng tiền
            </p>
            <p className="text-2xl font-black text-slate-800">
              {formatCurrency(statistics.total)}
            </p>
          </div>
        </motion.div>

        {/* Average */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-400 rounded-2xl p-6 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
              <FaCalculator className="text-teal-400 text-xl" />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
              Trung bình
            </p>
            <p className="text-2xl font-black text-slate-800">
              {formatCurrency(statistics.average)}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Filters Section - Galaxy Style */}
      <div className="bg-gradient-to-r from-slate-100/60 via-teal-100/40 to-cyan-100/40 backdrop-blur-md border border-white/40 rounded-[1.5rem] shadow-sm overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-200/12 via-cyan-200/12 to-blue-200/12"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-300/6 via-transparent to-transparent"></div>

        <div className="relative z-10 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <FaFilter className="text-white text-lg" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Bộ lọc tìm kiếm
              </h3>
              <p className="text-sm text-slate-500">
                Lọc và tìm kiếm giao dịch
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tìm kiếm
              </label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors bg-white"
                  placeholder="Tìm theo ghi chú..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(0);
                  }}
                />
              </div>
            </div>

            {/* User Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <FaUser className="inline mr-1" />
                User
              </label>
              <select
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors bg-white"
                value={userId || ""}
                onChange={(e) => {
                  setUserId(e.target.value ? Number(e.target.value) : null);
                  setPage(0);
                }}
              >
                <option value="">Tất cả users</option>
                {usersData?.map((user: User) => (
                  <option key={user.id} value={user.id}>
                    {user.fullName} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <FaCalendarAlt className="inline mr-1" />
                Từ ngày
              </label>
              <input
                type="date"
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors bg-white"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(0);
                }}
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <FaCalendarAlt className="inline mr-1" />
                Đến ngày
              </label>
              <input
                type="date"
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors bg-white"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(0);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table - Galaxy Style */}
      <div className="bg-gradient-to-r from-slate-100/60 via-teal-100/40 to-cyan-100/40 backdrop-blur-md border border-white/40 rounded-[1.5rem] shadow-sm overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-200/12 via-cyan-200/12 to-blue-200/12"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-300/6 via-transparent to-transparent"></div>

        <div className="relative z-10">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
                <p className="text-slate-600 font-medium">
                  Đang tải dữ liệu...
                </p>
              </div>
            </div>
          ) : !transactionsData?.content ||
            transactionsData.content.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 p-6">
              <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center mb-4">
                <FaFileInvoice className="text-4xl text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Không có giao dịch
              </h3>
              <p className="text-slate-500 text-center">
                {search || userId || startDate || endDate
                  ? "Không tìm thấy giao dịch phù hợp với bộ lọc"
                  : "Chưa có giao dịch nào trong hệ thống"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/40">
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Ngày
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Danh mục
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Số tiền
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Ghi chú
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Địa điểm
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Tạo bởi
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactionsData.content.map(
                    (transaction: Transaction, index: number) => (
                      <motion.tr
                        key={transaction.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-white/20 hover:bg-white/30 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-slate-800">
                          #{transaction.id}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                              transaction.createdByAdminId
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {transaction.createdByAdminId ? "Admin" : "User"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {formatDate(transaction.transactionDate)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                              style={{
                                backgroundColor: `${
                                  transaction.category?.color || "#14b8a6"
                                }15`,
                              }}
                            >
                              <span
                                style={{
                                  color:
                                    transaction.category?.color || "#14b8a6",
                                }}
                              >
                                {transaction.category?.icon || "📁"}
                              </span>
                            </div>
                            <span className="font-medium text-slate-800">
                              {transaction.category?.name ||
                                "Không có danh mục"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-teal-600">
                            {formatCurrency(Number(transaction.amount || 0))}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="text-sm text-slate-600 truncate max-w-xs block"
                            title={transaction.note}
                          >
                            {transaction.note || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="text-sm text-slate-600 truncate max-w-xs block"
                            title={transaction.location}
                          >
                            {transaction.location || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                              transaction.createdBy === "ADMIN"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {transaction.createdBy || "USER"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            to={`/admin/users/${transaction.id}`}
                            className="w-8 h-8 rounded-lg bg-blue-100 hover:bg-blue-200 flex items-center justify-center text-blue-600 transition-colors"
                            title="Xem chi tiết"
                          >
                            <FaEye size={14} />
                          </Link>
                        </td>
                      </motion.tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {transactionsData && transactionsData.totalPages > 1 && (
            <div className="flex items-center justify-between p-6 border-t border-white/40">
              <div className="text-sm text-slate-600">
                Hiển thị <span className="font-bold">{page * size + 1}</span> -{" "}
                <span className="font-bold">
                  {Math.min((page + 1) * size, transactionsData.totalElements)}
                </span>{" "}
                /{" "}
                <span className="font-bold">
                  {transactionsData.totalElements}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-2 rounded-lg bg-white/50 hover:bg-white text-slate-700 font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={() => setPage(0)}
                  disabled={page === 0}
                >
                  ««
                </button>
                <button
                  className="px-3 py-2 rounded-lg bg-white/50 hover:bg-white text-slate-700 font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  «
                </button>
                {Array.from(
                  { length: Math.min(5, transactionsData.totalPages) },
                  (_, i) => {
                    let pageNum: number;
                    if (transactionsData.totalPages <= 5) {
                      pageNum = i;
                    } else if (page < 3) {
                      pageNum = i;
                    } else if (page > transactionsData.totalPages - 4) {
                      pageNum = transactionsData.totalPages - 5 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          page === pageNum
                            ? "bg-teal-500 text-white shadow-md"
                            : "bg-white/50 hover:bg-white text-slate-700"
                        }`}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  }
                )}
                <button
                  className="px-3 py-2 rounded-lg bg-white/50 hover:bg-white text-slate-700 font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={() =>
                    setPage((p) =>
                      Math.min(transactionsData.totalPages - 1, p + 1)
                    )
                  }
                  disabled={page >= transactionsData.totalPages - 1}
                >
                  »
                </button>
                <button
                  className="px-3 py-2 rounded-lg bg-white/50 hover:bg-white text-slate-700 font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={() => setPage(transactionsData.totalPages - 1)}
                  disabled={page >= transactionsData.totalPages - 1}
                >
                  »»
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTransactionsPage;
