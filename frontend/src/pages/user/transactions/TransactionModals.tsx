import React from "react";
import TransactionForm from "../../../components/transactions/TransactionForm";
import { Transaction } from "./types";

interface TransactionModalsProps {
    showAddModal: boolean;
    setShowAddModal: (show: boolean) => void;
    showEditModal: boolean;
    setShowEditModal: (show: boolean) => void;
    showDeleteModal: boolean;
    setShowDeleteModal: (show: boolean) => void;
    showImportModal: boolean;
    setShowImportModal: (show: boolean) => void;
    showExportModal: boolean;
    setShowExportModal: (show: boolean) => void;
    editingTransaction: Transaction | null;
    createMutation: any;
    updateMutation: any;
    deleteMutation: any;
}

const TransactionModals: React.FC<TransactionModalsProps> = ({
    showAddModal, setShowAddModal,
    showEditModal, setShowEditModal,
    showDeleteModal, setShowDeleteModal,
    showImportModal, setShowImportModal,
    showExportModal, setShowExportModal,
    editingTransaction,
    createMutation, updateMutation, deleteMutation
}) => {
    return (
        <>
            {/* Add Modal */}
            {showAddModal && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-2xl">
                        <h3 className="font-bold text-lg mb-4">Thêm giao dịch mới</h3>
                        <TransactionForm
                            onSubmit={(data) => createMutation.mutate(data)}
                            onCancel={() => setShowAddModal(false)}
                            loading={createMutation.isPending}
                        />
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && editingTransaction && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-2xl">
                        <h3 className="font-bold text-lg mb-4">Sửa giao dịch</h3>
                        <TransactionForm
                            transaction={{
                                id: editingTransaction.id,
                                amount: editingTransaction.amount,
                                transactionDate: editingTransaction.transactionDate,
                                note: editingTransaction.note,
                                location: editingTransaction.location,
                                receiptImage: editingTransaction.receiptImage,
                                category: editingTransaction.category
                            }}
                            onSubmit={(data) => updateMutation.mutate({ id: editingTransaction.id, data })}
                            onCancel={() => setShowEditModal(false)}
                            loading={updateMutation.isPending}
                        />
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && editingTransaction && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Xác nhận xóa</h3>
                        <p className="py-4">Bạn có chắc chắn muốn xóa giao dịch này không?</p>
                        <div className="modal-action">
                            <button className="btn" onClick={() => setShowDeleteModal(false)}>Hủy</button>
                            <button className="btn btn-error" onClick={() => deleteMutation.mutate(editingTransaction.id)}>Xóa</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Import Modal - Simplified for now */}
            {showImportModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Import từ Excel</h3>
                        <p className="py-4 font-medium">Chọn file Excel (.xlsx hoặc .csv) để import giao dịch.</p>
                        <input type="file" className="file-input file-input-bordered w-full" />
                        <div className="modal-action">
                            <button className="btn" onClick={() => setShowImportModal(false)}>Đóng</button>
                            <button className="btn btn-primary" onClick={() => alert('Chưa triển khai logic import file mới')}>Import</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Export Modal - Simplified for now */}
            {showExportModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Export dữ liệu</h3>
                        <p className="py-4">Chọn định dạng để xuất danh sách giao dịch.</p>
                        <div className="flex gap-4">
                            <button className="btn btn-outline border-blue-600 text-blue-600 flex-1">Excel</button>
                            <button className="btn btn-outline border-red-600 text-red-600 flex-1">PDF</button>
                        </div>
                        <div className="modal-action">
                            <button className="btn" onClick={() => setShowExportModal(false)}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TransactionModals;
