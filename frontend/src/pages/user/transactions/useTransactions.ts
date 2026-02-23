import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, startOfDay, endOfDay, subDays, startOfMonth, endOfMonth } from "date-fns";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import { Transaction, Filter, Statistics } from "./types";

export const useTransactions = () => {
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(20);
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
    const [quickFilter, setQuickFilter] = useState<"today" | "week" | "month" | "year" | "all" | null>(null);

    const queryClient = useQueryClient();

    // Query: Categories
    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const response = await api.get("/categories");
            return response.data.data || [];
        },
    });

    // Query: Transactions
    const {
        data: transactionsData,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["transactions", page, size, filters],
        queryFn: async () => {
            const params: any = { page, size };
            if (filters.startDate) params.startDate = filters.startDate;
            if (filters.endDate) params.endDate = filters.endDate;
            const response = await api.get("/transactions", { params });
            return response.data.data;
        },
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await api.post("/transactions", data);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Thêm giao dịch thành công!");
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Lỗi thêm giao dịch");
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: any }) => {
            const response = await api.put(`/transactions/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Cập nhật giao dịch thành công!");
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Lỗi cập nhật giao dịch");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await api.delete(`/transactions/${id}`);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Xóa giao dịch thành công!");
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Lỗi xóa giao dịch");
        },
    });

    const bulkDeleteMutation = useMutation({
        mutationFn: async (ids: number[]) => {
            await Promise.all(ids.map((id) => api.delete(`/transactions/${id}`)));
        },
        onSuccess: () => {
            toast.success("Đã xóa các giao dịch được chọn!");
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        },
        onError: () => {
            toast.error("Lỗi xóa giao dịch");
        },
    });

    // Handlers
    const applyQuickFilter = useCallback((filter: "today" | "week" | "month" | "year" | "all") => {
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

        setFilters((prev) => ({ ...prev, startDate, endDate }));
        setQuickFilter(filter);
        setPage(0);
    }, []);

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

    // Stats calculation
    const statistics = useMemo((): Statistics => {
        if (!transactionsData?.content) {
            return { total: 0, count: 0, average: 0, min: 0, max: 0 };
        }

        const amounts = transactionsData.content.map((t: Transaction) => t.amount);
        const total = amounts.reduce((sum: number, amount: number) => sum + amount, 0);
        const count = amounts.length;
        const average = count > 0 ? total / count : 0;
        const min = amounts.length > 0 ? Math.min(...amounts) : 0;
        const max = amounts.length > 0 ? Math.max(...amounts) : 0;

        return { total, count, average, min, max };
    }, [transactionsData]);

    // Processed transactions (local filter/sort for responsive UI)
    const processedTransactions = useMemo(() => {
        if (!transactionsData?.content) return [];
        let result = [...transactionsData.content];

        if (filters.search) {
            const search = filters.search.toLowerCase();
            result = result.filter(t =>
                t.note?.toLowerCase().includes(search) ||
                t.category?.name.toLowerCase().includes(search) ||
                t.location?.toLowerCase().includes(search)
            );
        }

        if (filters.categoryId) {
            result = result.filter(t => t.category?.id === filters.categoryId);
        }

        if (filters.minAmount !== null) {
            result = result.filter(t => t.amount >= filters.minAmount!);
        }

        if (filters.maxAmount !== null) {
            result = result.filter(t => t.amount <= filters.maxAmount!);
        }

        result.sort((a, b) => {
            let comparison = 0;
            switch (filters.sortBy) {
                case "date":
                    comparison = new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime();
                    break;
                case "amount":
                    comparison = a.amount - b.amount;
                    break;
                case "category":
                    comparison = (a.category?.name || "").localeCompare(b.category?.name || "");
                    break;
            }
            return filters.sortOrder === "asc" ? comparison : -comparison;
        });

        return result;
    }, [transactionsData, filters]);

    return {
        page, setPage,
        size, setSize,
        filters, setFilters,
        quickFilter, applyQuickFilter,
        clearFilters,
        categories,
        transactionsData,
        isLoading,
        error,
        refetch,
        statistics,
        processedTransactions,
        createMutation,
        updateMutation,
        deleteMutation,
        bulkDeleteMutation
    };
};
