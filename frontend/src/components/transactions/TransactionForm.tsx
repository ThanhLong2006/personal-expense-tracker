/**
 * Transaction Form - Form thêm/sửa giao dịch
 * GIAO DIỆN: Chuyên nghiệp, modern, clean design
 * LOGIC: 100% từ code 8 - Giữ nguyên tất cả
 */

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FaWallet,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaStickyNote,
  FaImage,
  FaCamera,
  FaPlus,
  FaTimes,
  FaSave,
  FaArrowUp,
  FaArrowDown,
  FaMoneyBillWave,
} from "react-icons/fa";
import {
  createCategory as apiCreateCategory,
  getCategories as apiGetCategories,
} from "../../api/categories";
import { createWorker } from "tesseract.js";

interface Category {
  id: number;
  name: string;
  icon?: string;
  type?: string;
  parentId?: number | null;
  parent_id?: number | null;
}

interface CategoryRaw {
  id?: number;
  ID?: number;
  parentId?: number | null;
  parent_id?: number | null;
  type?: string;
  name?: string;
  icon?: string;
}

interface FormDataType {
  categoryId: string;
  type: "income" | "expense";
  amount: string | number;
  transactionDate: string;
  note: string;
  location: string;
  receiptImage: string | null;
}

interface TransactionMinimal {
  id?: number;
  category?: { id?: number; type?: string } | null;
  amount?: number | string;
  transactionDate?: string;
  note?: string;
  location?: string;
  receiptImage?: string | null;
}

export interface SubmittedTransaction {
  categoryId: number | null;
  type: "income" | "expense";
  amount: number;
  transactionDate: string;
  note: string;
  location: string;
  receiptImage?: string | null;
}

interface TransactionFormProps {
  transaction?: TransactionMinimal;
  onSubmit: (data: SubmittedTransaction) => void;
  onCancel: () => void;
  loading?: boolean;
}

type CreateWorkerReturn = Awaited<ReturnType<typeof createWorker>>;

const TransactionForm = ({
  transaction,
  onSubmit,
  onCancel,
  loading = false,
}: TransactionFormProps) => {
  // LOGIC 100% TỪ CODE 8
  const [formData, setFormData] = useState<FormDataType>({
    categoryId: transaction?.category?.id
      ? String(transaction.category.id)
      : "",
    type:
      transaction &&
        transaction.category &&
        transaction.category.type === "income"
        ? "income"
        : "expense",
    amount: transaction?.amount || "",
    transactionDate: transaction?.transactionDate
      ? format(new Date(transaction.transactionDate), "yyyy-MM-dd")
      : format(new Date(), "yyyy-MM-dd"),
    note: transaction?.note || "",
    location: transaction?.location || "",
    receiptImage: transaction?.receiptImage || null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ocrLoading, setOcrLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: () => apiGetCategories(),
  });

  const [addingCategory, setAddingCategory] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [newCategoryParent, setNewCategoryParent] = useState<string | null>(
    null
  );
  const [createLoading, setCreateLoading] = useState(false);

  const handleCreateCategory = async (name: string) => {
    try {
      setCreateLoading(true);
      const payload: { name: string; type: string; parentId?: number } = {
        name,
        type: formData.type,
      };
      if (newCategoryParent) payload.parentId = Number(newCategoryParent);
      const created = await apiCreateCategory(payload);
      toast.success("Đã tạo danh mục");
      try {
        const createdObj = created as
          | Record<string, unknown>
          | Category
          | undefined;
        const createdCat = (createdObj &&
          (((createdObj as Record<string, unknown>)["data"] as Category) ||
            (createdObj as Category))) as Category | undefined;
        if (createdCat && createdCat.id) {
          queryClient.setQueryData(["categories"], (old: unknown) => {
            const list: Category[] = Array.isArray(old)
              ? (old as Category[])
              : ((old as Record<string, unknown>)?.data as Category[]) ||
              (old as Category[]) ||
              [];
            const exists = list.find((c: Category) => c.id === createdCat.id);
            if (exists) return list;
            return [...list, createdCat as Category];
          });
          setFormData({ ...formData, categoryId: String(createdCat.id) });
        } else {
          await queryClient.invalidateQueries({ queryKey: ["categories"] });
        }
      } catch (e) {
        await queryClient.invalidateQueries({ queryKey: ["categories"] });
      }
      setNewCategoryName("");
      setNewCategoryParent(null);
      setAddingCategory(false);
    } catch (err: unknown) {
      console.error("Create category error", err);
      type AxiosLike = { response?: { data?: { message?: string } } };
      const maybe = err as AxiosLike;
      const message = maybe?.response?.data?.message ?? null;
      toast.error(message || "Lỗi tạo danh mục");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors({ ...errors, receiptImage: "Vui lòng chọn file ảnh" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, receiptImage: "File quá lớn (tối đa 5MB)" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setUploadedImage(result);
      setFormData({ ...formData, receiptImage: result });
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.categoryId) {
      newErrors.categoryId = "Vui lòng chọn danh mục";
    }

    if (!formData.amount || parseFloat(String(formData.amount)) <= 0) {
      newErrors.amount = "Vui lòng nhập số tiền hợp lệ";
    }

    if (!formData.transactionDate) {
      newErrors.transactionDate = "Vui lòng chọn ngày";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      amount: parseFloat(String(formData.amount)),
      categoryId: formData.categoryId ? Number(formData.categoryId) : null,
    });
  };

  const handleOCR = async () => {
    if (!uploadedImage) return;

    setOcrLoading(true);
    let worker: CreateWorkerReturn | null = null;
    try {
      worker = await createWorker();
      await worker.load();
      await worker.reinitialize("vie+eng");
      const {
        data: { text },
      } = await worker.recognize(uploadedImage as string | File | Blob);

      const amountMatch = text.match(
        /(?:\(?-?\d{1,3}(?:[.,\s]\d{3})+(?:[.,]\d{1,2})?\)?|(?:-?\d+(?:[.,]\d+)?))/g
      );
      if (amountMatch && amountMatch.length > 0) {
        const parseAmountString = (s: string) => {
          if (!s) return 0;
          let cleaned = String(s)
            .replace(/\u00A0/g, " ")
            .replace(/[^0-9.,()\-\s]/g, "")
            .trim();

          const isNegative =
            /^\(.*\)$/.test(cleaned) || cleaned.indexOf("-") !== -1;
          cleaned = cleaned.replace(/[()\-]/g, "");
          cleaned = cleaned.replace(/\s+/g, "");

          const lastDot = cleaned.lastIndexOf(".");
          const lastComma = cleaned.lastIndexOf(",");
          let normalized = cleaned;

          if (lastDot !== -1 && lastComma !== -1) {
            if (lastDot > lastComma) {
              normalized = cleaned.replace(/,/g, "");
            } else {
              normalized = cleaned.replace(/\./g, "").replace(/,/g, ".");
            }
          } else if (lastComma !== -1) {
            const decimals = cleaned.length - lastComma - 1;
            if (decimals === 3) {
              normalized = cleaned.replace(/,/g, "");
            } else {
              normalized = cleaned.replace(/\./g, "").replace(/,/g, ".");
            }
          } else {
            normalized = cleaned.replace(/,/g, "");
          }

          const n = parseFloat(normalized);
          if (isNaN(n)) return 0;
          return isNegative ? -n : n;
        };

        const amounts = amountMatch
          .map((m: string) => parseAmountString(m))
          .filter((v: number) => Math.abs(v) > 0);
        if (amounts.length > 0) {
          const maxAmount = amounts.reduce((a: number, b: number) =>
            Math.abs(a) > Math.abs(b) ? a : b
          );
          const finalAmount = Math.round(maxAmount);
          if (finalAmount !== 0) {
            setFormData((prev) => ({ ...prev, amount: String(finalAmount) }));
            toast.success(`Đã nhận diện: ${finalAmount.toLocaleString()} VNĐ`);
          }
        }
      }

      console.debug("OCR text:", text);

      const fallbackMatch = text.match(/(\d[\d\s.,]{2,}\d)/g);
      if (
        (!(amountMatch && amountMatch.length > 0) || !fallbackMatch) &&
        fallbackMatch &&
        fallbackMatch.length > 0
      ) {
        const parseAmountStringFallback = (s: string) => {
          if (!s) return 0;
          let cleaned = String(s)
            .replace(/\u00A0/g, " ")
            .replace(/[^0-9.,()\-\s]/g, "")
            .trim();
          const isNegative =
            /^\(.*\)$/.test(cleaned) || cleaned.indexOf("-") !== -1;
          cleaned = cleaned.replace(/[()\-]/g, "");
          cleaned = cleaned.replace(/\s+/g, "");
          const lastDot = cleaned.lastIndexOf(".");
          const lastComma = cleaned.lastIndexOf(",");
          let normalized = cleaned;
          if (lastDot !== -1 && lastComma !== -1) {
            if (lastDot > lastComma) {
              normalized = cleaned.replace(/,/g, "");
            } else {
              normalized = cleaned.replace(/\./g, "").replace(/,/g, ".");
            }
          } else if (lastComma !== -1) {
            const decimals = cleaned.length - lastComma - 1;
            if (decimals === 3) {
              normalized = cleaned.replace(/,/g, "");
            } else {
              normalized = cleaned.replace(/\./g, "").replace(/,/g, ".");
            }
          } else {
            normalized = cleaned.replace(/,/g, "");
          }
          const n = parseFloat(normalized);
          if (isNaN(n)) return 0;
          return isNegative ? -n : n;
        };

        const amounts2 = fallbackMatch
          .map((m: string) => parseAmountStringFallback(m))
          .filter((v: number) => Math.abs(v) > 0);
        if (amounts2.length > 0) {
          const maxAmount2 = amounts2.reduce((a: number, b: number) =>
            Math.abs(a) > Math.abs(b) ? a : b
          );
          const finalAmount2 = Math.round(maxAmount2);
          if (finalAmount2 !== 0) {
            setFormData((prev) => ({ ...prev, amount: String(finalAmount2) }));
            toast.success(
              `Đã nhận diện số tiền: ${finalAmount2.toLocaleString()}`
            );
          }
        }
      }
    } catch (error) {
      console.error("OCR error:", error);
      toast.error("Lỗi nhận diện hóa đơn");
    } finally {
      try {
        if (worker) await worker.terminate();
      } catch (e) {
        // ignore
      }
      setOcrLoading(false);
    }
  };

  /**
   * GIAO DIỆN CHUYÊN NGHIỆP
   */
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Type Selector - Modern Design */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          Loại giao dịch <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              setFormData({ ...formData, type: "expense", categoryId: "" })
            }
            className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${formData.type === "expense"
                ? "border-red-500 bg-red-50 shadow-md"
                : "border-slate-200 bg-white hover:border-red-300"
              }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${formData.type === "expense" ? "bg-red-500" : "bg-slate-200"
                  }`}
              >
                <FaArrowDown
                  className={
                    formData.type === "expense"
                      ? "text-white"
                      : "text-slate-400"
                  }
                />
              </div>
              <div className="text-left">
                <p
                  className={`font-bold ${formData.type === "expense"
                      ? "text-red-600"
                      : "text-slate-600"
                    }`}
                >
                  Chi tiêu
                </p>
                <p className="text-xs text-slate-500">Khoản chi</p>
              </div>
            </div>
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              setFormData({ ...formData, type: "income", categoryId: "" })
            }
            className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${formData.type === "income"
                ? "border-green-500 bg-green-50 shadow-md"
                : "border-slate-200 bg-white hover:border-green-300"
              }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${formData.type === "income" ? "bg-green-500" : "bg-slate-200"
                  }`}
              >
                <FaArrowUp
                  className={
                    formData.type === "income" ? "text-white" : "text-slate-400"
                  }
                />
              </div>
              <div className="text-left">
                <p
                  className={`font-bold ${formData.type === "income"
                      ? "text-green-600"
                      : "text-slate-600"
                    }`}
                >
                  Thu nhập
                </p>
                <p className="text-xs text-slate-500">Nguồn thu</p>
              </div>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Category Select */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Danh mục <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <FaWallet className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
          <select
            title="Danh mục"
            aria-label="Danh mục"
            className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white ${errors.categoryId ? "border-red-500" : "border-slate-200"
              }`}
            value={formData.categoryId}
            onChange={(e) =>
              setFormData({ ...formData, categoryId: e.target.value })
            }
          >
            <option value="">
              -- Chọn {formData.type === "expense" ? "khoản chi" : "nguồn thu"}{" "}
              --
            </option>
            {(categories || [])
              .filter((c: Category) => (c.type || "expense") === formData.type)
              .map((cat: Category) => (
                <option key={cat.id} value={String(cat.id)}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            {(categories || []).filter(
              (c: Category) => (c.type || "expense") === formData.type
            ).length === 0 && <option disabled>Chưa có danh mục nào</option>}
          </select>
        </div>

        {categoriesLoading && (
          <p className="mt-2 text-sm text-slate-500">Đang tải danh mục...</p>
        )}
        {categoriesError && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-red-500">
              Không tải được danh mục.
            </span>
            <button
              type="button"
              onClick={() => refetchCategories()}
              className="text-sm text-blue-600 hover:underline"
            >
              Thử lại
            </button>
          </div>
        )}
        {errors.categoryId && (
          <p className="mt-1 text-sm text-red-500">{errors.categoryId}</p>
        )}

        {/* Add Category Inline */}
        <div className="mt-2">
          {!addingCategory ? (
            <button
              type="button"
              onClick={() => setAddingCategory(true)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <FaPlus size={12} />
              Thêm danh mục{" "}
              {formData.type === "expense" ? "chi tiêu" : "thu nhập"} mới
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mt-2"
            >
              <input
                type="text"
                className="flex-1 px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Tên danh mục ${formData.type === "expense" ? "chi" : "thu"
                  }...`}
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <button
                type="button"
                onClick={() => {
                  if (!newCategoryName || newCategoryName.trim().length < 2) {
                    toast.error("Tên danh mục quá ngắn");
                    return;
                  }
                  handleCreateCategory(newCategoryName.trim());
                }}
                disabled={createLoading}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors disabled:opacity-50"
              >
                {createLoading ? "..." : "Lưu"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAddingCategory(false);
                  setNewCategoryName("");
                }}
                className="px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
              >
                <FaTimes />
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Amount Input */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Số tiền (VNĐ) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <FaMoneyBillWave className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
          <input
            type="number"
            title="Số tiền"
            aria-label="Số tiền"
            className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg font-semibold ${errors.amount ? "border-red-500" : "border-slate-200"
              }`}
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            placeholder="0"
            min="0"
            step="1000"
          />
        </div>
        {errors.amount && (
          <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
        )}
      </div>

      {/* Date Input */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Ngày giao dịch <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
          <input
            type="date"
            title="Ngày giao dịch"
            aria-label="Ngày giao dịch"
            className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.transactionDate ? "border-red-500" : "border-slate-200"
              }`}
            value={formData.transactionDate}
            onChange={(e) =>
              setFormData({ ...formData, transactionDate: e.target.value })
            }
          />
        </div>
        {errors.transactionDate && (
          <p className="mt-1 text-sm text-red-500">{errors.transactionDate}</p>
        )}
      </div>

      {/* Note Textarea */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Ghi chú
        </label>
        <div className="relative">
          <FaStickyNote className="absolute left-4 top-4 text-slate-400 z-10" />
          <textarea
            className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            placeholder="Ghi chú về giao dịch..."
            rows={3}
          />
        </div>
      </div>

      {/* Location Input */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Địa điểm
        </label>
        <div className="relative">
          <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
          <input
            type="text"
            className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            placeholder="Nơi thực hiện giao dịch..."
          />
        </div>
      </div>

      {/* Receipt Image Upload */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Ảnh hóa đơn
        </label>
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-blue-400 transition-colors bg-slate-50">
          <div className="text-center">
            <FaImage className="mx-auto text-4xl text-slate-400 mb-3" />
            <label className="cursor-pointer">
              <span className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 inline-flex items-center gap-2 font-medium transition-colors">
                <FaCamera />
                Chọn ảnh
              </span>
              <input
                type="file"
                title="Ảnh hóa đơn"
                aria-label="Ảnh hóa đơn"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
            <p className="text-xs text-slate-500 mt-2">PNG, JPG tối đa 5MB</p>
          </div>

          {/* Image Preview */}
          {uploadedImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4"
            >
              <img
                src={uploadedImage}
                alt="Receipt"
                className="w-full h-48 object-contain rounded-lg border-2 border-slate-200 bg-white"
              />
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={handleOCR}
                  disabled={ocrLoading}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {ocrLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Đang nhận diện...
                    </>
                  ) : (
                    <>
                      <FaCamera />
                      Nhận diện số tiền (OCR)
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUploadedImage(null);
                    setFormData({ ...formData, receiptImage: null });
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
            </motion.div>
          )}
        </div>
        {errors.receiptImage && (
          <p className="mt-1 text-sm text-red-500">{errors.receiptImage}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors disabled:opacity-50"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:shadow-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Đang lưu...
            </>
          ) : (
            <>
              <FaSave />
              {transaction ? "Cập nhật" : "Thêm mới"}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
