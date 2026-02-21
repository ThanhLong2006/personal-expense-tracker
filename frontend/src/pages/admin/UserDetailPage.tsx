import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import toast from "react-hot-toast";
import TransactionForm from "../../components/transactions/TransactionForm";
import {
  getUserDetail,
  getUserTransactions,
  createTransactionForUser,
  updateUserTransaction,
  deleteUserTransaction,
  type User,
  type Transaction,
} from "../../api/admin";
import { getCategories } from "../../api/categories";
import type { Category } from "../../api/admin";

/**
 * Trang chi tiết user của admin
 * - Xem thông tin user
 * - Quản lý giao dịch của user (thêm, sửa, xóa)
 * - Thống kê giao dịch của user
 */
const AdminUserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = id ? Number(id) : 0;

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const queryClient = useQueryClient();

  // Query: Lấy thông tin user
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery<User>({
    queryKey: ["admin", "user", userId],
    queryFn: async () => {
      const response = await getUserDetail(userId);
      return response.data;
    },
    enabled: !!userId,
  });

  // Query: Lấy categories
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getCategories();
      return Array.isArray(response.data) ? response.data : [];
    },
  });

  // Query: Lấy transactions của user
  const {
    data: transactionsData,
    isLoading: transactionsLoading,
  } = useQuery({
    queryKey: ["admin", "user-transactions", userId, page, size],
    queryFn: async () => {
      const response = await getUserTransactions(userId, { page, size });
      return response.data;
    },
    enabled: !!userId,
  });

  // Mutation: Tạo transaction
  const createMutation = useMutation({
    mutationFn: (data: {
      categoryId: number;
      amount: number;
      transactionDate: string;
      note?: string;
      location?: string;
      receiptImage?: string;
    }) => createTransactionForUser(userId, data),
    onSuccess: () => {
      toast.success("Tạo giao dịch thành công");
      setShowAddModal(false);
      queryClient.invalidateQueries({
        queryKey: ["admin", "user-transactions", userId],
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "statistics"] });
    },
    onError: () => {
      toast.error("Lỗi tạo giao dịch");
    },
  });

  // Mutation: Cập nhật transaction
  const updateMutation = useMutation({
    mutationFn: ({
      transactionId,
      data,
    }: {
      transactionId: number;
      data: {
        categoryId?: number;
        amount?: number;
        transactionDate?: string;
        note?: string;
        location?: string;
        receiptImage?: string;
      };
    }) => updateUserTransaction(userId, transactionId, data),
    onSuccess: () => {
      toast.success("Cập nhật giao dịch thành công");
      setShowEditModal(false);
      setEditingTransaction(null);
      queryClient.invalidateQueries({
        queryKey: ["admin", "user-transactions", userId],
      });
    },
    onError: () => {
      toast.error("Lỗi cập nhật giao dịch");
    },
  });

  // Mutation: Xóa transaction
  const deleteMutation = useMutation({
    mutationFn: (transactionId: number) =>
      deleteUserTransaction(userId, transactionId),
    onSuccess: () => {
      toast.success("Xóa giao dịch thành công");
      setShowDeleteModal(false);
      setEditingTransaction(null);
      queryClient.invalidateQueries({
        queryKey: ["admin", "user-transactions", userId],
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "statistics"] });
    },
    onError: () => {
      toast.error("Lỗi xóa giao dịch");
    },
  });

  // Tính toán thống kê
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

    const amounts = transactionsData.content.map(
      (t: Transaction) => Number(t.amount || 0)
    );
    const total = amounts.reduce((sum: number, a: number) => sum + a, 0);
    const count = amounts.length;
    const average = count > 0 ? total / count : 0;
    const min = amounts.length > 0 ? Math.min(...amounts) : 0;
    const max = amounts.length > 0 ? Math.max(...amounts) : 0;

    return { total, count, average, min, max };
  }, [transactionsData]);

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

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (userError || !user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">Không tìm thấy user</h2>
          <button
            onClick={() => navigate("/admin/users")}
            className="btn btn-primary"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/users")}
            className="btn btn-ghost btn-sm"
          >
            ← Quay lại
          </button>
          <div>
            <h1 className="text-3xl font-bold mb-2">Chi tiết User</h1>
            <p className="text-base-content/70">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          ➕ Thêm giao dịch
        </button>
      </div>

      {/* User Info */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Thông tin User</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-base-content/70">Họ tên</p>
              <p className="font-semibold">{user.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-base-content/70">Email</p>
              <p className="font-semibold">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-base-content/70">Số điện thoại</p>
              <p className="font-semibold">{user.phone || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-base-content/70">Trạng thái</p>
              <span
                className={`badge ${
                  user.status === "ACTIVE"
                    ? "badge-success"
                    : user.status === "DISABLED"
                    ? "badge-error"
                    : "badge-warning"
                }`}
              >
                {user.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-base-content/70">Vai trò</p>
              <span
                className={`badge ${
                  user.role === "ADMIN" ? "badge-primary" : "badge-ghost"
                }`}
              >
                {user.role}
              </span>
            </div>
            <div>
              <p className="text-sm text-base-content/70">Ngày tạo</p>
              <p className="font-semibold">
                {format(new Date(user.createdAt), "dd/MM/yyyy HH:mm", {
                  locale: vi,
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Tổng giao dịch</div>
          <div className="stat-value text-primary text-lg">
            {statistics.count}
          </div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Tổng tiền</div>
          <div className="stat-value text-primary text-lg">
            {formatCurrency(statistics.total)}
          </div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Trung bình</div>
          <div className="stat-value text-primary text-lg">
            {formatCurrency(statistics.average)}
          </div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Thấp nhất</div>
          <div className="stat-value text-primary text-lg">
            {formatCurrency(statistics.min)}
          </div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Cao nhất</div>
          <div className="stat-value text-primary text-lg">
            {formatCurrency(statistics.max)}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-0">
          {transactionsLoading ? (
            <div className="flex items-center justify-center h-64">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : !transactionsData?.content ||
            transactionsData.content.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-bold mb-2">Chưa có giao dịch</h3>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn btn-primary"
              >
                ➕ Thêm giao dịch đầu tiên
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Ngày</th>
                    <th>Danh mục</th>
                    <th>Số tiền</th>
                    <th>Ghi chú</th>
                    <th>Địa điểm</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionsData.content.map((transaction: Transaction) => (
                    <motion.tr
                      key={transaction.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover"
                    >
                      <td>{formatDate(transaction.transactionDate)}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">
                            {transaction.category?.icon || "📁"}
                          </span>
                          <span>
                            {transaction.category?.name || "Không có danh mục"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="font-bold text-primary">
                          {formatCurrency(Number(transaction.amount || 0))}
                        </span>
                      </td>
                      <td>
                        <span className="truncate max-w-xs block" title={transaction.note}>
                          {transaction.note || "-"}
                        </span>
                      </td>
                      <td>
                        <span className="truncate max-w-xs block" title={transaction.location}>
                          {transaction.location || "-"}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingTransaction(transaction);
                              setShowEditModal(true);
                            }}
                            className="btn btn-ghost btn-sm"
                            title="Sửa"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => {
                              setEditingTransaction(transaction);
                              setShowDeleteModal(true);
                            }}
                            className="btn btn-ghost btn-sm text-error"
                            title="Xóa"
                          >
                            🗑️
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
            </div>
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="card bg-base-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="card-body">
                <h2 className="card-title mb-4">Thêm giao dịch cho {user.fullName}</h2>
                <TransactionForm
                  onSubmit={(data) => {
                    createMutation.mutate({
                      categoryId: data.categoryId!,
                      amount: data.amount,
                      transactionDate: data.transactionDate,
                      note: data.note,
                      location: data.location,
                      receiptImage: data.receiptImage || undefined,
                    });
                  }}
                  onCancel={() => setShowAddModal(false)}
                  loading={createMutation.isPending}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Transaction Modal */}
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
                  transaction={{
                    category: editingTransaction.category
                      ? {
                          id: editingTransaction.category.id,
                          type: editingTransaction.category.type,
                        }
                      : null,
                    amount: editingTransaction.amount,
                    transactionDate: editingTransaction.transactionDate,
                    note: editingTransaction.note,
                    location: editingTransaction.location || undefined,
                    receiptImage: editingTransaction.receiptImage || undefined,
                  }}
                  onSubmit={(data) => {
                    updateMutation.mutate({
                      transactionId: editingTransaction.id,
                      data: {
                        categoryId: data.categoryId || undefined,
                        amount: data.amount,
                        transactionDate: data.transactionDate,
                        note: data.note,
                        location: data.location,
                        receiptImage: data.receiptImage || undefined,
                      },
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

      {/* Delete Transaction Modal */}
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
                  <strong>
                    {formatCurrency(Number(editingTransaction.amount || 0))}
                  </strong>{" "}
                  vào ngày{" "}
                  <strong>{formatDate(editingTransaction.transactionDate)}</strong>
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
    </div>
  );
};

export default AdminUserDetailPage;
