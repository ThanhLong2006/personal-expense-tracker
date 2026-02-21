import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  FaDatabase,
  FaDownload,
  FaPlus,
  FaClock,
  FaFileArchive,
  FaServer,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";
import {
  createBackup,
  listBackups,
  downloadBackup,
  type BackupInfo,
} from "../../api/admin";

dayjs.extend(relativeTime);

/**
 * LOGIC TỪ CODE 13 - GIỮ NGUYÊN 100%
 */
const AdminSystemPage = () => {
  const backupsQuery = useQuery({
    queryKey: ["admin", "backups"],
    queryFn: async () => {
      const response = await listBackups();
      return response.data || [];
    },
  });

  const createBackupMutation = useMutation({
    mutationFn: createBackup,
    onSuccess: () => {
      toast.success("Tạo backup thành công");
      backupsQuery.refetch();
    },
    onError: () => {
      toast.error("Không thể tạo backup");
    },
  });

  const handleDownload = async (fileName: string) => {
    try {
      const response = await downloadBackup(fileName);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success("Đang tải file backup…");
    } catch {
      toast.error("Không thể tải file");
    }
  };

  const formatSize = (size: number) => {
    if (size > 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    }
    if (size > 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    }
    return `${size} B`;
  };

  /**
   * GIAO DIỆN CHUYÊN NGHIỆP - TEAL THEME
   */
  return (
    <div className="space-y-6 pl-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-[10px]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-slate-800 tracking-tight">
            Cấu hình hệ thống
          </h1>

          <div className="flex items-center gap-2 group">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>

            <span className="text-[13px] font-medium text-slate-400">
              Quản lý backup dữ liệu và cấu hình hệ thống
            </span>
          </div>
        </div>

        <button
          onClick={() => createBackupMutation.mutate()}
          disabled={createBackupMutation.isPending}
          className="btn border-none bg-teal-500 hover:bg-teal-600 text-white gap-2 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createBackupMutation.isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span className="font-bold">Đang tạo backup…</span>
            </>
          ) : (
            <>
              <FaPlus size={14} />
              <span className="font-bold">Tạo backup mới</span>
            </>
          )}
        </button>
      </div>

      {/* System Status Cards - Galaxy Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Database Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-400 rounded-2xl p-6 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
              <FaDatabase className="text-teal-400 text-xl" />
            </div>
            <FaCheckCircle className="text-green-500 text-lg" />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
              Database
            </p>
            <p className="text-2xl font-black text-slate-800">Hoạt động</p>
            <p className="text-xs text-slate-400">Kết nối ổn định</p>
          </div>
        </motion.div>

        {/* Server Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white border border-slate-400 rounded-2xl p-6 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
              <FaServer className="text-teal-400 text-xl" />
            </div>
            <FaCheckCircle className="text-green-500 text-lg" />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
              Server
            </p>
            <p className="text-2xl font-black text-slate-800">Online</p>
            <p className="text-xs text-slate-400">Uptime: 99.9%</p>
          </div>
        </motion.div>

        {/* Security Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-400 rounded-2xl p-6 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
              <FaShieldAlt className="text-teal-400 text-xl" />
            </div>
            <FaCheckCircle className="text-green-500 text-lg" />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
              Security
            </p>
            <p className="text-2xl font-black text-slate-800">Bảo mật</p>
            <p className="text-xs text-slate-400">SSL Active</p>
          </div>
        </motion.div>
      </div>

      {/* Backup List - Galaxy Style */}
      <div className="bg-gradient-to-r from-slate-100/60 via-teal-100/40 to-cyan-100/40 backdrop-blur-md border border-white/40 rounded-[1.5rem] shadow-sm overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-200/12 via-cyan-200/12 to-blue-200/12"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-300/6 via-transparent to-transparent"></div>

        <div className="relative z-10 p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <FaFileArchive className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Danh sách backup gần đây
              </h2>
              <p className="text-sm text-slate-500">
                {backupsQuery.data?.length || 0} file backup
              </p>
            </div>
          </div>

          {/* Content */}
          {backupsQuery.isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
                <p className="text-slate-600 font-medium">
                  Đang tải dữ liệu...
                </p>
              </div>
            </div>
          ) : backupsQuery.data?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 p-6">
              <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center mb-4">
                <FaFileArchive className="text-4xl text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Chưa có backup nào
              </h3>
              <p className="text-slate-500 text-center mb-4">
                Hãy tạo backup đầu tiên để bảo vệ dữ liệu của bạn
              </p>
              <button
                onClick={() => createBackupMutation.mutate()}
                disabled={createBackupMutation.isPending}
                className="btn bg-teal-500 hover:bg-teal-600 text-white gap-2"
              >
                <FaPlus />
                Tạo backup đầu tiên
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/40">
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      <FaFileArchive className="inline mr-2" />
                      File
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Kích thước
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      <FaClock className="inline mr-2" />
                      Thời gian
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {backupsQuery.data.map(
                    (backup: BackupInfo, index: number) => (
                      <motion.tr
                        key={backup.fileName}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-white/20 hover:bg-white/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                              <FaFileArchive className="text-teal-600 text-lg" />
                            </div>
                            <span className="font-mono text-sm text-slate-800 font-medium">
                              {backup.fileName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                            {formatSize(backup.size)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <FaClock className="text-slate-400" />
                            <span>{dayjs(backup.lastModified).fromNow()}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDownload(backup.fileName)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg font-medium hover:shadow-lg transition-all text-sm"
                          >
                            <FaDownload size={14} />
                            Tải về
                          </button>
                        </td>
                      </motion.tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Info Card - Galaxy Style */}
      <div className="bg-gradient-to-r from-slate-100/60 via-blue-100/40 to-purple-100/40 backdrop-blur-md border border-white/40 rounded-[1.5rem] shadow-sm overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-200/12 via-purple-200/12 to-teal-200/12"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-300/6 via-transparent to-transparent"></div>

        <div className="relative z-10 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg flex-shrink-0">
              <FaShieldAlt className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Lưu ý về Backup
              </h3>
              <div className="space-y-2 text-sm text-slate-600">
                <p>
                  • Backup được tạo tự động bao gồm toàn bộ dữ liệu database
                </p>
                <p>• Nên tạo backup định kỳ để phòng ngừa mất mát dữ liệu</p>
                <p>• File backup được lưu trữ an toàn trên server</p>
                <p>• Có thể tải về backup bất kỳ lúc nào để khôi phục</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSystemPage;
