import {
  FaUtensils,
  FaCarSide,
  FaEllipsisH,
  FaGamepad,
  FaCar,
} from "react-icons/fa";
import React from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  format,
  parseISO,
  startOfDay,
  endOfDay,
  subDays,
  subMonths,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
} from "date-fns";
import { vi } from "date-fns/locale";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import * as XLSX from "@e965/xlsx";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { formatDistanceToNow } from "date-fns";
import {
  FaPlus,
  FaFileImport,
  FaFileExport,
  FaTrashCan,
  FaChartSimple,
  FaFileExcel,
  FaFilePdf,
  FaXmark,
  FaRegCalendar,
  FaInbox,
  FaArrowDownShortWide,
  FaChevronUp,
  FaChevronDown,
  FaArrowDownWideShort,
  FaArrowUpShortWide,
  FaFolder,
  FaImage,
  FaPen,
  FaMoneyBill1Wave,
  FaMagnifyingGlass,
  FaFilter,
  FaEllipsisVertical,
  FaListUl,
  FaArrowTrendDown,
  FaArrowTrendUp,
  FaEquals,
} from "react-icons/fa6";
import * as Fa6 from "react-icons/fa6";
import { FaSortAmountDown, FaLayerGroup } from "react-icons/fa";
import * as FaIcons from "react-icons/fa6";

const CategoryIcon = ({ iconName }: { iconName: string }) => {
  // FaIcons là một object chứa tất cả icon.
  // Chúng ta dùng iconName (ví dụ: "FaUtensils") để lấy ra Component tương ứng.
  type IconComponentType = React.ComponentType<{ className?: string }>;
  const IconComponent = (FaIcons as Record<string, IconComponentType>)[
    iconName
  ];

  // Nếu tìm thấy icon thì hiện, không thì hiện icon thư mục mặc định
  return IconComponent ? <IconComponent /> : <FaIcons.FaFolder />;
};

// Import các component
import TransactionForm, {
  SubmittedTransaction,
} from "../../components/transactions/TransactionForm";
import DatePicker from "../../components/ui/DatePicker";
import QuickActions from "../../components/dashboard/QuickActions";
// Import API
import api from "../../api/axios";

/**
 * Interface cho Transaction
 */
interface Transaction {
  id: number;
  amount: number;
  category: {
    id: number;
    name: string;
    icon: string;
    color: string;
    type: "income" | "expense";
  };
  transactionDate: string;
  note?: string;
  location?: string;
  receiptImage?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface cho Filter
 */
interface Filter {
  search: string;
  categoryId: number | null;
  startDate: string | null;
  endDate: string | null;
  minAmount: number | null;
  maxAmount: number | null;
  sortBy: "date" | "amount" | "category";
  sortOrder: "asc" | "desc";
}

const formatNumber = (value: number | string | null) => {
  if (value === null || value === undefined || value === "") return "";
  const stringValue = value.toString().replace(/\./g, ""); // Xóa dấu chấm cũ nếu có
  return stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const parseNumber = (value: string) => {
  return value.replace(/\./g, "");
};

/**
 * Component TransactionsPage chính
 */
const TransactionsPage = () => {
  // State quản lý pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  // State quản lý filters
  const [filters, setFilters] = useState<Filter>({
    search: "",
    categoryId: null,
    startDate: null,
    endDate: null,
    minAmount: null,
    maxAmount: null,
    sortBy: "date",
    sortOrder: "desc",
  });

  // State quản lý modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // State quản lý selected transactions
  const [selectedTransactions, setSelectedTransactions] = useState<number[]>(
    []
  );
  const [selectAll, setSelectAll] = useState(false);

  // State quản lý view mode
  const [viewMode, setViewMode] = useState<"table" | "grid" | "list">("table");

  // State quản lý editing transaction
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  // State quản lý statistics
  const [showStatistics, setShowStatistics] = useState(false);

  // State quản lý quick filters
  const [quickFilter, setQuickFilter] = useState<
    "today" | "week" | "month" | "year" | "all" | null
  >(null);

  // Query client
  const queryClient = useQueryClient();

  // Query: Lấy danh sách categories
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get("/categories");
      return response.data.data || [];
    },
  });

  // Query: Lấy danh sách transactions
  const {
    data: transactionsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["transactions", page, size, filters],
    queryFn: async () => {
      const params: {
        page: number;
        size: number;
        startDate?: string;
        endDate?: string;
        categoryId?: number;
      } = {
        page,
        size,
      };

      // Add date filters
      if (filters.startDate) {
        params.startDate = filters.startDate;
      }
      if (filters.endDate) {
        params.endDate = filters.endDate;
      }

      // Add category filter
      if (filters.categoryId) {
        // Note: Backend might need category filter endpoint
      }

      const response = await api.get("/transactions", { params });
      return response.data.data;
    },
  });

  //show filter
  const [showFilters, setShowFilters] = useState(false);

  // State lưu loại bộ lọc cho từng thẻ (mặc định là 'month')
  const [cardTimeframes, setCardTimeframes] = useState<Record<string, string>>({
    "Ăn uống": "month",
    "Đi chơi": "month",
    "Xe cộ": "month",
    Khác: "month",
  });

  // Hàm nhãn hiển thị tiếng Việt
  const timeframeLabels: { [key: string]: string } = {
    today: "Hôm nay",
    week: "Tuần này",
    month: "Tháng này",
  };

  // Calculate category stats from actual transactions
  const categoriesStats = useMemo(() => {
    if (!transactionsData?.content?.length || !categories?.length) return [];

    const categoryMap = new Map<
      number,
      {
        id: number;
        name: string;
        icon: string;
        color: string;
        total: number;
        count: number;
      }
    >();

    transactionsData.content.forEach((transaction: Transaction) => {
      const cat = transaction.category;
      if (cat) {
        const existing = categoryMap.get(cat.id);
        if (existing) {
          existing.total += Number(transaction.amount || 0);
          existing.count += 1;
        } else {
          categoryMap.set(cat.id, {
            id: cat.id,
            name: cat.name,
            icon: cat.icon || "📁",
            color: cat.color || "#00C4B4",
            total: Number(transaction.amount || 0),
            count: 1,
          });
        }
      }
    });

    return Array.from(categoryMap.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 4)
      .map((item) => ({
        title: item.name,
        amount: formatNumber(item.total),
        icon: item.icon,
        color: item.color,
        categoryId: item.id,
      }));
  }, [transactionsData?.content, categories]);

  const getLastTransactionTime = () => {
    // Kiểm tra mảng có dữ liệu không
    if (!transactionsData?.content || transactionsData.content.length === 0) {
      return "Chưa có giao dịch";
    }

    try {
      // Lọc bỏ các giao dịch có date không hợp lệ trước khi tìm Max
      const validDates = transactionsData.content
        .map((t: Transaction) => new Date(t.transactionDate).getTime())
        .filter((time: number) => !isNaN(time));

      if (validDates.length === 0) return "Dữ liệu ngày chưa khớp";

      const latestTimestamp = Math.max(...validDates);
      const latestDate = new Date(latestTimestamp);

      return formatDistanceToNow(latestDate, { addSuffix: true, locale: vi });
    } catch (error) {
      return "Lỗi định dạng ngày";
    }
  };

  // Tính số lượng bộ lọc đang được áp dụng để hiển thị thông báo
  const activeFiltersCount = [
    filters.categoryId,
    filters.startDate,
    filters.endDate,
    filters.minAmount,
    filters.maxAmount,
  ].filter(Boolean).length;

  // Query: Lấy tất cả transactions (cho export)
  const { data: allTransactions } = useQuery({
    queryKey: ["transactions", "all", filters],
    queryFn: async () => {
      const params: {
        page: number;
        size: number;
        startDate?: string;
        endDate?: string;
      } = {
        page: 0,
        size: 10000,
      };

      if (filters.startDate) {
        params.startDate = filters.startDate;
      }
      if (filters.endDate) {
        params.endDate = filters.endDate;
      }

      const response = await api.get("/transactions", { params });
      return response.data.data?.content || [];
    },
    enabled: showExportModal,
  });

  // Mutation: Tạo transaction mới
  const createMutation = useMutation({
    mutationFn: async (data: {
      categoryId: number;
      amount: number;
      transactionDate: string;
      note?: string;
      location?: string;
      receiptImage?: string;
    }) => {
      const response = await api.post("/transactions", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Thêm giao dịch thành công!");
      setShowAddModal(false);
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Lỗi thêm giao dịch";
      toast.error(errorMessage);
    },
  });

  // Mutation: Cập nhật transaction
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: {
        categoryId?: number;
        amount?: number;
        transactionDate?: string;
        note?: string;
        location?: string;
        receiptImage?: string;
      };
    }) => {
      const response = await api.put(`/transactions/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Cập nhật giao dịch thành công!");
      setShowEditModal(false);
      setEditingTransaction(null);
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Lỗi cập nhật giao dịch";
      toast.error(errorMessage);
    },
  });

  // Mutation: Xóa transaction
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/transactions/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Xóa giao dịch thành công!");
      setShowDeleteModal(false);
      setSelectedTransactions([]);
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Lỗi xóa giao dịch";
      toast.error(errorMessage);
    },
  });

  // Mutation: Xóa nhiều transactions
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      await Promise.all(ids.map((id) => api.delete(`/transactions/${id}`)));
    },
    onSuccess: () => {
      toast.success(`Đã xóa ${selectedTransactions.length} giao dịch!`);
      setSelectedTransactions([]);
      setSelectAll(false);
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: () => {
      toast.error("Lỗi xóa giao dịch");
    },
  });

  // Handler: Apply quick filter
  const applyQuickFilter = useCallback(
    (filter: "today" | "week" | "month" | "year" | "all") => {
      const now = new Date();
      let startDate: string | null = null;
      let endDate: string | null = null;

      switch (filter) {
        case "today":
          startDate = format(startOfDay(now), "yyyy-MM-dd");
          endDate = format(endOfDay(now), "yyyy-MM-dd");
          break;
        case "week":
          startDate = format(subDays(now, 7), "yyyy-MM-dd");
          endDate = format(now, "yyyy-MM-dd");
          break;
        case "month":
          startDate = format(startOfMonth(now), "yyyy-MM-dd");
          endDate = format(endOfMonth(now), "yyyy-MM-dd");
          break;
        case "year":
          startDate = format(new Date(now.getFullYear(), 0, 1), "yyyy-MM-dd");
          endDate = format(new Date(now.getFullYear(), 11, 31), "yyyy-MM-dd");
          break;
        case "all":
          startDate = null;
          endDate = null;
          break;
      }

      setFilters((prev) => ({
        ...prev,
        startDate,
        endDate,
      }));
      setQuickFilter(filter);
      setPage(0);
    },
    []
  );

  // Handler: Clear filters
  const clearFilters = useCallback(() => {
    setFilters({
      search: "",
      categoryId: null,
      startDate: null,
      endDate: null,
      minAmount: null,
      maxAmount: null,
      sortBy: "date",
      sortOrder: "desc",
    });
    setQuickFilter(null);
    setPage(0);
  }, []);

  // Handler: Select transaction
  const toggleSelectTransaction = useCallback((id: number) => {
    setSelectedTransactions((prev) => {
      if (prev.includes(id)) {
        return prev.filter((tId) => tId !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  // Handler: Select all
  const toggleSelectAll = useCallback(() => {
    if (selectAll) {
      setSelectedTransactions([]);
    } else {
      const allIds =
        transactionsData?.content?.map((t: Transaction) => t.id) || [];
      setSelectedTransactions(allIds);
    }
    setSelectAll(!selectAll);
  }, [selectAll, transactionsData]);

  // Handler: Edit transaction
  const handleEdit = useCallback((transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowEditModal(true);
  }, []);

  // Handler: Delete transaction
  const handleDelete = useCallback(
    (id: number) => {
      setEditingTransaction(
        transactionsData?.content?.find((t: Transaction) => t.id === id) || null
      );
      setShowDeleteModal(true);
    },
    [transactionsData]
  );

  // Handler: Bulk delete
  const handleBulkDelete = useCallback(() => {
    if (selectedTransactions.length === 0) {
      toast.error("Vui lòng chọn ít nhất một giao dịch");
      return;
    }

    if (
      confirm(`Bạn có chắc muốn xóa ${selectedTransactions.length} giao dịch?`)
    ) {
      bulkDeleteMutation.mutate(selectedTransactions);
    }
  }, [selectedTransactions, bulkDeleteMutation]);

  // Handler: Import Excel
  const handleImportExcel = useCallback(
    async (file: File) => {
      try {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Validate và transform data
        interface ExcelRow {
          "Danh mục"?: string | number;
          Category?: string | number;
          "Số tiền"?: string | number;
          Amount?: string | number;
          Ngày?: string;
          Date?: string;
          "Ghi chú"?: string;
          Note?: string;
          "Địa điểm"?: string;
          Location?: string;
        }

        interface ParsedTransaction {
          categoryId: number | null;
          amount: number;
          transactionDate: string;
          note: string;
          location: string;
        }

        const transactions = (jsonData as ExcelRow[])
          .map((row): ParsedTransaction => {
            // Map columns (adjust based on your Excel format)
            return {
              categoryId:
                typeof row["Danh mục"] === "number"
                  ? row["Danh mục"]
                  : typeof row["Category"] === "number"
                  ? row["Category"]
                  : null,
              amount: parseFloat(String(row["Số tiền"] || row["Amount"] || 0)),
              transactionDate:
                row["Ngày"] || row["Date"] || format(new Date(), "yyyy-MM-dd"),
              note: row["Ghi chú"] || row["Note"] || "",
              location: row["Địa điểm"] || row["Location"] || "",
            };
          })
          .filter(
            (t): t is ParsedTransaction & { categoryId: number } =>
              t.amount > 0 && t.categoryId !== null
          );

        // Create transactions
        let successCount = 0;
        let errorCount = 0;

        for (const transaction of transactions) {
          try {
            await api.post("/transactions", transaction);
            successCount++;
          } catch (error) {
            errorCount++;
          }
        }

        toast.success(
          `Import thành công ${successCount} giao dịch${
            errorCount > 0 ? `, ${errorCount} lỗi` : ""
          }`
        );
        setShowImportModal(false);
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      } catch (error) {
        console.error("Import error:", error);
        toast.error("Lỗi import file Excel");
      }
    },
    [queryClient]
  );

  // Handler: Export Excel
  const handleExportExcel = useCallback(() => {
    if (!allTransactions || allTransactions.length === 0) {
      toast.error("Không có dữ liệu để export");
      return;
    }

    // Transform data
    const exportData = allTransactions.map((t: Transaction) => ({
      Ngày: format(parseISO(t.transactionDate), "dd/MM/yyyy"),
      "Danh mục": t.category?.name || "",
      "Số tiền": t.amount,
      "Ghi chú": t.note || "",
      "Địa điểm": t.location || "",
    }));

    // Create workbook
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Giao dịch");

    // Generate filename
    const filename = `giao-dich-${format(new Date(), "yyyy-MM-dd")}.xlsx`;

    // Download
    XLSX.writeFile(workbook, filename);
    toast.success("Export Excel thành công!");
    setShowExportModal(false);
  }, [allTransactions]);

  // Handler: Export PDF
  const handleExportPDF = useCallback(() => {
    // PDF export will be handled by PDFDownloadLink component
    toast.success("Đang tạo file PDF...");
  }, []);

  // Tính toán statistics
  const statistics = useMemo(() => {
    if (!transactionsData?.content) {
      return {
        total: 0,
        count: 0,
        average: 0,
        min: 0,
        max: 0,
      };
    }

    const amounts = transactionsData.content.map((t: Transaction) => t.amount);
    const total = amounts.reduce(
      (sum: number, amount: number) => sum + amount,
      0
    );
    const count = amounts.length;
    const average = count > 0 ? total / count : 0;
    const min = amounts.length > 0 ? Math.min(...amounts) : 0;
    const max = amounts.length > 0 ? Math.max(...amounts) : 0;

    return {
      total,
      count,
      average,
      min,
      max,
    };
  }, [transactionsData]);

  // Format currency
  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  }, []);

  // Format date
  const formatDate = useCallback((dateString: string) => {
    return format(parseISO(dateString), "dd/MM/yyyy", { locale: vi });
  }, []);

  // Filtered and sorted transactions
  const processedTransactions = useMemo(() => {
    if (!transactionsData?.content) return [];

    let result = [...transactionsData.content];

    // Apply filters
    if (filters.categoryId) {
      result = result.filter(
        (t: Transaction) => t.category?.id === filters.categoryId
      );
    }

    if (filters.minAmount !== null) {
      result = result.filter(
        (t: Transaction) => t.amount >= filters.minAmount!
      );
    }

    if (filters.maxAmount !== null) {
      result = result.filter(
        (t: Transaction) => t.amount <= filters.maxAmount!
      );
    }

    // Sort
    result.sort((a: Transaction, b: Transaction) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case "date":
          comparison =
            new Date(a.transactionDate).getTime() -
            new Date(b.transactionDate).getTime();
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "category":
          comparison = (a.category?.name || "").localeCompare(
            b.category?.name || ""
          );
          break;
      }

      return filters.sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [transactionsData, filters]);

  // Effect: Reset select all when transactions change
  useEffect(() => {
    if (selectedTransactions.length === 0) {
      setSelectAll(false);
    } else if (selectedTransactions.length === processedTransactions.length) {
      setSelectAll(true);
    }
  }, [selectedTransactions, processedTransactions]);

  // Error handling
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">Lỗi tải dữ liệu</h2>
          <p className="text-base-content/70 mb-4">
            {(error as Error).message}
          </p>
          <button onClick={() => refetch()} className="btn btn-primary">
            Thử lại
          </button>
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
            Quản lý giao dịch
          </h1>

          <div className="flex items-center gap-2 group">
            {/* Chấm tròn hiệu ứng sóng âm - tạo cảm giác dữ liệu thực */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C4B4] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C4B4]"></span>
            </span>

            <span className="text-[13px] font-medium text-slate-400">
              Giao dịch lần cuối cùng:
              <span className="text-slate-600 font-bold ml-1 italic group-hover:text-[#00C4B4] transition-colors">
                {getLastTransactionTime()}
              </span>
            </span>
          </div>
        </div>

        {/*  */}

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Nút Thêm giao dịch - Fix lỗi hiển thị chữ */}
          <button
            onClick={() => setShowAddModal(true)}
            className="btn border-none bg-slate-200 hover:bg-[#00C4B4] hover:text-white text-slate-700 gap-2 transition-all duration-300 shadow-sm"
          >
            <FaPlus size={14} />
            <span className="font-bold">Thêm giao dịch</span>
          </button>

          {/* Nút Import - Hover màu xanh dương */}
          <button
            onClick={() => setShowImportModal(true)}
            className="btn btn-outline border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-slate-900 hover:text-blue-600 gap-2 transition-all duration-300"
          >
            <FaFileImport size={14} />
            <span className="font-semibold">Import</span>
          </button>

          {/* Nút Export - Làm mờ khi disabled và hover màu cam */}
          <button
            onClick={() => setShowExportModal(true)}
            disabled={
              !transactionsData?.content ||
              transactionsData.content.length === 0
            }
            className="btn btn-outline border-slate-200 hover:border-orange-500 hover:bg-orange-50 text-slate-900 hover:text-orange-600 gap-2 transition-all duration-300 disabled:opacity-40 disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-100"
          >
            <FaFileExport size={14} />
            <span className="font-semibold">Export</span>
          </button>

          {/* Nút Thống kê - Hover màu tím */}
          <button
            onClick={() => setShowStatistics(!showStatistics)}
            className="btn btn-ghost hover:bg-purple-50 text-slate-900 hover:text-purple-600 gap-2 transition-all duration-300"
          >
            <FaChartSimple size={14} />
            <span className="font-semibold">Thống kê</span>
          </button>
        </div>
      </div>

      {/* Statistics Panel */}
      <AnimatePresence>
        {showStatistics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-slate-100/80 via-blue-100/50 to-purple-100/50 backdrop-blur-sm border border-white/40 rounded-2xl shadow-sm overflow-hidden relative"
          >
            {/* Subtle Galaxy Background Effects for Statistics */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-200/15 via-purple-200/15 to-pink-200/15"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-300/8 via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-pink-300/8 via-transparent to-transparent"></div>

            <div className="p-6 relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl border-2 border-slate-200 flex items-center justify-center">
                    <FaChartSimple className="text-slate-600 text-lg" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">
                      Thống kê
                    </h3>
                    <p className="text-sm text-slate-500">
                      Tổng quan giao dịch hiện tại
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {/* Tổng chi */}
                <div className="bg-white rounded-xl p-4 border-2 border-slate-200 hover:border-[#00C4B4] transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#00C4B4] uppercase tracking-wider">
                      Tổng chi
                    </span>
                    <div className="w-6 h-6 rounded-lg border border-[#00C4B4]/30 flex items-center justify-center group-hover:border-[#00C4B4] transition-colors">
                      <FaMoneyBill1Wave className="text-[#00C4B4] text-sm" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-800 leading-none">
                    {formatCurrency(statistics.total)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Tổng số tiền đã chi
                  </div>
                </div>

                {/* Số lượng */}
                <div className="bg-white rounded-xl p-4 border-2 border-slate-200 hover:border-blue-500 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                      Số lượng
                    </span>
                    <div className="w-6 h-6 rounded-lg border border-blue-500/30 flex items-center justify-center group-hover:border-blue-500 transition-colors">
                      <FaListUl className="text-blue-600 text-sm" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-800 leading-none">
                    {statistics.count}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Giao dịch đã thực hiện
                  </div>
                </div>

                {/* Thấp nhất */}
                <div className="bg-white rounded-xl p-4 border-2 border-slate-200 hover:border-green-500 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-green-600 uppercase tracking-wider">
                      Thấp nhất
                    </span>
                    <div className="w-6 h-6 rounded-lg border border-green-500/30 flex items-center justify-center group-hover:border-green-500 transition-colors">
                      <FaArrowTrendDown className="text-green-600 text-sm" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-800 leading-none">
                    {formatCurrency(statistics.min)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Giao dịch nhỏ nhất
                  </div>
                </div>

                {/* Cao nhất */}
                <div className="bg-white rounded-xl p-4 border-2 border-slate-200 hover:border-red-500 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                      Cao nhất
                    </span>
                    <div className="w-6 h-6 rounded-lg border border-red-500/30 flex items-center justify-center group-hover:border-red-500 transition-colors">
                      <FaArrowTrendUp className="text-red-600 text-sm" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-800 leading-none">
                    {formatCurrency(statistics.max)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Giao dịch lớn nhất
                  </div>
                </div>

                {/* Trung bình */}
                <div className="bg-white rounded-xl p-4 border-2 border-slate-200 hover:border-purple-500 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                      Trung bình
                    </span>
                    <div className="w-6 h-6 rounded-lg border border-purple-500/30 flex items-center justify-center group-hover:border-purple-500 transition-colors">
                      <FaEquals className="text-purple-600 text-sm" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-800 leading-none">
                    {formatCurrency(statistics.average)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Trung bình mỗi giao dịch
                  </div>
                </div>
              </div>

              {/* Footer với thông tin thêm */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00C4B4] animate-pulse"></div>
                  <span className="text-xs text-slate-500">
                    Dữ liệu được cập nhật theo thời gian thực
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Tổng {statistics.count} giao dịch
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {categoriesStats.map((item, index) => {
          // Xác định màu viền tương ứng với từng thẻ
          const borderColors: { [key: string]: string } = {
            "Ăn uống": "hover:border-orange-400",
            "Đi chơi": "hover:border-purple-400",
            "Xe cộ": "hover:border-blue-400",
            Khác: "hover:border-[#00C4B4]",
          };

          // Xác định màu icon tương ứng
          const iconColors: { [key: string]: string } = {
            "Ăn uống": "text-orange-500",
            "Đi chơi": "text-purple-500",
            "Xe cộ": "text-blue-500",
            Khác: "text-[#00C4B4]",
          };

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.98 }}
              className={`bg-white border-2 border-slate-200 rounded-2xl shadow-sm transition-all duration-300 relative
          ${borderColors[item.title] || "hover:border-slate-300"}
        `}
            >
              <div className="p-6">
                {/* Top: Icon & Dropdown */}
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl border-2 border-slate-100 flex items-center justify-center text-2xl ${
                      iconColors[item.title]
                    } bg-white shadow-sm`}
                  >
                    {(() => {
                      const iconName =
                        typeof item.icon === "string" ? item.icon : "";
                      type IconComponentType = React.ComponentType<{
                        className?: string;
                      }>;
                      const IconComponent = iconName
                        ? (FaIcons as Record<string, IconComponentType>)[
                            iconName
                          ]
                        : null;
                      return IconComponent ? (
                        <IconComponent />
                      ) : (
                        <span>{item.icon}</span>
                      );
                    })()}
                  </div>

                  <div className="dropdown dropdown-end">
                    <div
                      tabIndex={0}
                      role="button"
                      className="btn btn-ghost btn-sm btn-circle text-slate-300 hover:text-slate-600"
                    >
                      <Fa6.FaEllipsisVertical size={16} />
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content z-10 menu p-2 shadow bg-white rounded-box custom-dropdown-width"
                    >
                      <li className="menu-title">
                        <span className="text-xs font-semibold text-slate-600">
                          Thời gian
                        </span>
                      </li>

                      {["today", "week", "month"].map((type) => {
                        const isActive = cardTimeframes[item.title] === type;

                        return (
                          <li key={type}>
                            <a
                              onClick={(e) => {
                                e.preventDefault();
                                setCardTimeframes((prev) => ({
                                  ...prev,
                                  [item.title]: type,
                                }));
                                // Close dropdown
                                const dropdown =
                                  e.currentTarget.closest(".dropdown");
                                if (dropdown) {
                                  const trigger = dropdown.querySelector(
                                    '[tabindex="0"]'
                                  ) as HTMLElement;
                                  trigger?.blur();
                                }
                              }}
                              className={`text-sm ${
                                isActive
                                  ? "bg-primary text-white"
                                  : "text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              {timeframeLabels[type]}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                {/* Info: Tiêu đề và mốc thời gian */}
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                      {item.title}
                    </span>
                    <span className="text-xs font-semibold text-[#00C4B4] uppercase">
                      {timeframeLabels[cardTimeframes[item.title]]}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-800 tracking-tight">
                      {item.amount}
                    </span>
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      VNĐ
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Header với tìm kiếm và bộ lọc */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center !mb-6 gap-4 ">
        {/* Bên trái: Tiêu đề với số lượng */}
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-slate-800">
            Lịch sử giao dịch ({processedTransactions.length})
          </h3>
        </div>

        {/* Bên phải: Thanh tìm kiếm, dropdown sắp xếp và nút bộ lọc */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Thanh tìm kiếm */}
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="Tìm kiếm giao dịch..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="input input-sm bg-white border-slate-200 focus:border-[#00C4B4] focus:outline-none pl-10 pr-4 w-full sm:w-64"
            />
            <FaMagnifyingGlass
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={14}
            />
          </div>

          {/* Nút Toggle Filter */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn btn-sm gap-2 transition-all duration-300 ${
              showFilters
                ? "bg-[#00C4B4] text-white border-[#00C4B4] hover:bg-[#00a89a]"
                : "bg-white text-slate-600 border-slate-200 hover:border-[#00C4B4] hover:text-[#00C4B4]"
            }`}
          >
            <FaFilter size={12} />
            <span className="text-sm font-semibold">Bộ lọc</span>
          </button>
        </div>
      </div>

      {/* Container chứa Filters với hiệu ứng trượt */}
      <div
        className={`transition-all duration-500 !mt-0 ease-in-out ${
          showFilters
            ? "max-h-[2000px] opacity-100 mb-8"
            : "max-h-0 opacity-0 pointer-events-none overflow-hidden"
        }`}
      >
        <div className="card bg-white shadow-xl border border-slate-100 rounded-2xl">
          <div className="card-body p-6">
            {/* Quick Filters - Chuyển lên đầu */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 flex-wrap gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-l font-bold text-slate-600 tracking-wider mr-2">
                  Lọc nhanh:
                </span>
                {["today", "week", "month", "year", "all"].map((type) => (
                  <button
                    key={type}
                    onClick={() =>
                      applyQuickFilter(
                        type as "today" | "week" | "month" | "year" | "all"
                      )
                    }
                    className={`btn btn-sm px-4 font-medium ${
                      quickFilter === type
                        ? "bg-[#00C4B4] text-white border-none shadow-md"
                        : "btn-ghost text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    {type === "today"
                      ? "Hôm nay"
                      : type === "week"
                      ? "Tuần này"
                      : type === "month"
                      ? "Tháng này"
                      : type === "year"
                      ? "Năm nay"
                      : "Tất cả"}
                  </button>
                ))}
                {/* Badge "Đang lọc" nằm cùng hàng */}
                {activeFiltersCount > 0 && (
                  <span className="badge bg-[#00C4B4] border-none text-white px-3 py-4 text-sm font-semibold ml-3 ">
                    Đang lọc {activeFiltersCount} mục
                  </span>
                )}
              </div>

              <button
                onClick={clearFilters}
                className="btn btn-sm btn-ghost text-error hover:bg-error/10 font-medium"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>

            {/* Main Filters Grid - 5 columns layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* Category */}
              <div className="form-control w-full">
                <label className="label pb-1">
                  <span className="label-text font-semibold text-slate-700 text-sm">
                    Danh mục
                  </span>
                </label>
                <div className="relative group">
                  <div className="dropdown dropdown-bottom w-full">
                    <div
                      tabIndex={0}
                      role="button"
                      className="w-full text-[13px] rounded-[0.5rem] bg-slate-50/50 border-2 border-slate-200 px-4 py-[0.5rem] focus:border-[#00C4B4] focus:bg-white transition-all duration-200 text-slate-700 cursor-pointer hover:border-slate-300 flex items-center justify-between pl-9"
                    >
                      <span>
                        {filters.categoryId
                          ? (
                              categories as Array<{ id: number; name: string }>
                            )?.find((cat) => cat.id === filters.categoryId)
                              ?.name || "Tất cả danh mục"
                          : "Tất cả danh mục"}
                      </span>
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
                      className="dropdown-content z-[1] menu p-2 shadow-lg bg-white w-full border border-slate-200 mt-1"
                      style={{
                        maxHeight: "400px",
                        overflowY: "auto",
                        overflowX: "hidden",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        display: "block",
                        width: "100%",
                      }}
                    >
                      <li
                        className="w-full mb-1"
                        style={{ display: "block", width: "100%" }}
                      >
                        <button
                          onClick={() =>
                            setFilters({ ...filters, categoryId: null })
                          }
                          className={`px-4 py-3 transition-all duration-200 text-left w-full text-sm font-medium block ${
                            !filters.categoryId
                              ? "bg-[#00C4B4] text-white"
                              : "text-slate-700 hover:bg-slate-100"
                          }`}
                          style={{ display: "block", width: "100%" }}
                        >
                          Tất cả danh mục
                        </button>
                      </li>
                      {categories && categories.length > 0 ? (
                        (
                          categories as Array<{
                            id: number;
                            name: string;
                            icon?: string;
                            color?: string;
                          }>
                        ).map((cat) => (
                          <li
                            key={cat.id}
                            className="w-full mb-1"
                            style={{ display: "block", width: "100%" }}
                          >
                            <button
                              onClick={() =>
                                setFilters({ ...filters, categoryId: cat.id })
                              }
                              className={`px-4 py-3 transition-all duration-200 text-left w-full text-sm font-medium block ${
                                filters.categoryId === cat.id
                                  ? "bg-[#00C4B4] text-white"
                                  : "text-slate-700 hover:bg-slate-100"
                              }`}
                              style={{ display: "block", width: "100%" }}
                            >
                              {cat.name}
                            </button>
                          </li>
                        ))
                      ) : (
                        <li
                          className="w-full mb-1"
                          style={{ display: "block", width: "100%" }}
                        >
                          <div className="px-4 py-3 text-sm text-slate-500">
                            Đang tải danh mục...
                          </div>
                        </li>
                      )}
                    </ul>
                  </div>
                  <FaLayerGroup
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00C4B4] transition-colors"
                    size={14}
                  />
                </div>
              </div>

              {/* Date From */}
              <div className="form-control w-full">
                <label className="label pb-1">
                  <span className="label-text font-semibold text-slate-700 text-sm">
                    Từ ngày
                  </span>
                </label>
                <div className="relative">
                  <DatePicker
                    value={filters.startDate || ""}
                    onChange={(value) =>
                      setFilters({ ...filters, startDate: value || null })
                    }
                    placeholder="Chọn ngày bắt đầu"
                    className="input-sm bg-slate-50/50 border-slate-200"
                  />
                </div>
              </div>

              {/* Date To */}
              <div className="form-control w-full">
                <label className="label pb-1">
                  <span className="label-text font-semibold text-slate-700 text-sm">
                    Đến ngày
                  </span>
                </label>
                <div className="relative">
                  <DatePicker
                    value={filters.endDate || ""}
                    onChange={(value) =>
                      setFilters({ ...filters, endDate: value || null })
                    }
                    placeholder="Chọn ngày kết thúc"
                    className="input-sm bg-slate-50/50 border-slate-200"
                  />
                </div>
              </div>

              {/* Min Amount */}
              <div className="form-control w-full">
                <label className="label pb-1">
                  <span className="label-text font-semibold text-slate-700 text-sm">
                    Số tiền từ
                  </span>
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    className="input input-sm  rounded-[0.5rem] h-[2.5rem] w-full pl-9 focus:outline-none focus:border-[#00C4B4] bg-slate-50/50 border-slate-200"
                    placeholder="0"
                    value={formatNumber(filters.minAmount)}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        minAmount:
                          parseInt(parseNumber(e.target.value)) || null,
                      })
                    }
                  />
                  <FaMoneyBill1Wave
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00C4B4] transition-colors"
                    size={14}
                  />
                </div>
              </div>

              {/* Max Amount */}
              <div className="form-control w-full">
                <label className="label pb-1">
                  <span className="label-text font-semibold text-slate-700 text-sm">
                    Số tiền đến
                  </span>
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    className="input input-sm  rounded-[0.5rem] h-[2.5rem] w-full pl-9 focus:outline-none focus:border-[#00C4B4] bg-slate-50/50 border-slate-200"
                    placeholder="0"
                    value={formatNumber(filters.maxAmount)}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        maxAmount:
                          parseInt(parseNumber(e.target.value)) || null,
                      })
                    }
                  />
                  <FaMoneyBill1Wave
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00C4B4] transition-colors"
                    size={14}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card bg-base-100 shadow-xl mt-0">
        <div className="card-body p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : processedTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="text-6xl mb-4 mt-4 text-slate-300 transition-transform duration-500 hover:scale-110">
                <FaInbox />
              </div>

              <p className="text-slate-500 font-medium">
                Không có dữ liệu hiển thị
              </p>
              <h3 className="text-xl font-bold mb-2">Chưa có giao dịch</h3>
              <p className="text-base-content/70 mb-4">
                {filters.categoryId || filters.startDate
                  ? "Không tìm thấy giao dịch phù hợp với bộ lọc"
                  : "Thêm giao dịch đầu tiên để bắt đầu quản lý chi tiêu"}
              </p>
              {!filters.categoryId && !filters.startDate && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn btn-primary"
                >
                  <FaPlus size={14} />
                  <span className="font-bold">Thêm giao dịch đầu tiên</span>
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-hidden">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary"
                          checked={selectAll}
                          onChange={toggleSelectAll}
                        />

                        {/* Nút Bỏ chọn và Xóa */}
                        {selectedTransactions.length > 0 && (
                          <div className="flex items-center gap-1 ml-2">
                            <button
                              onClick={() => {
                                setSelectedTransactions([]);
                                setSelectAll(false);
                              }}
                              className="btn btn-xs btn-ghost text-slate-500 hover:text-slate-700 hover:bg-slate-100 px-2"
                              title="Bỏ chọn tất cả"
                            >
                              Bỏ chọn
                            </button>

                            <button
                              onClick={handleBulkDelete}
                              className="btn btn-xs btn-error btn-outline hover:bg-red-500 hover:text-white px-2"
                              title={`Xóa ${selectedTransactions.length} mục đã chọn`}
                            >
                              Xóa ({selectedTransactions.length})
                            </button>
                          </div>
                        )}
                      </div>
                    </th>
                    <th>Ngày</th>
                    <th>Danh mục</th>
                    <th>Số tiền</th>
                    <th>Ghi chú</th>
                    <th>Địa điểm</th>
                    <th>Hóa đơn</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {processedTransactions.map((transaction: Transaction) => (
                    <motion.tr
                      key={transaction.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover"
                    >
                      <td className="align-middle px-4">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="peer hidden" // Ẩn input mặc định
                            checked={selectedTransactions.includes(
                              transaction.id
                            )}
                            onChange={() =>
                              toggleSelectTransaction(transaction.id)
                            }
                          />
                          {/* Ô checkbox tùy chỉnh */}
                          <div
                            className={`
      w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center
      ${
        selectedTransactions.includes(transaction.id)
          ? "bg-[#00C4B4] border-[#00C4B4]"
          : "bg-white border-slate-300 hover:border-[#00C4B4] shadow-sm"
      }
    `}
                          >
                            {/* Dấu check hiển thị khi được chọn */}
                            {selectedTransactions.includes(transaction.id) && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3.5 w-3.5 text-white"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        </label>
                      </td>
                      <td>{formatDate(transaction.transactionDate)}</td>
                      <td>
                        <div className="flex items-center gap-3 py-1 hover:bg-slate-50 rounded-lg px-2 -mx-2 transition-all duration-200 cursor-pointer group">
                          {/* Vòng tròn bọc Icon: Nhỏ gọn (w-9 h-9) với hover effect */}
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 group-hover:scale-110 group-hover:shadow-md transition-all duration-200"
                            style={{
                              backgroundColor: `${
                                transaction.category?.color || "#e2e8f0"
                              }20`,
                              color: transaction.category?.color || "#64748b",
                            }}
                          >
                            <span className="text-lg">
                              {(() => {
                                const iconName = transaction.category?.icon;

                                // Danh sách các icon bạn đang dùng từ seed data (cập nhật nếu thêm mới)
                                const validFa6Icons: {
                                  [key: string]: React.ComponentType;
                                } = {
                                  FaBowlFood: Fa6.FaBowlFood, // thay cho FaUtensils (ăn uống)
                                  FaCarSide: Fa6.FaCarSide, // thay cho FaCarSide / FaCar
                                  FaGamepad: Fa6.FaGamepad, // giữ nguyên nếu có
                                  FaCartShopping: Fa6.FaCartShopping, // mua sắm
                                  FaHouse: Fa6.FaHouse, // nhà cửa
                                  FaHeartPulse: Fa6.FaHeartPulse, // sức khỏe
                                  FaPlane: Fa6.FaPlane, // du lịch
                                  FaGraduationCap: Fa6.FaGraduationCap, // học tập
                                  // Thêm các icon khác bạn dùng ở đây
                                };

                                if (!iconName) {
                                  return (
                                    <Fa6.FaFolder
                                      style={{
                                        color:
                                          transaction.category?.color ||
                                          "#00C4B4",
                                      }}
                                    />
                                  );
                                }

                                const IconComponent = validFa6Icons[iconName];

                                if (IconComponent) {
                                  const Icon = IconComponent as any;
                                  return (
                                    <Icon
                                      style={{
                                        color:
                                          transaction.category?.color ||
                                          "#00C4B4",
                                      }}
                                    />
                                  );
                                }

                                // Nếu icon không tồn tại → fallback + cảnh báo để bạn sửa seed data
                                console.warn(
                                  `Icon "${iconName}" không tồn tại trong fa6. Đã thay bằng folder. Vui lòng cập nhật seed data!`
                                );
                                return (
                                  <Fa6.FaFolder
                                    style={{
                                      color:
                                        transaction.category?.color ||
                                        "#00C4B4",
                                    }}
                                  />
                                );
                              })()}
                            </span>
                          </div>

                          {/* Nội dung: Chữ nhỏ lại để bằng kích thước các phần khác */}
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-semibold text-slate-700 truncate group-hover:text-slate-900 transition-colors duration-200">
                              {transaction.category?.name ||
                                "Không có danh mục"}
                            </span>
                            {transaction.note && (
                              <span className="text-[11px] text-slate-400 truncate italic leading-tight group-hover:text-slate-500 transition-colors duration-200">
                                {transaction.note}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="font-bold text-teal-500">
                          {formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td>
                        <span
                          className="truncate max-w-xs block"
                          title={transaction.note}
                        >
                          {transaction.note || "-"}
                        </span>
                      </td>
                      <td>
                        <span
                          className="truncate max-w-xs block"
                          title={transaction.location}
                        >
                          {transaction.location || "-"}
                        </span>
                      </td>
                      <td className="align-middle">
                        {transaction.receiptImage ? (
                          <a
                            href={transaction.receiptImage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-[#00C4B4] hover:text-[#00a89a] font-medium text-[13px] transition-colors"
                          >
                            <FaImage size={16} />
                            <span>Xem ảnh</span>
                          </a>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      <td className="align-middle">
                        <div className="flex items-center gap-1">
                          {/* Nút Sửa */}
                          <button
                            onClick={() => handleEdit(transaction)}
                            className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                            title="Chỉnh sửa"
                          >
                            <FaPen size={14} />
                          </button>

                          {/* Nút Xóa */}
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Xóa"
                          >
                            <FaTrashCan size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {transactionsData && transactionsData.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t">
              <div className="text-sm text-base-content/70">
                Hiển thị {page * size + 1} -{" "}
                {Math.min((page + 1) * size, transactionsData.totalElements)} /{" "}
                {transactionsData.totalElements}
              </div>
              <div className="join">
                <button
                  className="join-item btn btn-sm"
                  onClick={() => setPage(0)}
                  disabled={page === 0}
                >
                  ««
                </button>
                <button
                  className="join-item btn btn-sm"
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
                        className={`join-item btn btn-sm ${
                          page === pageNum ? "btn-active" : ""
                        }`}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  }
                )}
                <button
                  className="join-item btn btn-sm"
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
                  className="join-item btn btn-sm"
                  onClick={() => setPage(transactionsData.totalPages - 1)}
                  disabled={page >= transactionsData.totalPages - 1}
                >
                  »»
                </button>
              </div>
              <select
                className="select select-bordered select-sm"
                value={size}
                onChange={(e) => {
                  setSize(parseInt(e.target.value));
                  setPage(0);
                }}
              >
                <option value="10">10 / trang</option>
                <option value="20">20 / trang</option>
                <option value="50">50 / trang</option>
                <option value="100">100 / trang</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal - REDESIGNED */}
      <AnimatePresence>
        {showAddModal && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            style={{ paddingTop: "80px" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white w-full max-w-2xl max-h-[calc(100vh-160px)] overflow-hidden shadow-2xl border border-slate-200 h-[1000px] rounded-3xl"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-8 py-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                        Thêm giao dịch mới
                      </h2>
                      <p className="text-sm text-slate-500 mt-1">
                        Nhập thông tin chi tiết về giao dịch của bạn
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="w-10 h-10 bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                  >
                    <FaXmark className="text-slate-400 hover:text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div
                className="p-8 overflow-y-auto max-h-[calc(100vh-300px)] pb-0"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                <TransactionForm
                  onSubmit={(data: SubmittedTransaction) => {
                    if (data.categoryId) {
                      createMutation.mutate({
                        categoryId: data.categoryId,
                        amount: data.amount,
                        transactionDate: data.transactionDate,
                        note: data.note,
                        location: data.location,
                        receiptImage: data.receiptImage || undefined,
                      });
                    } else {
                      toast.error("Vui lòng chọn danh mục");
                    }
                  }}
                  onCancel={() => setShowAddModal(false)}
                  loading={createMutation.isPending}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && editingTransaction && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="card bg-base-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="card-body">
                <h2 className="card-title mb-4">Sửa giao dịch</h2>
                <TransactionForm
                  transaction={editingTransaction}
                  onSubmit={(data) => {
                    // Cập nhật chỉ những trường được cung cấp, đảm bảo categoryId hợp lệ nếu có
                    const updateData: Partial<SubmittedTransaction> = {
                      ...data,
                    };
                    if (updateData.categoryId === null) {
                      delete updateData.categoryId;
                    }
                    updateMutation.mutate({
                      id: editingTransaction.id,
                      data: updateData as any, // Cast to any or defined type to avoid optional vs null issues if strict
                    });
                  }}
                  onCancel={() => {
                    setShowEditModal(false);
                    setEditingTransaction(null);
                  }}
                  loading={updateMutation.isPending}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && editingTransaction && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="card bg-base-100 w-full max-w-md"
            >
              <div className="card-body">
                <h2 className="card-title text-error">Xóa giao dịch</h2>
                <p>
                  Bạn có chắc muốn xóa giao dịch{" "}
                  <strong>{formatCurrency(editingTransaction.amount)}</strong>{" "}
                  vào ngày{" "}
                  <strong>
                    {formatDate(editingTransaction.transactionDate)}
                  </strong>
                  ?
                </p>
                <div className="card-actions justify-end mt-4">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setEditingTransaction(null);
                    }}
                    className="btn btn-ghost"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(editingTransaction.id)}
                    className="btn btn-error"
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Đang xóa...
                      </>
                    ) : (
                      "Xóa"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Import Modal */}
      <AnimatePresence>
        {showImportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="card bg-base-100 w-full max-w-md"
            >
              <div className="card-body">
                <h2 className="card-title">Import từ file</h2>
                <p className="text-sm text-base-content/70 mb-4">
                  Chọn file Excel (.xlsx) hoặc CSV (.csv) để import giao dịch
                </p>
                <input
                  type="file"
                  className="file-input file-input-bordered w-full rounded-[0.5rem]"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImportExcel(file);
                    }
                  }}
                />
                <div className="card-actions justify-end mt-4">
                  <div className="card-actions justify-center mt-6 pb-2">
                    <button
                      onClick={() => setShowImportModal(false)}
                      className="group relative flex items-center justify-center gap-2 px-8 py-2.5 
               bg-slate-50 text-slate-500 font-semibold rounded-full
               border border-slate-200 transition-all duration-300
               hover:bg-slate-100 hover:text-slate-800 hover:border-slate-300
               hover:shadow-md active:scale-95"
                    >
                      {/* Icon FaXmark với hiệu ứng xoay khi hover */}
                      <FaXmark className="text-lg transition-transform group-hover:rotate-90 duration-300" />

                      <span>Đóng</span>

                      {/* Hiệu ứng mờ ảo phía sau khi hover */}
                      <div className="absolute inset-0 rounded-full bg-slate-400/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="card bg-base-100 w-full max-w-md"
            >
              <div className="card-body">
                {/* Tiêu đề căn giữa như bạn đã yêu cầu */}
                <h2 className="card-title justify-center w-full mb-2 text-xl font-bold text-slate-800">
                  Export dữ liệu
                </h2>
                <p className="text-sm text-center text-base-content/70 mb-6">
                  Chọn định dạng để export giao dịch của bạn
                </p>

                <div className="space-y-3">
                  {/* Export Excel - Màu xanh lá (Emerald) */}
                  <button
                    onClick={handleExportExcel}
                    className="btn btn-outline w-full rounded-xl border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all flex items-center justify-start gap-4 px-6 group"
                  >
                    <FaFileExcel className="text-xl text-emerald-600 transition-transform group-hover:scale-110" />
                    <span className="font-semibold text-slate-700 group-hover:text-emerald-700">
                      Export Excel (.xlsx)
                    </span>
                  </button>

                  {/* Export PDF - Màu đỏ (Rose/Red) */}
                  <button
                    onClick={handleExportPDF}
                    className="btn btn-outline w-full rounded-xl border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all flex items-center justify-start gap-4 px-6 group"
                  >
                    <FaFilePdf className="text-xl text-rose-600 transition-transform group-hover:scale-110" />
                    <span className="font-semibold text-slate-700 group-hover:text-rose-700">
                      Export PDF (.pdf)
                    </span>
                  </button>
                </div>

                <div className="card-actions justify-center mt-8 pb-2">
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="group relative flex items-center justify-center gap-2 px-8 py-2.5 
               bg-slate-50 text-slate-500 font-semibold rounded-full
               border border-slate-200 transition-all duration-300
               hover:bg-slate-100 hover:text-slate-800 hover:border-slate-300
               hover:shadow-md active:scale-95"
                  >
                    <FaXmark className="text-lg transition-transform group-hover:rotate-90 duration-300" />
                    <span>Đóng cửa sổ</span>

                    {/* Hiệu ứng mờ ảo phía sau khi hover (tùy chọn) */}
                    <div className="absolute inset-0 rounded-full bg-slate-400/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransactionsPage;
