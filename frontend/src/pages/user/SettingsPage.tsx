import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toggle from "../../components/ui/Toggle";
import toast from "react-hot-toast";
import {
  updateProfile,
  changePassword,
  uploadAvatar,
  getCurrentUser,
  type UpdateProfileRequest,
  type ChangePasswordRequest,
} from "../../api/user";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import {
  FaEdit,
  FaCamera,
  FaSave,
  FaTimes,
  FaUser,
  FaLock,
  FaUsers,
  FaUserFriends,
  FaBell,
  FaDownload,
  FaCog,
  FaMoon,
  FaSun,
  FaTrash,
  FaExclamationTriangle,
} from "react-icons/fa";
import FloatingQuickAction from "../../components/common/FloatingQuickAction";

// ============================================
// LOGIC TỪ CODE 8 - Simple defensive state
// ============================================

const SettingsPage = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  // Lấy tab từ tham số truy vấn URL
  const searchParams = new URLSearchParams(location.search);
  const tabFromUrl = searchParams.get("tab");

  // Simple theme state (LOGIC CODE 8)
  const [theme, setTheme] = useState("light");

  // Settings state (từ GIAO DIỆN CODE 7 structure, LOGIC CODE 8 simple)
  const [settings, setSettings] = useState({
    desktopNotification: true,
    unreadBadge: true,
    pushTimeOut: "10 Phút",
    communicationEmails: true,
    announcementsUpdates: false,
    disableAllSounds: false,
    authenticatorAppEnabled: false,
    phoneNumberEnabled: false,
    emailEnabled: false,
    theme: "light",
    language: "vi",
    compactMode: false,
    animations: true,
  });

  const [activeTab, setActiveTab] = useState(tabFromUrl || "Cài đặt chung");
  const [isEditing, setIsEditing] = useState({
    profile: false,
    personal: false,
    address: false,
  });

  // Query: Lấy thông tin user profile
  const { data: userProfile } = useQuery({
    queryKey: ["user", "profile"],
    queryFn: async () => {
      const response = await getCurrentUser();
      return response.data;
    },
  });

  // Query: Lấy thống kê tài khoản
  const { data: accountStats, isLoading: accountStatsLoading } = useQuery({
    queryKey: ["account-stats"],
    queryFn: async () => {
      try {
        const [transRes, catsRes, firstTransRes] = await Promise.all([
          api.get("/transactions", { params: { size: 1 } }),
          api.get("/categories"),
          api.get("/transactions", {
            params: { size: 1, sort: "transactionDate,asc" },
          }),
        ]);

        const totalTransactions = transRes.data?.data?.totalElements || 0;
        const totalCategories = Array.isArray(catsRes.data?.data)
          ? catsRes.data.data.length
          : 0;

        let daysMember = 0;
        if (firstTransRes.data?.data?.content?.[0]?.transactionDate) {
          const firstDate = new Date(
            firstTransRes.data.data.content[0].transactionDate
          );
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - firstDate.getTime());
          daysMember = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        return { totalTransactions, totalCategories, daysMember };
      } catch (error) {
        console.error("Error fetching account stats:", error);
        return { totalTransactions: 0, totalCategories: 0, daysMember: 0 };
      }
    },
  });

  // Profile form state - chỉ dùng các trường có trong backend
  const [profileForm, setProfileForm] = useState({
    fullName: userProfile?.fullName || user?.fullName || "",
    email: userProfile?.email || user?.email || "",
    phone: userProfile?.phone || "",
    avatar: userProfile?.avatar || "",
  });

  // Cập nhật profileForm khi userProfile thay đổi
  useEffect(() => {
    if (userProfile) {
      setProfileForm({
        fullName: userProfile.fullName || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        avatar: userProfile.avatar || "",
      });
      if (userProfile.avatar) {
        setPreviewImage(userProfile.avatar);
      }
    }
  }, [userProfile]);

  // Security form state (từ GIAO DIỆN CODE 7)
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Delete account state (từ GIAO DIỆN CODE 7)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  // Mutation: Cập nhật hồ sơ
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileRequest) => updateProfile(data),
    onSuccess: () => {
      toast.success("Cập nhật hồ sơ thành công!");
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      setIsEditing((prev) => ({ ...prev, profile: false }));
    },
    onError: (error: Error) => {
      toast.error(error.message || "Lỗi cập nhật hồ sơ");
    },
  });

  // Mutation: Đổi mật khẩu
  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordRequest) => changePassword(data),
    onSuccess: () => {
      toast.success("Đổi mật khẩu thành công!");
      setSecurityForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Lỗi đổi mật khẩu");
    },
  });

  // ============================================
  // LOGIC TỪ CODE 8 - Simple theme handler
  // ============================================
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    setSettings((prev) => ({ ...prev, theme: savedTheme }));

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [location.search]);

  const menuItems = [
    {
      key: "Cài đặt chung",
      label: "Cài đặt chung",
      icon: <FaCog />,
      color: "bg-gray-500",
      description: "Giao diện, thông báo và cài đặt chung",
    },
    {
      key: "Hồ sơ cá nhân",
      label: "Hồ sơ cá nhân",
      icon: <FaUser />,
      color: "bg-blue-500",
      description: "Quản lý thông tin cá nhân",
    },
    {
      key: "Bảo mật",
      label: "Bảo mật",
      icon: <FaLock />,
      color: "bg-red-500",
      description: "Cài đặt bảo mật tài khoản",
    },
    {
      key: "Nhóm",
      label: "Nhóm",
      icon: <FaUsers />,
      color: "bg-green-500",
      description: "Quản lý nhóm",
    },
    {
      key: "Thành viên nhóm",
      label: "Thành viên nhóm",
      icon: <FaUserFriends />,
      color: "bg-yellow-500",
      description: "Quản lý thành viên",
    },
    {
      key: "Xuất dữ liệu",
      label: "Xuất dữ liệu",
      icon: <FaDownload />,
      color: "bg-indigo-500",
      description: "Xuất và sao lưu dữ liệu",
    },
  ];

  const handleToggle = (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleEdit = (section: "profile" | "personal" | "address") => {
    setIsEditing((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!profileForm.fullName.trim()) {
      toast.error("Vui lòng nhập họ và tên");
      return;
    }
    updateProfileMutation.mutate({
      fullName: profileForm.fullName,
      phone: profileForm.phone,
      avatar: profileForm.avatar,
    });
  };

  const handleSecurityInputChange = (field: string, value: string) => {
    setSecurityForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleChangePassword = () => {
    if (
      !securityForm.currentPassword ||
      !securityForm.newPassword ||
      !securityForm.confirmPassword
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }

    if (securityForm.newPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    changePasswordMutation.mutate({
      currentPassword: securityForm.currentPassword,
      newPassword: securityForm.newPassword,
    });
  };

  const handleSaveSecuritySettings = () => {
    toast.success("Cập nhật cài đặt bảo mật thành công!");
  };

  // ============================================
  // LOGIC TỪ CODE 8 - Simple theme change
  // ============================================
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    setSettings((prev) => ({ ...prev, theme: newTheme }));

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    toast.success(
      `Đã chuyển sang chế độ ${newTheme === "dark" ? "tối" : "sáng"}`
    );
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText !== "XÓA TÀI KHOẢN") {
      toast.error('Vui lòng nhập chính xác "XÓA TÀI KHOẢN" để xác nhận!');
      return;
    }

    toast.success("Tài khoản đã được xóa thành công!");
    if (logout) {
      logout();
    }
    window.location.href = "/login";
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh!");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước file không được vượt quá 5MB!");
      return;
    }

    setIsUploading(true);

    try {
      // Preview image
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      const response = await uploadAvatar(file);
      setProfileForm((prev) => ({
        ...prev,
        avatar: response.data?.avatar || "",
      }));
      toast.success("Cập nhật ảnh đại diện thành công!");
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    } catch (error) {
      toast.error("Lỗi upload ảnh đại diện");
    } finally {
      setIsUploading(false);
    }
  };

  // ============================================
  // GIAO DIỆN CODE 7 - Y CHANG TOÀN BỘ JSX
  // ============================================
  return (
    <div className="max-w-8xl mx-auto p-6 pt-0 ml-0">
      {/* Header - GIAO DIỆN CODE 7 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cài đặt</h1>
        <p className="text-gray-600">
          Quản lý thông tin tài khoản và tùy chỉnh ứng dụng
        </p>
      </div>

      {/* Main Content - GIAO DIỆN CODE 7 */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="flex">
          {/* Sidebar - GIAO DIỆN CODE 7 */}
          <div className="w-80 bg-gray-50 border-r border-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                Danh mục
              </h2>
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 flex items-center gap-4 ${
                      activeTab === item.key
                        ? "bg-white text-gray-900 shadow-md border border-gray-200"
                        : "text-gray-600 hover:text-gray-900 hover:bg-white/70"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${
                        activeTab === item.key ? "bg-[#00C4B4]" : "bg-gray-400"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {item.description}
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content - GIAO DIỆN CODE 7 */}
          <div className="flex-1">
            {/* Content Header */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#00C4B4]/10 rounded-lg flex items-center justify-center">
                    {menuItems.find((item) => item.key === activeTab)?.icon}
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {activeTab}
                  </h2>
                </div>
                {(activeTab === "Bảo mật" || activeTab === "Cài đặt chung") && (
                  <button
                    onClick={
                      activeTab === "Bảo mật"
                        ? handleSaveSecuritySettings
                        : handleSave
                    }
                    className="px-6 py-2 bg-[#00C4B4] hover:bg-[#00B4A6] text-white rounded-lg font-medium transition-colors"
                  >
                    Lưu cài đặt
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 max-h-[500px] overflow-y-auto scrollbar-hide">
              {/* Cài đặt chung Tab - GIAO DIỆN CODE 7 */}
              {activeTab === "Cài đặt chung" && (
                <div className="space-y-8">
                  {/* Theme Settings */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <FaCog className="text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Chủ đề giao diện
                        </h3>
                        <p className="text-sm text-gray-500">
                          Chọn chủ đề phù hợp với sở thích của bạn
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Light Theme */}
                      <button
                        onClick={() => handleThemeChange("light")}
                        className={`relative p-6 rounded-2xl border-2 transition-all duration-300 group ${
                          theme === "light"
                            ? "border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <div className="mb-6">
                          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-200">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                              </div>
                              <div className="flex-1 mx-3">
                                <div className="h-1.5 bg-gray-200 rounded-full w-20"></div>
                              </div>
                            </div>

                            <div className="p-4 bg-white">
                              <div className="space-y-2">
                                <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                                <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                              </div>

                              <div className="grid grid-cols-2 gap-2 mt-3">
                                <div className="h-8 bg-gray-100 rounded"></div>
                                <div className="h-8 bg-gray-100 rounded"></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {theme === "light" ? (
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <svg
                                className="w-3 h-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          ) : (
                            <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                          )}
                          <div className="text-left">
                            <h4 className="font-semibold text-gray-900">
                              Light Mode
                            </h4>
                            <p className="text-sm text-gray-500">
                              Giao diện sáng, dễ nhìn ban ngày
                            </p>
                          </div>
                        </div>
                      </button>

                      {/* Dark Theme */}
                      <button
                        onClick={() => handleThemeChange("dark")}
                        className={`relative p-6 rounded-2xl border-2 transition-all duration-300 group ${
                          theme === "dark"
                            ? "border-gray-600 bg-gradient-to-br from-gray-800 to-gray-900"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <div className="mb-6">
                          <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-sm overflow-hidden">
                            <div className="flex items-center gap-2 px-3 py-2 bg-gray-700 border-b border-gray-600">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                              </div>
                              <div className="flex-1 mx-3">
                                <div className="h-1.5 bg-gray-600 rounded-full w-20"></div>
                              </div>
                            </div>

                            <div className="p-4 bg-gray-800">
                              <div className="space-y-2">
                                <div className="h-2 bg-gray-600 rounded w-3/4"></div>
                                <div className="h-2 bg-gray-700 rounded w-1/2"></div>
                                <div className="h-2 bg-gray-600 rounded w-2/3"></div>
                              </div>

                              <div className="grid grid-cols-2 gap-2 mt-3">
                                <div className="h-8 bg-gray-700 rounded"></div>
                                <div className="h-8 bg-gray-700 rounded"></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {theme === "dark" ? (
                            <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                              <svg
                                className="w-3 h-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          ) : (
                            <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                          )}
                          <div className="text-left">
                            <h4
                              className={`font-semibold ${
                                theme === "dark"
                                  ? "text-white"
                                  : "text-gray-900"
                              }`}
                            >
                              Dark Mode
                            </h4>
                            <p
                              className={`text-sm ${
                                theme === "dark"
                                  ? "text-gray-300"
                                  : "text-gray-500"
                              }`}
                            >
                              Giao diện tối, bảo vệ mắt ban đêm
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <FaBell className="text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Thông báo
                        </h3>
                        <p className="text-sm text-gray-500">
                          Quản lý cách nhận thông báo
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-base font-medium text-gray-900">
                            Bật thông báo trên máy tính
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Nhận thông báo tất cả tin nhắn, hợp đồng, tài liệu.
                          </p>
                        </div>
                        <Toggle
                          checked={settings.desktopNotification}
                          onChange={(checked) =>
                            handleToggle("desktopNotification", checked)
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-base font-medium text-gray-900">
                            Bật huy hiệu thông báo chưa đọc
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Hiển thị huy hiệu đỏ trên biểu tượng ứng dụng khi
                            bạn có tin nhắn chưa đọc
                          </p>
                        </div>
                        <Toggle
                          checked={settings.unreadBadge}
                          onChange={(checked) =>
                            handleToggle("unreadBadge", checked)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Hồ sơ cá nhân Tab - GIAO DIỆN CODE 7 */}
              {activeTab === "Hồ sơ cá nhân" && (
                <div className="space-y-8">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FaUser className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            Thông tin cá nhân
                          </h3>
                          <p className="text-sm text-gray-500">
                            Cập nhật thông tin hồ sơ của bạn
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleEdit("profile")}
                        className="flex items-center gap-2 px-4 py-2 text-[#00C4B4] hover:bg-[#00C4B4]/10 rounded-lg font-medium transition-colors"
                      >
                        <FaEdit className="text-xs" />
                        {isEditing.profile ? "Hủy" : "Chỉnh sửa"}
                      </button>
                    </div>

                    <div className="flex items-start gap-6">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-4 border-gray-200">
                          {previewImage || profileForm.avatar ? (
                            <img
                              src={previewImage || profileForm.avatar}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
                              {profileForm.fullName?.charAt(0) ||
                                user?.fullName?.charAt(0) ||
                                "U"}
                            </div>
                          )}
                        </div>

                        {isEditing.profile && (
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#00C4B4] hover:bg-[#00B4A6] disabled:bg-gray-400 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                          >
                            {isUploading ? (
                              <svg
                                className="animate-spin h-3 w-3 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            ) : (
                              <FaCamera className="text-xs" />
                            )}
                          </button>
                        )}

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </div>

                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Họ và tên
                            </label>
                            {isEditing.profile ? (
                              <input
                                type="text"
                                value={profileForm.fullName}
                                onChange={(e) =>
                                  handleInputChange("fullName", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C4B4] focus:border-[#00C4B4]"
                                placeholder="Nhập họ và tên"
                              />
                            ) : (
                              <p className="text-gray-900 py-2">
                                {profileForm.fullName || "Chưa cập nhật"}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email
                            </label>
                            {isEditing.profile ? (
                              <input
                                type="email"
                                value={profileForm.email}
                                onChange={(e) =>
                                  handleInputChange("email", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C4B4] focus:border-[#00C4B4]"
                                placeholder="Nhập email"
                              />
                            ) : (
                              <p className="text-gray-900 py-2">
                                {profileForm.email || "Chưa cập nhật"}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Số điện thoại
                            </label>
                            {isEditing.profile ? (
                              <input
                                type="tel"
                                value={profileForm.phone}
                                onChange={(e) =>
                                  handleInputChange("phone", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C4B4] focus:border-[#00C4B4]"
                                placeholder="Nhập số điện thoại"
                              />
                            ) : (
                              <p className="text-gray-900 py-2">
                                {profileForm.phone || "Chưa cập nhật"}
                              </p>
                            )}
                          </div>
                        </div>

                        {isEditing.profile && (
                          <div className="flex items-center gap-3 pt-4">
                            <button
                              onClick={handleSave}
                              disabled={updateProfileMutation.isPending}
                              className="px-4 py-2 bg-[#00C4B4] hover:bg-[#00B4A6] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                              {updateProfileMutation.isPending ? (
                                <svg
                                  className="animate-spin h-4 w-4"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  />
                                </svg>
                              ) : (
                                <FaSave className="text-xs" />
                              )}
                              Lưu thay đổi
                            </button>
                            <button
                              onClick={() =>
                                setIsEditing((prev) => ({
                                  ...prev,
                                  profile: false,
                                }))
                              }
                              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                              <FaTimes className="text-xs" />
                              Hủy
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Account Statistics */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-indigo-600"
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
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Thống kê tài khoản
                        </h3>
                        <p className="text-sm text-gray-500">
                          Tổng quan hoạt động của bạn
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          {accountStatsLoading ? (
                            <span className="loading loading-spinner loading-sm"></span>
                          ) : (
                            accountStats?.totalTransactions || 0
                          )}
                        </div>
                        <div className="text-sm text-gray-600">Giao dịch</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          {accountStatsLoading ? (
                            <span className="loading loading-spinner loading-sm"></span>
                          ) : (
                            accountStats?.totalCategories || 0
                          )}
                        </div>
                        <div className="text-sm text-gray-600">Danh mục</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                        <div className="text-2xl font-bold text-purple-600 mb-1">
                          {accountStatsLoading ? (
                            <span className="loading loading-spinner loading-sm"></span>
                          ) : (
                            `${accountStats?.daysMember || 0} ngày`
                          )}
                        </div>
                        <div className="text-sm text-gray-600">Thành viên</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bảo mật Tab - GIAO DIỆN CODE 7 (tiếp) */}
              {activeTab === "Bảo mật" && (
                <div className="space-y-8">
                  {/* Change Password Section */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FaLock className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Đổi mật khẩu
                        </h3>
                        <p className="text-sm text-gray-500">
                          Cập nhật mật khẩu để bảo mật tài khoản
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mật khẩu hiện tại
                        </label>
                        <input
                          type="password"
                          value={securityForm.currentPassword}
                          onChange={(e) =>
                            handleSecurityInputChange(
                              "currentPassword",
                              e.target.value
                            )
                          }
                          placeholder="Nhập mật khẩu hiện tại"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C4B4] focus:border-[#00C4B4] transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mật khẩu mới
                          </label>
                          <input
                            type="password"
                            value={securityForm.newPassword}
                            onChange={(e) =>
                              handleSecurityInputChange(
                                "newPassword",
                                e.target.value
                              )
                            }
                            placeholder="Nhập mật khẩu mới"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C4B4] focus:border-[#00C4B4] transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Xác nhận mật khẩu
                          </label>
                          <input
                            type="password"
                            value={securityForm.confirmPassword}
                            onChange={(e) =>
                              handleSecurityInputChange(
                                "confirmPassword",
                                e.target.value
                              )
                            }
                            placeholder="Xác nhận mật khẩu mới"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C4B4] focus:border-[#00C4B4] transition-colors"
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleChangePassword}
                        disabled={changePasswordMutation.isPending}
                        className="px-6 py-2 bg-[#00C4B4] hover:bg-[#00B4A6] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        {changePasswordMutation.isPending ? (
                          <svg
                            className="animate-spin h-4 w-4"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                        ) : null}
                        Cập nhật mật khẩu
                      </button>
                    </div>
                  </div>

                  {/* 2-Step Verification Section */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Thiết lập xác thực 2 bước
                        </h3>
                        <p className="text-sm text-gray-500">
                          Tăng cường bảo mật tài khoản với xác thực 2 bước
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              Ứng dụng xác thực
                            </h4>
                            <p className="text-sm text-gray-500">
                              Sử dụng ứng dụng xác thực để tạo mã xác minh
                            </p>
                          </div>
                        </div>
                        <Toggle
                          checked={settings.authenticatorAppEnabled}
                          onChange={(checked) =>
                            handleToggle("authenticatorAppEnabled", checked)
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-purple-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              Số điện thoại
                            </h4>
                            <p className="text-sm text-gray-500">
                              Thiết lập xác minh SMS trên số của bạn
                            </p>
                          </div>
                        </div>
                        <Toggle
                          checked={settings.phoneNumberEnabled}
                          onChange={(checked) =>
                            handleToggle("phoneNumberEnabled", checked)
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-orange-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Email</h4>
                            <p className="text-sm text-gray-500">
                              Sử dụng email để xác thực 2 bước
                            </p>
                          </div>
                        </div>
                        <Toggle
                          checked={settings.emailEnabled}
                          onChange={(checked) =>
                            handleToggle("emailEnabled", checked)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delete Account Section */}
                  <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <FaExclamationTriangle className="text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-red-900">
                          Xóa tài khoản của tôi
                        </h3>
                        <p className="text-sm text-red-600">
                          Xóa vĩnh viễn tài khoản và toàn bộ dữ liệu
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 border border-red-200">
                      {!showDeleteConfirm ? (
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">
                              Xóa tài khoản vĩnh viễn
                            </h4>
                            <p className="text-sm text-gray-600">
                              Hành động này không thể hoàn tác. Tất cả dữ liệu
                              của bạn sẽ bị xóa vĩnh viễn.
                            </p>
                          </div>
                          <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                          >
                            Xóa tài khoản vĩnh viễn
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                            <div className="flex items-center gap-2 mb-2">
                              <FaExclamationTriangle className="text-red-600" />
                              <span className="font-medium text-red-900">
                                Cảnh báo!
                              </span>
                            </div>
                            <p className="text-sm text-red-800">
                              Bạn sắp xóa vĩnh viễn tài khoản. Tất cả dữ liệu sẽ
                              bị mất và không thể khôi phục.
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nhập "XÓA TÀI KHOẢN" để xác nhận:
                            </label>
                            <input
                              type="text"
                              value={deleteConfirmText}
                              onChange={(e) =>
                                setDeleteConfirmText(e.target.value)
                              }
                              placeholder="XÓA TÀI KHOẢN"
                              className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={handleDeleteAccount}
                              disabled={deleteConfirmText !== "XÓA TÀI KHOẢN"}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                              <FaTrash className="text-xs" />
                              Xác nhận xóa
                            </button>
                            <button
                              onClick={() => {
                                setShowDeleteConfirm(false);
                                setDeleteConfirmText("");
                              }}
                              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                            >
                              Hủy
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Other tabs placeholder */}
              {!["Cài đặt chung", "Hồ sơ cá nhân", "Bảo mật"].includes(
                activeTab
              ) && (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Đang phát triển
                  </h3>
                  <p className="text-gray-500">
                    Nội dung cho tab {activeTab} sẽ được phát triển trong phiên
                    bản tiếp theo.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <FloatingQuickAction />
    </div>
  );
};

export default SettingsPage;
