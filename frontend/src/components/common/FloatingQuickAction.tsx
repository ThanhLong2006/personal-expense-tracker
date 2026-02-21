import React, { useState } from "react";
import { FaPlus, FaMoneyBillTransfer, FaFileInvoiceDollar } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import TransactionForm, { SubmittedTransaction } from "../transactions/TransactionForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import toast from "react-hot-toast";

const FloatingQuickAction: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: async (data: SubmittedTransaction) => {
            const response = await api.post("/transactions", data);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Thêm giao dịch thành công!");
            setShowTransactionModal(false);
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
            queryClient.invalidateQueries({ queryKey: ["reports"] });
            queryClient.invalidateQueries({ queryKey: ["account-stats"] });
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

    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <>
            <div className="fixed bottom-8 right-8 z-50 flex flex-col items-center gap-3">
                <AnimatePresence>
                    {isOpen && (
                        <>
                            <motion.button
                                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                                transition={{ delay: 0.05 }}
                                onClick={() => {
                                    setShowTransactionModal(true);
                                    setIsOpen(false);
                                }}
                                className="btn btn-circle bg-green-500 hover:bg-green-600 text-white border-none shadow-lg tooltip tooltip-left"
                                data-tip="Thêm thu nhập"
                            >
                                <FaMoneyBillTransfer />
                            </motion.button>

                            <motion.button
                                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                                onClick={() => {
                                    setShowTransactionModal(true);
                                    setIsOpen(false);
                                }}
                                className="btn btn-circle bg-red-500 hover:bg-red-600 text-white border-none shadow-lg tooltip tooltip-left"
                                data-tip="Thêm chi tiêu"
                            >
                                <FaFileInvoiceDollar />
                            </motion.button>
                        </>
                    )}
                </AnimatePresence>

                <button
                    onClick={toggleOpen}
                    className={`btn btn-circle btn-lg shadow-xl border-none transition-all duration-300 ${isOpen ? "bg-slate-700 rotate-45" : "bg-[#00C4B4] hover:bg-[#00A598]"
                        } text-white`}
                >
                    <FaPlus className="text-xl" />
                </button>
            </div>

            <AnimatePresence>
                {showTransactionModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center p-4 border-b">
                                <h3 className="text-lg font-bold">Thêm giao dịch mới</h3>
                                <button
                                    onClick={() => setShowTransactionModal(false)}
                                    className="btn btn-sm btn-circle btn-ghost"
                                >
                                    ✕
                                </button>
                            </div>
                            <TransactionForm
                                onCancel={() => setShowTransactionModal(false)}
                                onSubmit={(data: SubmittedTransaction) => {
                                    createMutation.mutate(data);
                                }}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default FloatingQuickAction;
