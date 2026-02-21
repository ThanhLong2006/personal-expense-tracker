import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FaPlus,
  FaTrashCan,
  FaChartSimple,
  FaXmark,
  FaMagnifyingGlass,
  FaFilter,
  FaEllipsisVertical,
  FaPen,
  FaCheck,
  FaLayerGroup,
  FaArrowTrendUp,
  FaArrowTrendDown,
  FaCoins,
  FaHouse,
  FaCartShopping,
  FaBurger,
  FaCarSide,
  FaGamepad as FaGamepadSolid,
  FaHeartPulse,
  FaGifts,
  FaBookOpen,
  FaHeadphones,
  FaCameraRetro,
  FaPlaneUp,
  FaShirt,
  FaDesktop,
  FaMoneyBills,
  FaMugHot,
  FaBusSimple,
  FaVideo,
  FaUserGraduate,
  FaKitMedical,
} from "react-icons/fa6";
import {
  FaUtensils,
  FaCar,
  FaGamepad,
  FaHome,
  FaShoppingCart,
  FaHeart,
  FaGift,
  FaBook,
  FaMusic,
  FaCamera,
  FaPlane,
  FaTshirt,
  FaLaptop,
  FaMoneyBill,
  FaCoffee,
  FaBus,
  FaFilm,
  FaGraduationCap,
  FaMedkit,
} from "react-icons/fa";

// ============================================
// LOGIC TỪ CODE 5 - Import API functions
// ============================================
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/categories";
import QuickActions from "../../components/dashboard/QuickActions";

/**
 * Interface cho Category (từ code 5)
 */
interface Category {
  id: number;
  name: string;
  color?: string;
  icon?: string;
  type: "expense" | "income";
  systemDefault?: boolean;
  transactionCount?: number;
  totalAmount?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Interface cho CategoryForm (từ code 5)
 */
interface CategoryForm {
  name: string;
  color: string;
  icon: string;
  type: "expense" | "income";
}

/**
 * Interface cho Filter (từ giao diện code 4)
 */
interface Filter {
  search: string;
  type: "all" | "income" | "expense";
  sortBy: "name" | "count" | "amount" | "date";
  sortOrder: "asc" | "desc";
}

/**
 * Component CategoriesPage chính
 */
const CategoriesPage = () => {
  const queryClient = useQueryClient();

  // ============================================
  // LOGIC TỪ CODE 5 - Helper function
  // ============================================
  const extractErrorMessage = (err: unknown, fallback = "Lỗi") => {
    if (!err) return fallback;
    if (typeof err === "string") return err;
    if (err instanceof Error) return err.message;
    const axiosLike = err as { response?: { data?: { message?: string } } };
    return axiosLike.response?.data?.message || fallback;
  };

  // State quản lý pagination
  const [page, setPage] = useState(0);
  const [size] = useState(20);

  // State quản lý filters
  const [filters, setFilters] = useState<Filter>({
    search: "",
    type: "all",
    sortBy: "name",
    sortOrder: "asc",
  });

  // State quản lý modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // State quản lý selected categories
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  // State quản lý editing category
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // State quản lý statistics
  const [showStatistics, setShowStatistics] = useState(false);

  // Show filter
  const [showFilters, setShowFilters] = useState(false);

  // State cho form thêm/sửa danh mục (từ code 5)
  const [formData, setFormData] = useState<CategoryForm>({
    name: "",
    color: "#ff0000",
    icon: "🍔",
    type: "expense",
  });

  // State cho form fields riêng (từ code 4)
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState<"expense" | "income">(
    "expense"
  );
  const [selectedIcon, setSelectedIcon] = useState("FaUtensils");

  // Force refresh state
  const [refreshKey, setRefreshKey] = useState(0);

  // Available icons (từ giao diện code 4)
  const availableIcons = [
    { name: "FaUtensils", component: FaBurger, label: "Ăn uống" },
    { name: "FaCar", component: FaCarSide, label: "Xe cộ" },
    { name: "FaGamepad", component: FaGamepadSolid, label: "Giải trí" },
    { name: "FaHome", component: FaHouse, label: "Nhà cửa" },
    { name: "FaShoppingCart", component: FaCartShopping, label: "Mua sắm" },
    { name: "FaHeart", component: FaHeartPulse, label: "Sức khỏe" },
    { name: "FaGift", component: FaGifts, label: "Quà tặng" },
    { name: "FaBook", component: FaBookOpen, label: "Giáo dục" },
    { name: "FaMusic", component: FaHeadphones, label: "Âm nhạc" },
    { name: "FaCamera", component: FaCameraRetro, label: "Nhiếp ảnh" },
    { name: "FaPlane", component: FaPlaneUp, label: "Du lịch" },
    { name: "FaTshirt", component: FaShirt, label: "Thời trang" },
    { name: "FaLaptop", component: FaDesktop, label: "Công nghệ" },
    { name: "FaMoneyBill", component: FaMoneyBills, label: "Tiền bạc" },
    { name: "FaCoffee", component: FaMugHot, label: "Cà phê" },
    { name: "FaBus", component: FaBusSimple, label: "Giao thông" },
    { name: "FaFilm", component: FaVideo, label: "Phim ảnh" },
    { name: "FaGraduationCap", component: FaUserGraduate, label: "Học tập" },
    { name: "FaMedkit", component: FaKitMedical, label: "Y tế" },
  ];

  // Tính số lượng bộ lọc đang được áp dụng
  const activeFiltersCount = [filters.search].filter(Boolean).length;

  // ============================================
  // LOGIC TỪ CODE 5 - Queries với defensive parsing
  // ============================================

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["statistics"] });
      toast.success("Thêm danh mục thành công");
      setShowAddModal(false);
      setCategoryName("");
      setSelectedIcon("FaUtensils");
      setCategoryType("expense");
      setFormData({
        name: "",
        color: "#ff0000",
        icon: "🍔",
        type: "expense",
      });
    },
    onError: (err: unknown) =>
      toast.error(extractErrorMessage(err, "Lỗi thêm danh mục")),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryForm }) =>
      updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["statistics"] });
      toast.success("Cập nhật thành công");
      setShowEditModal(false);
      setEditingCategory(null);
    },
    onError: (err: unknown) =>
      toast.error(extractErrorMessage(err, "Lỗi cập nhật")),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["statistics"] });
      toast.success("Đã xóa danh mục");
      setShowDeleteModal(false);
      setEditingCategory(null);
      setSelectedCategories([]);
    },
    onError: (err: unknown) =>
      toast.error(extractErrorMessage(err, "Lỗi xóa danh mục")),
  });

  const deleteManyMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      await Promise.all(ids.map((id) => deleteCategory(id)));
    },
    onSuccess: () => {
      toast.success("Xóa các danh mục thành công!");
      setSelectedCategories([]);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["statistics"] });
    },
    onError: (err: unknown) => {
      toast.error(extractErrorMessage(err, "Lỗi xóa danh mục"));
    },
  });

  // Filtered and sorted categories
  const processedCategories = useMemo(() => {
    const rawCategories = (categories as Category[] | undefined) || [];

    if (!rawCategories || rawCategories.length === 0) {
      return [];
    }

    let result = [...rawCategories];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((c: Category) => {
        return c.name?.toLowerCase().includes(searchLower);
      });
    }

    if (filters.type !== "all") {
      result = result.filter((c: Category) => c.type === filters.type);
    }

    result.sort((a: Category, b: Category) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "count":
          comparison = (a.transactionCount || 0) - (b.transactionCount || 0);
          break;
        case "amount":
          comparison = (a.totalAmount || 0) - (b.totalAmount || 0);
          break;
        case "date":
          comparison =
            new Date(a.createdAt || new Date()).getTime() -
            new Date(b.createdAt || new Date()).getTime();
          break;
      }

      return filters.sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [categories, filters]);

  // Tính toán statistics
  const statistics = useMemo(() => {
    const rawCategories = (categories as Category[] | undefined) || [];

    if (!rawCategories || rawCategories.length === 0) {
      return {
        total: 0,
        income: 0,
        expense: 0,
        totalTransactions: 0,
        totalAmount: 0,
      };
    }

    const total = rawCategories.length;
    const income = rawCategories.filter(
      (c: Category) => c.type === "income"
    ).length;
    const expense = rawCategories.filter(
      (c: Category) => c.type === "expense"
    ).length;
    const totalTransactions = rawCategories.reduce(
      (sum: number, c: Category) => sum + (c.transactionCount || 0),
      0
    );
    const totalAmount = rawCategories.reduce(
      (sum: number, c: Category) => sum + (c.totalAmount || 0),
      0
    );

    return {
      total,
      income,
      expense,
      totalTransactions,
      totalAmount,
    };
  }, [categories]);

  // Format currency
  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  }, []);

  // Handler: Submit form (logic từ code 5)
  const handleSubmit = useCallback(() => {
    if (!categoryName.trim()) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }

    const data: CategoryForm = {
      name: categoryName.trim(),
      type: categoryType,
      icon: selectedIcon,
      color: categoryType === "income" ? "#10B981" : "#EF4444",
    };

    createMutation.mutate(data);
  }, [categoryName, categoryType, selectedIcon, createMutation]);

  // Handler: Edit category
  const handleEdit = useCallback((category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setSelectedIcon(category.icon || "FaUtensils");
    setCategoryType(category.type);
    setFormData({
      name: category.name,
      color: category.color || "#000000",
      icon: category.icon || "📝",
      type: category.type,
    });
    setShowEditModal(true);
  }, []);

  // Handler: Update category (logic từ code 5)
  const handleUpdate = useCallback(() => {
    if (!editingCategory || !categoryName.trim()) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }

    const data: CategoryForm = {
      name: categoryName.trim(),
      icon: selectedIcon,
      color: categoryType === "income" ? "#10B981" : "#EF4444",
      type: categoryType,
    };

    updateMutation.mutate({ id: editingCategory.id, data });
  }, [
    editingCategory,
    categoryName,
    selectedIcon,
    categoryType,
    updateMutation,
  ]);

  // Handler: Delete category
  const handleDelete = useCallback((category: Category) => {
    setEditingCategory(category);
    setShowDeleteModal(true);
  }, []);

  // Handler: Confirm delete (logic từ code 5 với window.confirm)
  const handleConfirmDelete = useCallback(() => {
    if (editingCategory) {
      if (window.confirm("Bạn có chắc muốn xóa danh mục này?")) {
        deleteMutation.mutate(editingCategory.id);
      }
    }
  }, [editingCategory, deleteMutation]);

  // Handler: Delete selected categories
  const handleDeleteSelected = useCallback(() => {
    if (selectedCategories.length > 0) {
      if (
        window.confirm(
          `Bạn có chắc muốn xóa ${selectedCategories.length} danh mục?`
        )
      ) {
        deleteManyMutation.mutate(selectedCategories);
      }
    }
  }, [selectedCategories, deleteManyMutation]);

  // Handler: Toggle category selection
  const handleToggleCategory = useCallback((categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  }, []);

  // Handler: Select all categories
  const handleSelectAll = useCallback(() => {
    if (selectedCategories.length === processedCategories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(processedCategories.map((c) => c.id));
    }
  }, [selectedCategories.length, processedCategories]);

  // Get icon component
  const getIconComponent = useCallback((iconName: string) => {
    type IconComponent = React.ComponentType<{ className?: string }>;
    const iconMap: { [key: string]: IconComponent } = {
      FaUtensils: FaBurger,
      FaCar: FaCarSide,
      FaGamepad: FaGamepadSolid,
      FaHome: FaHouse,
      FaShoppingCart: FaCartShopping,
      FaHeart: FaHeartPulse,
      FaGift: FaGifts,
      FaBook: FaBookOpen,
      FaMusic: FaHeadphones,
      FaCamera: FaCameraRetro,
      FaPlane: FaPlaneUp,
      FaTshirt: FaShirt,
      FaLaptop: FaDesktop,
      FaMoneyBill: FaMoneyBills,
      FaCoffee: FaMugHot,
      FaBus: FaBusSimple,
      FaFilm: FaVideo,
      FaGraduationCap: FaUserGraduate,
      FaMedkit: FaKitMedical,
      ...Object.fromEntries(
        [
          FaUtensils,
          FaCar,
          FaGamepad,
          FaHome,
          FaShoppingCart,
          FaHeart,
          FaGift,
          FaBook,
          FaMusic,
          FaCamera,
          FaPlane,
          FaTshirt,
          FaLaptop,
          FaMoneyBill,
          FaCoffee,
          FaBus,
          FaFilm,
          FaGraduationCap,
          FaMedkit,
        ].map((icon) => [icon.name, icon])
      ),
    };
    return iconMap[iconName] || FaBurger;
  }, []);

  // ============================================
  // GIAO DIỆN CODE 4 - Y CHANG TOÀN BỘ JSX
  // ============================================
  return (
    <div className="space-y-6 pl-6">
      {/* Header - GIAO DIỆN CODE 4 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-[10px]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-slate-800 tracking-tight">
            Quản lý danh mục
          </h1>

          <div className="flex items-center gap-2 group">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C4B4] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C4B4]"></span>
            </span>

            <span className="text-[13px] font-medium text-slate-400">
              Danh mục lần cuối cùng:
              <span className="text-slate-600 font-bold ml-1 italic group-hover:text-[#00C4B4] transition-colors">
                {statistics.total > 0 ? "vừa cập nhật" : "Chưa có danh mục"}
              </span>
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn border-none bg-slate-200 hover:bg-[#00C4B4] hover:text-white text-slate-700 gap-2 transition-all duration-300 shadow-sm"
          >
            <FaPlus size={14} />
            <span className="font-bold">Thêm danh mục</span>
          </button>

          <button
            onClick={() => setShowStatistics(!showStatistics)}
            className="btn btn-ghost hover:bg-purple-50 text-slate-900 hover:text-purple-600 gap-2 transition-all duration-300"
          >
            <FaChartSimple size={14} />
            <span className="font-semibold">Thống kê</span>
          </button>
        </div>
      </div>

      {/* Statistics Panel - GIAO DIỆN CODE 4 */}
      <AnimatePresence>
        {showStatistics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-slate-100/80 via-blue-100/50 to-purple-100/50 backdrop-blur-sm border border-white/40 rounded-2xl shadow-sm overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-200/15 via-purple-200/15 to-pink-200/15"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-300/8 via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-pink-300/8 via-transparent to-transparent"></div>

            <div className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl border-2 border-slate-200 flex items-center justify-center">
                    <FaChartSimple className="text-slate-600 text-lg" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">
                      Thống kê danh mục
                    </h3>
                    <p className="text-sm text-slate-500">
                      Tổng quan danh mục hiện tại
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border-2 border-slate-200 hover:border-[#00C4B4] transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#00C4B4] uppercase tracking-wider">
                      Tổng danh mục
                    </span>
                    <div className="w-6 h-6 rounded-lg border border-[#00C4B4]/30 flex items-center justify-center group-hover:border-[#00C4B4] transition-colors">
                      <FaLayerGroup className="text-[#00C4B4] text-sm" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-800 leading-none">
                    {statistics.total}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Danh mục đã tạo
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border-2 border-slate-200 hover:border-green-500 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-green-600 uppercase tracking-wider">
                      Thu nhập
                    </span>
                    <div className="w-6 h-6 rounded-lg border border-green-500/30 flex items-center justify-center group-hover:border-green-500 transition-colors">
                      <FaArrowTrendUp className="text-green-600 text-sm" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-800 leading-none">
                    {statistics.income}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Danh mục thu nhập
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border-2 border-slate-200 hover:border-red-500 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                      Chi tiêu
                    </span>
                    <div className="w-6 h-6 rounded-lg border border-red-500/30 flex items-center justify-center group-hover:border-red-500 transition-colors">
                      <FaArrowTrendDown className="text-red-600 text-sm" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-800 leading-none">
                    {statistics.expense}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Danh mục chi tiêu
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border-2 border-slate-200 hover:border-purple-500 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                      Tổng tiền
                    </span>
                    <div className="w-6 h-6 rounded-lg border border-purple-500/30 flex items-center justify-center group-hover:border-purple-500 transition-colors">
                      <FaCoins className="text-purple-600 text-sm" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-800 leading-none">
                    {formatCurrency(statistics.totalAmount)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Tổng giá trị giao dịch
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00C4B4] animate-pulse"></div>
                  <span className="text-xs text-slate-500">
                    Dữ liệu được cập nhật theo thời gian thực
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Tổng {statistics.total} danh mục
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters and Search - GIAO DIỆN CODE 4 */}
      <div className=" pt-0 m-0  p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <h2 className="text-lg font-semibold text-slate-800">
            Danh sách danh mục ({processedCategories.length})
          </h2>

          <div className="flex-1">
            <div className="relative justify-self-end">
              <FaMagnifyingGlass
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Tìm kiếm danh mục..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="w-[250px] input-sm pl-10 pr-4  bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-[#00C4B4] focus:bg-white focus:outline-none transition-all duration-200 text-slate-700 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="relative min-w-[150px]">
            <div className="dropdown dropdown-bottom dropdown-end w-full">
              <div
                tabIndex={0}
                role="button"
                className="w-full h-10 py-0 bg-slate-50 border-2 border-slate-200 rounded-xl px-4 focus:border-[#00C4B4] focus:bg-white transition-all duration-200 text-slate-700 cursor-pointer hover:border-slate-300 flex items-center justify-between text-sm"
              >
                <span>
                  {filters.sortBy === "name" &&
                    filters.sortOrder === "asc" &&
                    "Tên A-Z"}
                  {filters.sortBy === "name" &&
                    filters.sortOrder === "desc" &&
                    "Tên Z-A"}
                  {filters.sortBy === "date" &&
                    filters.sortOrder === "asc" &&
                    "Lâu nhất"}
                  {filters.sortBy === "date" &&
                    filters.sortOrder === "desc" &&
                    "Mới đây"}
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
                className="dropdown-content z-[1] menu p-1 shadow-lg bg-white rounded-lg w-full border border-slate-200 mt-1"
              >
                <li>
                  <button
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        sortBy: "name",
                        sortOrder: "asc",
                      }))
                    }
                    className={`px-3 py-2 rounded-md transition-all duration-200 text-left w-full ${
                      filters.sortBy === "name" && filters.sortOrder === "asc"
                        ? "bg-slate-100 text-slate-800 font-medium"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Tên A-Z
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        sortBy: "name",
                        sortOrder: "desc",
                      }))
                    }
                    className={`px-3 py-2 rounded-md transition-all duration-200 text-left w-full ${
                      filters.sortBy === "name" && filters.sortOrder === "desc"
                        ? "bg-slate-100 text-slate-800 font-medium"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Tên Z-A
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        sortBy: "date",
                        sortOrder: "asc",
                      }))
                    }
                    className={`px-3 py-2 rounded-md transition-all duration-200 text-left w-full ${
                      filters.sortBy === "date" && filters.sortOrder === "asc"
                        ? "bg-slate-100 text-slate-800 font-medium"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Lâu nhất
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        sortBy: "date",
                        sortOrder: "desc",
                      }))
                    }
                    className={`px-3 py-2 rounded-md transition-all duration-200 text-left w-full ${
                      filters.sortBy === "date" && filters.sortOrder === "desc"
                        ? "bg-slate-100 text-slate-800 font-medium"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Mới đây
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => {
              console.log(
                "Filter button clicked - placeholder for future features"
              );
            }}
            className="px-6 h-10 py-0 rounded-xl border-2 font-medium text-sm transition-all duration-200 flex items-center gap-2 min-w-[120px] justify-center bg-white border-slate-200 text-slate-600 hover:border-[#00C4B4] hover:text-[#00C4B4] hover:bg-slate-50"
          >
            <FaFilter size={14} />
            <span>Bộ lọc</span>
          </button>
        </div>
      </div>

      {/* Categories Grid - GIAO DIỆN CODE 4 */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-col ">
            <div className="flex items-center justify-between">
              {/* Type Filter Tabs */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, type: "all" }))
                  }
                  className={`px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 ${
                    filters.type === "all"
                      ? "border-[#00C4B4] text-[#00C4B4] bg-[#00C4B4]/5"
                      : "border-slate-200 text-slate-600 hover:border-[#00C4B4] hover:text-[#00C4B4] bg-white"
                  }`}
                >
                  Tất cả ({statistics.total})
                </button>
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, type: "income" }))
                  }
                  className={`px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 ${
                    filters.type === "income"
                      ? "border-green-500 text-green-600 bg-green-50"
                      : "border-slate-200 text-slate-600 hover:border-green-500 hover:text-green-600 bg-white"
                  }`}
                >
                  Thu nhập ({statistics.income})
                </button>
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, type: "expense" }))
                  }
                  className={`px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 ${
                    filters.type === "expense"
                      ? "border-red-500 text-red-600 bg-red-50"
                      : "border-slate-200 text-slate-600 hover:border-red-500 hover:text-red-600 bg-white"
                  }`}
                >
                  Chi tiêu ({statistics.expense})
                </button>
              </div>

              {/* Select All Checkbox */}
              {processedCategories.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-between">
                    {processedCategories.length > 0 &&
                      selectedCategories.length > 0 && (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setSelectedCategories([])}
                            className="btn btn-sm border-2 border-blue-500 text-blue-600 bg-transparent hover:border-blue-600 hover:text-blue-700"
                          >
                            Bỏ chọn
                          </button>
                          <button
                            onClick={handleDeleteSelected}
                            className="btn btn-sm border-2 border-red-500 text-red-600 bg-transparent hover:border-red-600 hover:text-red-700"
                            disabled={deleteManyMutation.isPending}
                          >
                            Xóa ({selectedCategories.length} mục)
                          </button>
                        </div>
                      )}
                  </div>
                  <input
                    type="checkbox"
                    checked={
                      selectedCategories.length === processedCategories.length
                    }
                    onChange={handleSelectAll}
                    className="checkbox checkbox-sm checkbox-primary"
                  />
                  <span className="text-sm text-slate-600">Chọn tất cả</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="loading loading-spinner loading-lg text-[#00C4B4]"></div>
            </div>
          ) : processedCategories.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-4">Không có danh mục nào</div>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn btn-primary gap-2"
              >
                <FaPlus size={14} />
                Thêm danh mục đầu tiên
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {processedCategories.map((category, index) => {
                const IconComponent = getIconComponent(category.icon || "");
                const isSelected = selectedCategories.includes(category.id);

                return (
                  <motion.div
                    key={category.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      delay: index * 0.05,
                      duration: 0.3,
                      ease: "easeOut",
                    }}
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative bg-white rounded-xl p-4 border-2 transition-all duration-300 hover:shadow-lg cursor-pointer ${
                      isSelected
                        ? "border-[#00C4B4] bg-[#00C4B4]/5 shadow-lg shadow-[#00C4B4]/20"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {/* Selection Checkbox */}
                    <div className="absolute top-2 left-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleCategory(category.id)}
                        className="checkbox checkbox-sm checkbox-primary"
                      />
                    </div>

                    {/* Actions Menu */}
                    <div className="absolute top-2 right-2">
                      <div className="dropdown dropdown-end">
                        <div
                          tabIndex={0}
                          role="button"
                          className="btn btn-ghost btn-sm btn-circle hover:bg-slate-100"
                        >
                          <FaEllipsisVertical size={14} />
                        </div>
                        <ul
                          tabIndex={0}
                          className="dropdown-content z-[1] menu p-2 shadow-lg bg-white rounded-xl w-40 border border-slate-200"
                        >
                          <li>
                            <button
                              onClick={() => handleEdit(category)}
                              className="gap-2 hover:bg-blue-50 hover:text-blue-600"
                            >
                              <FaPen size={12} />
                              Sửa
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => handleDelete(category)}
                              className="gap-2 text-red-600 hover:bg-red-50"
                            >
                              <FaTrashCan size={12} />
                              Xóa
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Category Content */}
                    <div className="mt-6 flex items-center gap-3">
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-xl border-2 transition-all duration-300 ${
                          category.type === "income"
                            ? "bg-green-50 border-green-200 text-green-600"
                            : "bg-red-50 border-red-200 text-red-600"
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>

                      <div className="flex-1">
                        <div className="mb-1">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              category.type === "income"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {category.type === "income"
                              ? "Thu nhập"
                              : "Chi tiêu"}
                          </span>
                        </div>

                        <h3 className="font-semibold text-slate-800 text-sm leading-tight">
                          {category.name}
                        </h3>

                        {(category.transactionCount ||
                          category.totalAmount) && (
                          <div className="mt-1 text-xs text-slate-500">
                            {category.transactionCount && (
                              <span>{category.transactionCount} giao dịch</span>
                            )}
                            {category.totalAmount && (
                              <span className="ml-2">
                                {formatCurrency(category.totalAmount)}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Category Modal - GIAO DIỆN CODE 4 */}
      {showAddModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md">
            <h3 className="font-bold text-lg mb-4 text-center">
              Thêm danh mục mới
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tên danh mục
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên danh mục..."
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-[#00C4B4] focus:bg-white focus:outline-none transition-all duration-200 text-slate-700 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Loại danh mục
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setCategoryType("expense")}
                    className={`px-4 py-3 rounded-xl border-2 font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                      categoryType === "expense"
                        ? "border-red-500 text-red-600 bg-red-50 shadow-lg shadow-red-500/20"
                        : "border-slate-200 text-slate-600 bg-white hover:border-red-300 hover:text-red-500 hover:bg-red-50"
                    }`}
                  >
                    Chi tiêu
                  </button>
                  <button
                    onClick={() => setCategoryType("income")}
                    className={`px-4 py-3 rounded-xl border-2 font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                      categoryType === "income"
                        ? "border-green-500 text-green-600 bg-green-50 shadow-lg shadow-green-500/20"
                        : "border-slate-200 text-slate-600 bg-white hover:border-green-300 hover:text-green-500 hover:bg-green-50"
                    }`}
                  >
                    Thu nhập
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Chọn biểu tượng
                </label>
                <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto p-3 bg-slate-50 rounded-xl border-2 border-slate-200">
                  {availableIcons.map((icon) => {
                    const IconComponent = icon.component;
                    return (
                      <button
                        key={icon.name}
                        onClick={() => setSelectedIcon(icon.name)}
                        className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-200 hover:scale-105 ${
                          selectedIcon === icon.name
                            ? "border-[#00C4B4] bg-[#00C4B4] text-white shadow-lg shadow-[#00C4B4]/25"
                            : "border-slate-200 bg-white text-slate-600 hover:border-[#00C4B4] hover:text-[#00C4B4]"
                        }`}
                        title={icon.label}
                      >
                        <IconComponent size={18} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setCategoryName("");
                  setSelectedIcon("FaUtensils");
                  setCategoryType("expense");
                }}
                className="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-medium hover:border-slate-300 hover:bg-slate-50 transition-all duration-200"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                disabled={createMutation.isPending}
                className="px-6 py-3 rounded-xl bg-[#00C4B4] text-white font-medium hover:bg-[#00B4A6] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-lg shadow-[#00C4B4]/25"
              >
                {createMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FaCheck size={14} />
                )}
                Thêm danh mục
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal - GIAO DIỆN CODE 4 */}
      {showEditModal && editingCategory && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md">
            <h3 className="font-bold text-lg mb-4 text-center">Sửa danh mục</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tên danh mục
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên danh mục..."
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-[#00C4B4] focus:bg-white focus:outline-none transition-all duration-200 text-slate-700 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Loại danh mục
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className={`px-4 py-3 rounded-xl border-2 font-medium flex items-center justify-center gap-2 ${
                      editingCategory.type === "expense"
                        ? "border-red-500 text-red-600 bg-red-50"
                        : "border-slate-200 text-slate-400 bg-slate-50"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        editingCategory.type === "expense"
                          ? "bg-red-500"
                          : "bg-slate-300"
                      }`}
                    ></div>
                    Chi tiêu
                  </div>
                  <div
                    className={`px-4 py-3 rounded-xl border-2 font-medium flex items-center justify-center gap-2 ${
                      editingCategory.type === "income"
                        ? "border-green-500 text-green-600 bg-green-50"
                        : "border-slate-200 text-slate-400 bg-slate-50"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        editingCategory.type === "income"
                          ? "bg-green-500"
                          : "bg-slate-300"
                      }`}
                    ></div>
                    Thu nhập
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Không thể thay đổi loại danh mục
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Chọn biểu tượng
                </label>
                <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto p-3 bg-slate-50 rounded-xl border-2 border-slate-200">
                  {availableIcons.map((icon) => {
                    const IconComponent = icon.component;
                    return (
                      <button
                        key={icon.name}
                        onClick={() => setSelectedIcon(icon.name)}
                        className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-200 hover:scale-105 ${
                          selectedIcon === icon.name
                            ? "border-[#00C4B4] bg-[#00C4B4] text-white shadow-lg shadow-[#00C4B4]/25"
                            : "border-slate-200 bg-white text-slate-600 hover:border-[#00C4B4] hover:text-[#00C4B4]"
                        }`}
                        title={icon.label}
                      >
                        <IconComponent size={18} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingCategory(null);
                  setCategoryName("");
                  setSelectedIcon("FaUtensils");
                }}
                className="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-medium hover:border-slate-300 hover:bg-slate-50 transition-all duration-200"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdate}
                disabled={updateMutation.isPending}
                className="px-6 py-3 rounded-xl bg-[#00C4B4] text-white font-medium hover:bg-[#00B4A6] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-lg shadow-[#00C4B4]/25"
              >
                {updateMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FaCheck size={14} />
                )}
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal - GIAO DIỆN CODE 4 */}
      {showDeleteModal && editingCategory && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md border-0 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTrashCan className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Xác nhận xóa
              </h3>
            </div>

            <div className="text-center py-4">
              <p className="text-slate-600 mb-2">
                Bạn có chắc chắn muốn xóa danh mục
              </p>
              <p className="text-lg font-semibold text-slate-800 mb-3">
                "{editingCategory.name}"?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-sm text-red-600">
                  ⚠️ Hành động này không thể hoàn tác và sẽ ảnh hưởng đến các
                  giao dịch liên quan.
                </p>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-6">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setEditingCategory(null);
                }}
                className="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-medium hover:border-slate-300 hover:bg-slate-50 transition-all duration-200"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="px-6 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-lg shadow-red-500/25"
              >
                {deleteMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FaTrashCan size={14} />
                )}
                Xóa danh mục
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
