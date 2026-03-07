import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import { FaPlus, FaTrash, FaClock, FaCalendarAlt, FaMoneyBillWave } from "react-icons/fa";
import toast from "react-hot-toast";

interface RecurringTransaction {
    id: number;
    category: { name: string; icon: string };
    amount: number;
    currency: string;
    frequency: string;
    startDate: string;
    endDate?: string;
    note?: string;
    status: string;
}

const RecurringTransactionsPage: React.FC = () => {
    const queryClient = useQueryClient();

    const { data: recurringList, isLoading } = useQuery({
        queryKey: ["recurring-transactions"],
        queryFn: async () => {
            const response = await api.get("/recurring-transactions");
            return response.data.data || [];
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/recurring-transactions/${id}`);
        },
        onSuccess: () => {
            toast.success("Đã xóa giao dịch định kỳ");
            queryClient.invalidateQueries({ queryKey: ["recurring-transactions"] });
        },
    });

    if (isLoading) return <div className="p-8 text-center"><span className="loading loading-spinner"></span></div>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Giao dịch định kỳ</h1>
                    <p className="text-slate-500 mt-1">Quản lý các khoản chi/thu lặp lại tự động</p>
                </div>
                <button className="btn btn-primary" onClick={() => toast.error("Chức năng thêm mới đang được hoàn thiện UI")}>
                    <FaPlus className="mr-2" /> Thêm cấu hình
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(recurringList || []).map((item: RecurringTransaction) => (
                    <div key={item.id} className="card bg-white shadow-xl hover:shadow-2xl transition-all border border-slate-100">
                        <div className="card-body">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl">{item.category?.icon || '💰'}</div>
                                    <div>
                                        <h3 className="font-bold text-lg">{item.category?.name}</h3>
                                        <div className="badge badge-ghost text-xs uppercase">{item.frequency}</div>
                                    </div>
                                </div>
                                <div className={`badge ${item.status === 'ACTIVE' ? 'badge-success' : 'badge-ghost'}`}>
                                    {item.status}
                                </div>
                            </div>

                            <div className="mt-4 space-y-2">
                                <div className="flex items-center text-2xl font-black text-blue-600">
                                    <FaMoneyBillWave className="mr-2 text-xl opacity-50" />
                                    {new Intl.NumberFormat('vi-VN').format(item.amount)} {item.currency}
                                </div>
                                <div className="flex items-center text-slate-500 text-sm">
                                    <FaCalendarAlt className="mr-2" />
                                    Bắt đầu: {item.startDate}
                                </div>
                                {item.note && (
                                    <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-600 italic">
                                        "{item.note}"
                                    </div>
                                )}
                            </div>

                            <div className="card-actions justify-end mt-4 pt-4 border-t">
                                <button 
                                    className="btn btn-ghost btn-sm text-red-500"
                                    onClick={() => {
                                        if (window.confirm("Bạn có chắc chắn muốn xóa cấu hình này?")) {
                                            deleteMutation.mutate(item.id);
                                        }
                                    }}
                                >
                                    <FaTrash /> Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {recurringList?.length === 0 && (
                    <div className="col-span-full py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center">
                        <FaClock className="mx-auto text-5xl text-slate-300 mb-4" />
                        <h3 className="text-xl font-medium text-slate-600">Chưa có giao dịch định kỳ nào</h3>
                        <p className="text-slate-400 mt-2">Hãy thêm cấu hình như tiền nhà, tiền lương để hệ thống tự động ghi chép</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecurringTransactionsPage;
