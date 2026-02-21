import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaSearch,
  FaFilter,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaFolder,
  FaPalette,
  FaShieldAlt,
  FaUser,
  FaCheckCircle,
  FaChevronDown,
} from "react-icons/fa";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type Category,
} from "../../api/admin";

const AdminCategoriesPage = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">(
    "all"
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "expense" as "income" | "expense",
    icon: "",
    color: "#00C4B4",
    description: "",
    systemDefault: false,
    sortOrder: 0,
  });

  const queryClient = useQueryClient();

  const {
    data: categoriesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin", "categories", page, size, search, typeFilter],
    queryFn: async () => {
      const response = await getAllCategories({
        keyword: search || undefined,
        type: typeFilter !== "all" ? typeFilter : undefined,
        page,
        size,
      });
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success("Tạo category thành công");
      setShowAddModal(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      toast.error("Lỗi tạo category");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Category> }) =>
      updateCategory(id, data),
    onSuccess: () => {
      toast.success("Cập nhật category thành công");
      setShowEditModal(false);
      setEditingCategory(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      toast.error("Lỗi cập nhật category");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.success("Xóa category thành công");
      setShowDeleteModal(false);
      setEditingCategory(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      toast.error("Lỗi xóa category");
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      type: "expense",
      icon: "",
      color: "#00C4B4",
      description: "",
      systemDefault: false,
      sortOrder: 0,
    });
  };

  const handleAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      type: category.type as "income" | "expense",
      icon: category.icon || "",
      color: category.color || "#00C4B4",
      description: category.description || "",
      systemDefault: category.systemDefault,
      sortOrder: 0,
    });
    setShowEditModal(true);
  };

  const handleDelete = (category: Category) => {
    setEditingCategory(category);
    setShowDeleteModal(true);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
  };

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

  return (
    <div className="space-y-6 pl-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-[10px]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-slate-800 tracking-tight">
            Quản lý Categories
          </h1>
          <div className="flex items-center gap-2 group">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <span className="text-[13px] font-medium text-slate-400">
              Tổng cộng:
              <span className="text-slate-600 font-bold ml-1 italic group-hover:text-teal-500 transition-colors">
                {categoriesData?.totalElements || 0} categories
              </span>
            </span>
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="btn border-none bg-teal-500 hover:bg-teal-600 text-white gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <FaPlus size={14} />
          <span className="font-bold">Thêm Category</span>
        </button>
      </div>

      {/* Filters - Galaxy Style */}
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
              <p className="text-sm text-slate-500">Lọc và tìm kiếm danh mục</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tìm kiếm
              </label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors bg-white"
                  placeholder="Tìm theo tên..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(0);
                  }}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Loại
              </label>
              <select
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors bg-white"
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value as "all" | "income" | "expense");
                  setPage(0);
                }}
              >
                <option value="all">Tất cả</option>
                <option value="income">Thu nhập</option>
                <option value="expense">Chi tiêu</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Số lượng / trang
              </label>
              <select
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors bg-white"
                value={size}
                onChange={(e) => {
                  setSize(Number(e.target.value));
                  setPage(0);
                }}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Table */}
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
          ) : !categoriesData?.content ||
            categoriesData.content.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 p-6">
              <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center mb-4">
                <FaFolder className="text-4xl text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Không có categories
              </h3>
              <button
                onClick={handleAdd}
                className="btn bg-teal-500 hover:bg-teal-600 text-white gap-2 mt-4"
              >
                <FaPlus />
                Thêm category đầu tiên
              </button>
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
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Loại
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      System Default
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categoriesData.content.map(
                    (category: Category, index: number) => (
                      <motion.tr
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-white/20 hover:bg-white/30 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-slate-800">
                          #{category.id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
                              style={{
                                backgroundColor: `${
                                  category.color || "#00C4B4"
                                }20`,
                              }}
                            >
                              <span
                                style={{ color: category.color || "#00C4B4" }}
                              >
                                {category.icon || "📁"}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">
                                {category.name}
                              </p>
                              {category.description && (
                                <p className="text-xs text-slate-500 mt-0.5">
                                  {category.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              category.type === "income"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {category.type === "income"
                              ? "Thu nhập"
                              : "Chi tiêu"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              category.systemDefault
                                ? "bg-purple-100 text-purple-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {category.systemDefault ? (
                              <>
                                <FaShieldAlt />
                                System
                              </>
                            ) : (
                              <>
                                <FaUser />
                                User
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {category.userId ? (
                            <Link
                              to={`/admin/users/${category.userId}`}
                              className="text-teal-600 hover:text-teal-700 font-medium hover:underline"
                            >
                              User #{category.userId}
                            </Link>
                          ) : (
                            <span className="text-slate-400 italic">
                              System
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {formatDate(category.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(category)}
                              className="w-8 h-8 rounded-lg bg-blue-100 hover:bg-blue-200 flex items-center justify-center text-blue-600 transition-colors"
                              title="Sửa"
                            >
                              <FaEdit size={14} />
                            </button>
                            {!category.systemDefault && (
                              <button
                                onClick={() => handleDelete(category)}
                                className="w-8 h-8 rounded-lg bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-600 transition-colors"
                                title="Xóa"
                              >
                                <FaTrash size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {categoriesData && categoriesData.totalPages > 1 && (
            <div className="flex items-center justify-between p-6 border-t border-white/40">
              <div className="text-sm text-slate-600">
                Hiển thị <span className="font-bold">{page * size + 1}</span> -{" "}
                <span className="font-bold">
                  {Math.min((page + 1) * size, categoriesData.totalElements)}
                </span>{" "}
                /{" "}
                <span className="font-bold">
                  {categoriesData.totalElements}
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
                  { length: Math.min(5, categoriesData.totalPages) },
                  (_, i) => {
                    let pageNum: number;
                    if (categoriesData.totalPages <= 5) {
                      pageNum = i;
                    } else if (page < 3) {
                      pageNum = i;
                    } else if (page > categoriesData.totalPages - 4) {
                      pageNum = categoriesData.totalPages - 5 + i;
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
                      Math.min(categoriesData.totalPages - 1, p + 1)
                    )
                  }
                  disabled={page >= categoriesData.totalPages - 1}
                >
                  »
                </button>
                <button
                  className="px-3 py-2 rounded-lg bg-white/50 hover:bg-white text-slate-700 font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={() => setPage(categoriesData.totalPages - 1)}
                  disabled={page >= categoriesData.totalPages - 1}
                >
                  »»
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Category Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg">
                      <FaPlus className="text-white text-xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">
                        Thêm Category
                      </h2>
                      <p className="text-sm text-slate-500">Tạo danh mục mới</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Tên category *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Nhập tên category"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Loại *
                    </label>
                    <select
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          type: e.target.value as "income" | "expense",
                        })
                      }
                    >
                      <option value="expense">Chi tiêu</option>
                      <option value="income">Thu nhập</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        <FaFolder className="inline mr-1" />
                        Icon
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                        value={formData.icon}
                        onChange={(e) =>
                          setFormData({ ...formData, icon: e.target.value })
                        }
                        placeholder="📁"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        <FaPalette className="inline mr-1" />
                        Màu sắc
                      </label>
                      <input
                        type="color"
                        className="w-full h-[52px] px-2 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors cursor-pointer"
                        value={formData.color}
                        onChange={(e) =>
                          setFormData({ ...formData, color: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Mô tả
                    </label>
                    <textarea
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors resize-none"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Mô tả category..."
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="font-medium text-slate-800">
                        System Default
                      </p>
                      <p className="text-sm text-slate-500">
                        Category hệ thống mặc định
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={formData.systemDefault}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            systemDefault: e.target.checked,
                          })
                        }
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => {
                      if (!formData.name.trim()) {
                        toast.error("Vui lòng nhập tên category");
                        return;
                      }
                      createMutation.mutate(formData);
                    }}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Đang tạo...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <FaCheckCircle />
                        Tạo category
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Category Modal */}
      <AnimatePresence>
        {showEditModal && editingCategory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-400 flex items-center justify-center shadow-lg">
                      <FaEdit className="text-white text-xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">
                        Sửa Category
                      </h2>
                      <p className="text-sm text-slate-500">
                        Cập nhật thông tin danh mục
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingCategory(null);
                    }}
                    className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Tên category *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Loại *
                    </label>
                    <select
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          type: e.target.value as "income" | "expense",
                        })
                      }
                    >
                      <option value="expense">Chi tiêu</option>
                      <option value="income">Thu nhập</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <FaPalette className="inline mr-1" />
                      Màu sắc
                    </label>
                    <div className="relative">
                      {/* Input color thật – ẩn đi, chỉ dùng để mở bảng chọn màu */}
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) =>
                          setFormData({ ...formData, color: e.target.value })
                        }
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />

                      {/* Ô hiển thị giả – đẹp lung linh, bo tròn hoàn hảo */}
                      <div className="w-full h-[52px] px-4 border-2 border-slate-200 rounded-xl flex items-center gap-4 bg-white shadow-sm hover:shadow transition-shadow focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                        {/* Ô màu tròn to đẹp */}
                        <div
                          className="w-12 h-12 rounded-full shadow-inner border-2 border-white flex-shrink-0"
                          style={{
                            backgroundColor: formData.color || "#e2e8f0",
                          }}
                        />

                        {/* Mã hex + mũi tên chỉ để click */}
                        <div className="flex-1 flex items-center justify-between">
                          <span className="font-mono text-slate-700 select-all">
                            {formData.color || "#e2e8f0"}
                          </span>
                          <FaChevronDown className="text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Mô tả
                    </label>
                    <textarea
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingCategory(null);
                    }}
                    className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => {
                      if (!formData.name.trim()) {
                        toast.error("Vui lòng nhập tên category");
                        return;
                      }
                      updateMutation.mutate({
                        id: editingCategory.id,
                        data: {
                          name: formData.name,
                          type: formData.type,
                          icon: formData.icon,
                          color: formData.color,
                          description: formData.description,
                        },
                      });
                    }}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-500 to-teal-400 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Đang cập nhật...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <FaCheckCircle />
                        Cập nhật
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Category Modal */}
      <AnimatePresence>
        {showDeleteModal && editingCategory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <FaTrash className="text-white text-xl" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">
                      Xóa Category
                    </h2>
                    <p className="text-sm text-slate-500">
                      Hành động này không thể hoàn tác
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="bg-red-50 rounded-xl p-4 mb-6">
                  <p className="text-slate-700">
                    Bạn có chắc muốn xóa category{" "}
                    <span className="font-bold text-red-600">
                      {editingCategory.name}
                    </span>
                    ?
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setEditingCategory(null);
                    }}
                    className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(editingCategory.id)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Đang xóa...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <FaTrash />
                        Xóa
                      </span>
                    )}
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

export default AdminCategoriesPage;
