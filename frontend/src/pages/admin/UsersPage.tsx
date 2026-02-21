import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaSearch,
  FaFilter,
  FaUser,
  FaLock,
  FaLockOpen,
  FaKey,
  FaCrown,
  FaEye,
  FaTimes,
  FaUserShield,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";
import {
  getUsers,
  lockUser,
  unlockUser,
  resetUserPassword,
  makeAdmin,
  type User,
} from "../../api/admin";

/**
 * LOGIC TỪ CODE 10 - GIỮ NGUYÊN 100%
 */
const AdminUsersPage = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "DISABLED" | "LOCKED"
  >("ALL");
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");

  const queryClient = useQueryClient();

  // Query: Lấy danh sách users
  const {
    data: usersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin", "users", page, size, search, statusFilter],
    queryFn: async () => {
      const response = await getUsers({
        keyword: search || undefined,
        page,
        size,
      });
      return response.data;
    },
  });

  // Filter users by status
  const filteredUsers = useMemo(() => {
    if (!usersData?.content) return [];
    if (statusFilter === "ALL") return usersData.content;
    return usersData.content.filter((u: User) => u.status === statusFilter);
  }, [usersData, statusFilter]);

  // Mutation: Lock user
  const lockMutation = useMutation({
    mutationFn: lockUser,
    onSuccess: () => {
      toast.success("Khóa tài khoản thành công");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "statistics"] });
    },
    onError: () => {
      toast.error("Lỗi khóa tài khoản");
    },
  });

  // Mutation: Unlock user
  const unlockMutation = useMutation({
    mutationFn: unlockUser,
    onSuccess: () => {
      toast.success("Mở khóa tài khoản thành công");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "statistics"] });
    },
    onError: () => {
      toast.error("Lỗi mở khóa tài khoản");
    },
  });

  // Mutation: Reset password
  const resetPasswordMutation = useMutation({
    mutationFn: ({ id, password }: { id: number; password: string }) =>
      resetUserPassword(id, password),
    onSuccess: () => {
      toast.success("Reset mật khẩu thành công");
      setShowResetPasswordModal(false);
      setSelectedUser(null);
      setNewPassword("");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: () => {
      toast.error("Lỗi reset mật khẩu");
    },
  });

  // Mutation: Make admin
  const makeAdminMutation = useMutation({
    mutationFn: makeAdmin,
    onSuccess: () => {
      toast.success("Phân quyền Admin thành công");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: () => {
      toast.error("Lỗi phân quyền Admin");
    },
  });

  const handleLock = (user: User) => {
    if (
      confirm(
        `Bạn có chắc muốn khóa tài khoản của ${user.fullName} (${user.email})?`
      )
    ) {
      lockMutation.mutate(user.id);
    }
  };

  const handleUnlock = (user: User) => {
    if (
      confirm(
        `Bạn có chắc muốn mở khóa tài khoản của ${user.fullName} (${user.email})?`
      )
    ) {
      unlockMutation.mutate(user.id);
    }
  };

  const handleResetPassword = (user: User) => {
    setSelectedUser(user);
    setNewPassword("");
    setShowResetPasswordModal(true);
  };

  const handleMakeAdmin = (user: User) => {
    if (
      confirm(
        `Bạn có chắc muốn phân quyền Admin cho ${user.fullName} (${user.email})?`
      )
    ) {
      makeAdminMutation.mutate(user.id);
    }
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

  /**
   * GIAO DIỆN CHUYÊN NGHIỆP - TEAL THEME
   */
  return (
    <div className="space-y-6 pl-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-[10px]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-slate-800 tracking-tight">
            Quản lý Người dùng
          </h1>

          <div className="flex items-center gap-2 group">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>

            <span className="text-[13px] font-medium text-slate-400">
              Tổng cộng:
              <span className="text-slate-600 font-bold ml-1 italic group-hover:text-teal-500 transition-colors">
                {usersData?.totalElements || 0} users
              </span>
            </span>
          </div>
        </div>
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
                Lọc và tìm kiếm người dùng
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  placeholder="Tìm theo email, tên..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(0);
                  }}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Trạng thái
              </label>
              <select
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors bg-white"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(
                    e.target.value as "ALL" | "ACTIVE" | "DISABLED" | "LOCKED"
                  );
                  setPage(0);
                }}
              >
                <option value="ALL">Tất cả</option>
                <option value="ACTIVE">Hoạt động</option>
                <option value="DISABLED">Vô hiệu</option>
                <option value="LOCKED">Khóa</option>
              </select>
            </div>

            {/* Page Size */}
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

      {/* Users Table - Galaxy Style */}
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
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 p-6">
              <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center mb-4">
                <FaUser className="text-4xl text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Không có users
              </h3>
              <p className="text-slate-500 text-center">
                {search || statusFilter !== "ALL"
                  ? "Không tìm thấy users phù hợp với bộ lọc"
                  : "Chưa có users nào trong hệ thống"}
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
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Vai trò
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Đăng nhập cuối
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user: User, index: number) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-white/20 hover:bg-white/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">
                        #{user.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-md">
                            {user.fullName?.[0]?.toUpperCase() || "U"}
                          </div>
                          <span className="font-semibold text-slate-800">
                            {user.fullName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            user.status === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : user.status === "DISABLED"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {user.status === "ACTIVE" && <FaCheckCircle />}
                          {user.status === "DISABLED" && <FaTimesCircle />}
                          {user.status === "LOCKED" && <FaLock />}
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            user.role === "ADMIN"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {user.role === "ADMIN" && <FaCrown />}
                          {user.role === "ADMIN" ? "ADMIN" : "USER"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {user.lastLoginAt ? (
                          <div className="flex items-center gap-1.5">
                            <FaClock className="text-slate-400" />
                            {formatDate(user.lastLoginAt)}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">
                            Chưa đăng nhập
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/users/${user.id}`}
                            className="w-8 h-8 rounded-lg bg-blue-100 hover:bg-blue-200 flex items-center justify-center text-blue-600 transition-colors"
                            title="Xem chi tiết"
                          >
                            <FaEye size={14} />
                          </Link>
                          {user.status === "ACTIVE" ? (
                            <button
                              onClick={() => handleLock(user)}
                              className="w-8 h-8 rounded-lg bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-600 transition-colors"
                              disabled={lockMutation.isPending}
                              title="Khóa tài khoản"
                            >
                              <FaLock size={14} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUnlock(user)}
                              className="w-8 h-8 rounded-lg bg-green-100 hover:bg-green-200 flex items-center justify-center text-green-600 transition-colors"
                              disabled={unlockMutation.isPending}
                              title="Mở khóa tài khoản"
                            >
                              <FaLockOpen size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => handleResetPassword(user)}
                            className="w-8 h-8 rounded-lg bg-orange-100 hover:bg-orange-200 flex items-center justify-center text-orange-600 transition-colors"
                            title="Reset mật khẩu"
                          >
                            <FaKey size={14} />
                          </button>
                          {user.role !== "ADMIN" && (
                            <button
                              onClick={() => handleMakeAdmin(user)}
                              className="w-8 h-8 rounded-lg bg-purple-100 hover:bg-purple-200 flex items-center justify-center text-purple-600 transition-colors"
                              disabled={makeAdminMutation.isPending}
                              title="Phân quyền Admin"
                            >
                              <FaCrown size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {usersData && usersData.totalPages > 1 && (
            <div className="flex items-center justify-between p-6 border-t border-white/40">
              <div className="text-sm text-slate-600">
                Hiển thị <span className="font-bold">{page * size + 1}</span> -{" "}
                <span className="font-bold">
                  {Math.min((page + 1) * size, usersData.totalElements)}
                </span>{" "}
                / <span className="font-bold">{usersData.totalElements}</span>
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
                  { length: Math.min(5, usersData.totalPages) },
                  (_, i) => {
                    let pageNum: number;
                    if (usersData.totalPages <= 5) {
                      pageNum = i;
                    } else if (page < 3) {
                      pageNum = i;
                    } else if (page > usersData.totalPages - 4) {
                      pageNum = usersData.totalPages - 5 + i;
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
                    setPage((p) => Math.min(usersData.totalPages - 1, p + 1))
                  }
                  disabled={page >= usersData.totalPages - 1}
                >
                  »
                </button>
                <button
                  className="px-3 py-2 rounded-lg bg-white/50 hover:bg-white text-slate-700 font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={() => setPage(usersData.totalPages - 1)}
                  disabled={page >= usersData.totalPages - 1}
                >
                  »»
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reset Password Modal */}
      <AnimatePresence>
        {showResetPasswordModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                      <FaKey className="text-white text-xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">
                        Reset mật khẩu
                      </h2>
                      <p className="text-sm text-slate-500">
                        Tạo mật khẩu mới cho user
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowResetPasswordModal(false);
                      setSelectedUser(null);
                      setNewPassword("");
                    }}
                    className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>

                {/* User Info */}
                <div className="bg-slate-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                      {selectedUser.fullName?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">
                        {selectedUser.fullName}
                      </p>
                      <p className="text-sm text-slate-500">
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Mật khẩu mới *
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setShowResetPasswordModal(false);
                      setSelectedUser(null);
                      setNewPassword("");
                    }}
                    className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => {
                      if (!newPassword || newPassword.length < 6) {
                        toast.error("Mật khẩu phải có ít nhất 6 ký tự");
                        return;
                      }
                      resetPasswordMutation.mutate({
                        id: selectedUser.id,
                        password: newPassword,
                      });
                    }}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={resetPasswordMutation.isPending}
                  >
                    {resetPasswordMutation.isPending ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Đang xử lý...
                      </span>
                    ) : (
                      "Reset mật khẩu"
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

export default AdminUsersPage;
