import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FaFileExport,
  FaCalendarCheck,
  FaTriangleExclamation,
  FaChartLine,
  FaPercent,
} from "react-icons/fa6";
import api from "../../api/axios";
import FloatingQuickAction from "../../components/common/FloatingQuickAction";

interface MonthlyData {
  income: number;
  expense: number;
  balance: number;
  month: number;
}

interface ReportSummary {
  totalIncome: number;
  totalExpense: number;
  totalBalance: number;
  avgMonthlyIncome: number;
  avgMonthlyExpense: number;
  bestMonth: number;
  worstMonth: number;
}

const ReportsPage: React.FC = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState<"table" | "chart">("table");

  // Lấy dữ liệu báo cáo
  const { data: reportData, isLoading } = useQuery({
    queryKey: ["reports", year],
    queryFn: async () => {
      try {
        const res = await api.get("/transactions", {
          params: {
            startDate: `${year}-01-01`,
            endDate: `${year}-12-31`,
            size: 5000,
          },
        });
        const transactions = res.data.data?.content || [];

        // Tổng hợp theo tháng
        const monthly: MonthlyData[] = Array(12)
          .fill(0)
          .map((_, idx) => ({
            income: 0,
            expense: 0,
            balance: 0,
            month: idx + 1,
          }));

        interface Transaction {
          transactionDate: string;
          amount: number | string;
          category?: { type?: string } | null;
        }

        (transactions as Transaction[]).forEach((t) => {
          const month = new Date(t.transactionDate).getMonth();
          const amount =
            typeof t.amount === "string" ? parseFloat(t.amount) : t.amount;
          if (t.category?.type === "income") {
            monthly[month].income += amount;
          } else {
            monthly[month].expense += amount;
          }
        });

        // Tính số dư cho mỗi tháng
        monthly.forEach((m) => {
          m.balance = m.income - m.expense;
        });

        return monthly;
      } catch (error) {
        console.error("Error fetching report data:", error);
        return [];
      }
    },
  });

  // Tính toán thống kê tổng hợp
  const summary: ReportSummary = useMemo(() => {
    if (!reportData || reportData.length === 0) {
      return {
        totalIncome: 0,
        totalExpense: 0,
        totalBalance: 0,
        avgMonthlyIncome: 0,
        avgMonthlyExpense: 0,
        bestMonth: 1,
        worstMonth: 1,
      };
    }

    const totalIncome = reportData.reduce((sum, m) => sum + m.income, 0);
    const totalExpense = reportData.reduce((sum, m) => sum + m.expense, 0);
    const totalBalance = totalIncome - totalExpense;

    const monthsWithData = reportData.filter(
      (m) => m.income > 0 || m.expense > 0
    );
    const avgMonthlyIncome =
      monthsWithData.length > 0 ? totalIncome / monthsWithData.length : 0;
    const avgMonthlyExpense =
      monthsWithData.length > 0 ? totalExpense / monthsWithData.length : 0;

    const bestMonth =
      reportData.reduce(
        (best, current, idx) =>
          current.balance > reportData[best].balance ? idx : best,
        0
      ) + 1;
    const worstMonth =
      reportData.reduce(
        (worst, current, idx) =>
          current.balance < reportData[worst].balance ? idx : worst,
        0
      ) + 1;

    return {
      totalIncome,
      totalExpense,
      totalBalance,
      avgMonthlyIncome,
      avgMonthlyExpense,
      bestMonth,
      worstMonth,
    };
  }, [reportData]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);

  const getMonthName = (month: number) => {
    const months = [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ];
    return months[month - 1];
  };

  const getFinancialStatus = (income: number, expense: number) => {
    if (income === 0 && expense === 0)
      return {
        text: "Không có dữ liệu",
        color: "text-slate-500",
        bg: "bg-white",
      };
    if (expense === 0)
      return {
        text: "Chỉ có thu nhập",
        color: "text-green-600",
        bg: "bg-green-100",
      };
    if (income === 0)
      return {
        text: "Chỉ có chi tiêu",
        color: "text-red-600",
        bg: "bg-red-100",
      };

    const ratio = expense / income;
    if (ratio > 1)
      return { text: "Thâm hụt", color: "text-red-600", bg: "bg-red-100" };
    if (ratio > 0.9)
      return {
        text: "Cảnh báo",
        color: "text-yellow-600",
        bg: "bg-yellow-100",
      };
    if (ratio > 0.7)
      return { text: "Ổn định", color: "text-blue-600", bg: "bg-blue-100" };
    return { text: "Tốt", color: "text-green-600", bg: "bg-green-100" };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Đang tải báo cáo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pl-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-[10px]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-slate-800 tracking-tight">
            Báo cáo tài chính {year}
          </h1>

          <div className="flex items-center gap-2 group">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C4B4] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C4B4]"></span>
            </span>

            <span className="text-[13px] font-medium text-slate-400">
              Phân tích chi tiết tình hình tài chính
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Export Button */}
          <button
            onClick={() => {
              if (!reportData || reportData.length === 0) return;

              const headers = [
                "Tháng",
                "Thu nhập",
                "Chi tiêu",
                "Số dư",
                "Trạng thái",
              ];
              const csvContent = [
                headers.join(","),
                ...reportData.map((row) => {
                  const status = getFinancialStatus(row.income, row.expense);
                  return [
                    `Tháng ${row.month}`,
                    row.income,
                    row.expense,
                    row.balance,
                    status.text,
                  ].join(",");
                }),
              ].join("\n");

              const blob = new Blob(["\uFEFF" + csvContent], {
                type: "text/csv;charset=utf-8;",
              });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.setAttribute("href", url);
              link.setAttribute("download", `bao-cao-tai-chinh-${year}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            disabled={!reportData || reportData.length === 0}
            className="btn btn-outline border-slate-200 hover:border-orange-500 hover:bg-orange-50 text-slate-900 hover:text-orange-600 gap-2 transition-all duration-300 disabled:opacity-40 disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-100"
          >
            <FaFileExport size={14} />
            <span className="font-semibold">Export</span>
          </button>

          {/* Year Selector */}
          <div className="relative min-w-[120px]">
            <div className="dropdown dropdown-bottom dropdown-end w-full">
              <div
                tabIndex={0}
                role="button"
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-[0.5rem] focus:border-[#00C4B4] focus:bg-white transition-all duration-200 text-slate-700 cursor-pointer hover:border-slate-300 flex items-center justify-between"
              >
                <span>{year}</span>
                <svg
                  className="w-5 h-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-1 shadow-lg bg-white rounded-lg w-full border border-slate-200 mt-1"
              >
                <li>
                  <button
                    onClick={() => setYear(2023)}
                    className={`px-3 py-2 rounded-md transition-all duration-200 text-left w-full ${
                      year === 2023
                        ? "bg-slate-100 text-slate-800 font-medium"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    2023
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setYear(2024)}
                    className={`px-3 py-2 rounded-md transition-all duration-200 text-left w-full ${
                      year === 2024
                        ? "bg-slate-100 text-slate-800 font-medium"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    2024
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setYear(2025)}
                    className={`px-3 py-2 rounded-md transition-all duration-200 text-left w-full ${
                      year === 2025
                        ? "bg-slate-100 text-slate-800 font-medium"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    2025
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">
          Thông tin chi tiết trong năm nay
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tháng tốt nhất */}
          <div className="border-2 border-slate-200 rounded-xl p-4 hover:border-green-300 transition-all duration-300">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-lg border-2 border-green-200 flex items-center justify-center">
                <FaCalendarCheck className="text-green-600 text-lg" />
              </div>
              <span className="text-xs pl-[10px] font-bold text-green-600 uppercase tracking-wider">
                Tháng tốt nhất
              </span>
            </div>
            <div className="text-xl font-black text-slate-800 leading-none mb-1 ">
              {getMonthName(summary.bestMonth)}
            </div>
            <div className="text-xs text-slate-500 ">Thu nhập cao nhất</div>
          </div>

          {/* Tháng cần cải thiện */}
          <div className="border-2 border-slate-200 rounded-xl p-4 hover:border-orange-300 transition-all duration-300">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-lg border-2 border-orange-200 flex items-center justify-center">
                <FaTriangleExclamation className="text-orange-600 text-lg" />
              </div>
              <span className="text-xs pl-[10px] font-bold text-orange-600 uppercase tracking-wider">
                Cần cải thiện
              </span>
            </div>
            <div className="text-xl font-black text-slate-800 leading-none mb-1">
              {getMonthName(summary.worstMonth)}
            </div>
            <div className="text-xs text-slate-500">Cần chú ý hơn</div>
          </div>

          {/* Trung bình chi tiêu */}
          <div className="border-2 border-slate-200 rounded-xl p-4 hover:border-blue-300 transition-all duration-300">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-lg border-2 border-blue-200 flex items-center justify-center">
                <FaChartLine className="text-blue-600 text-lg" />
              </div>
              <span className="text-xs pl-[10px] font-bold text-blue-600 uppercase tracking-wider">
                TB chi tiêu
              </span>
            </div>
            <div className="text-xl font-black text-slate-800 leading-none mb-1">
              {formatCurrency(summary.avgMonthlyExpense)}
            </div>
            <div className="text-xs text-slate-500">Trung bình/tháng</div>
          </div>

          {/* Tỷ lệ tiết kiệm */}
          <div className="border-2 border-slate-200 rounded-xl p-4 hover:border-purple-300 transition-all duration-300">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-lg border-2 border-purple-200 flex items-center justify-center">
                <FaPercent className="text-purple-600 text-lg" />
              </div>
              <span className="text-xs pl-[10px] font-bold text-purple-600 uppercase tracking-wider">
                Tỷ lệ tiết kiệm
              </span>
            </div>
            <div className="text-xl font-black text-slate-800 leading-none mb-1">
              {summary.totalIncome > 0
                ? `${(
                    (summary.totalBalance / summary.totalIncome) *
                    100
                  ).toFixed(1)}%`
                : "0%"}
            </div>
            <div className="text-xs text-slate-500">Hiệu quả tiết kiệm</div>
          </div>
        </div>
      </div>

      {/* Data Section Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Chi tiết theo tháng
        </h2>

        {/* Chuyển đổi chế độ xem */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setViewMode("table")}
            className={`px-4 text-sm h-10 rounded-xl border-2 font-medium transition-all duration-200 ${
              viewMode === "table"
                ? "border-[#00C4B4] text-[#00C4B4] bg-[#00C4B4]/5"
                : "border-slate-200 text-slate-600 hover:border-[#00C4B4] hover:text-[#00C4B4] hover:bg-slate-50"
            }`}
          >
            Bảng
          </button>
          <button
            onClick={() => setViewMode("chart")}
            className={`px-4 text-sm h-10 rounded-xl border-2 font-medium transition-all duration-200 ${
              viewMode === "chart"
                ? "border-[#00C4B4] text-[#00C4B4] bg-[#00C4B4]/5"
                : "border-slate-200 text-slate-600 hover:border-[#00C4B4] hover:text-[#00C4B4] hover:bg-slate-50"
            }`}
          >
            Biểu đồ
          </button>
        </div>
      </div>

      {/* Data Table */}
      {viewMode === "table" && (
        <div className="bg-white rounded-xl shadow-sm border border-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Tháng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Thu nhập
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Chi tiêu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Số dư
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-white">
                {reportData?.map((monthData, idx) => {
                  const status = getFinancialStatus(
                    monthData.income,
                    monthData.expense
                  );
                  return (
                    <tr key={idx} className="hover:bg-white">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        {getMonthName(monthData.month)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                        {formatCurrency(monthData.income)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                        {formatCurrency(monthData.expense)}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          monthData.balance >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {formatCurrency(monthData.balance)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.bg} ${status.color}`}
                        >
                          {status.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Chế độ xem biểu đồ đơn giản */}
      {viewMode === "chart" && (
        <div className="bg-white rounded-xl shadow-sm border border-white p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            Biểu đồ thu chi theo tháng
          </h3>
          <div className="space-y-4">
            {reportData?.map((monthData, idx) => {
              const maxAmount = Math.max(
                ...reportData.map((m) => Math.max(m.income, m.expense))
              );
              const incomeWidth =
                maxAmount > 0 ? (monthData.income / maxAmount) * 100 : 0;
              const expenseWidth =
                maxAmount > 0 ? (monthData.expense / maxAmount) * 100 : 0;

              return (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700 w-20">
                      {getMonthName(monthData.month)}
                    </span>
                    <div className="flex-1 mx-4 space-y-1">
                      {/* Thanh thu nhập */}
                      <div className="flex items-center space-x-2">
                        <div className="w-full bg-white rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${incomeWidth}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-green-600 font-medium w-24 text-right">
                          {formatCurrency(monthData.income)}
                        </span>
                      </div>
                      {/* Thanh chi tiêu */}
                      <div className="flex items-center space-x-2">
                        <div className="w-full bg-white rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${expenseWidth}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-red-600 font-medium w-24 text-right">
                          {formatCurrency(monthData.expense)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-slate-600">Thu nhập</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-slate-600">Chi tiêu</span>
            </div>
          </div>
        </div>
      )}
      <FloatingQuickAction />
    </div>
  );
};

export default ReportsPage;
