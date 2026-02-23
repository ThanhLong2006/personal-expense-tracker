import React from "react";
import { motion } from "framer-motion";
import { FaInbox, FaPlus, FaPen, FaTrashCan, FaImage, FaLocationDot } from "react-icons/fa6";
import { Transaction } from "./types";

interface TransactionTableProps {
    isLoading: boolean;
    transactions: Transaction[];
    selectedTransactions: number[];
    setSelectedTransactions: (ids: number[]) => void;
    selectAll: boolean;
    toggleSelectAll: () => void;
    toggleSelectTransaction: (id: number) => void;
    handleEdit: (t: Transaction) => void;
    handleDelete: (id: number) => void;
    handleBulkDelete: () => void;
    setShowAddModal: (show: boolean) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
    isLoading, transactions, selectedTransactions,
    setSelectedTransactions, selectAll, toggleSelectAll,
    toggleSelectTransaction, handleEdit, handleDelete,
    handleBulkDelete, setShowAddModal
}) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <FaInbox className="text-6xl text-slate-300 mb-4" />
                <h3 className="text-xl font-bold mb-2">Chưa có giao dịch</h3>
                <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
                    <FaPlus size={14} /> Thêm giao dịch đầu tiên
                </button>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
                <thead>
                    <tr>
                        <th>
                            <input type="checkbox" className="checkbox checkbox-primary" checked={selectAll} onChange={toggleSelectAll} />
                            {selectedTransactions.length > 0 && (
                                <button onClick={handleBulkDelete} className="btn btn-xs btn-error btn-outline ml-2">
                                    Xóa ({selectedTransactions.length})
                                </button>
                            )}
                        </th>
                        <th>Ngày</th>
                        <th>Danh mục</th>
                        <th>Số tiền</th>
                        <th>Ghi chú</th>
                        <th>Địa điểm</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((t) => (
                        <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover">
                            <td>
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-primary checkbox-sm"
                                    checked={selectedTransactions.includes(t.id)}
                                    onChange={() => toggleSelectTransaction(t.id)}
                                />
                            </td>
                            <td className="whitespace-nowrap">{t.transactionDate}</td>
                            <td>
                                <div className="flex items-center gap-2">
                                    <span className="badge border-none" style={{ backgroundColor: t.category?.color + '20', color: t.category?.color }}>
                                        {t.category?.name}
                                    </span>
                                </div>
                            </td>
                            <td className="font-bold">{new Intl.NumberFormat('vi-VN').format(t.amount)}đ</td>
                            <td>{t.note || '-'}</td>
                            <td>{t.location || '-'}</td>
                            <td>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleEdit(t)} className="btn btn-ghost btn-xs text-blue-600"><FaPen /></button>
                                    <button onClick={() => handleDelete(t.id)} className="btn btn-ghost btn-xs text-red-600"><FaTrashCan /></button>
                                </div>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionTable;
