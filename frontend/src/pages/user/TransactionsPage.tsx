import React, { useState } from "react";
import { FaPlus, FaFileImport, FaFileExport, FaChartSimple } from "react-icons/fa6";
import { useTransactions } from "./transactions/useTransactions";
import TransactionStats from "./transactions/TransactionStats";
import TransactionFilter from "./transactions/TransactionFilter";
import TransactionTable from "./transactions/TransactionTable";
import TransactionModals from "./transactions/TransactionModals";
import { Transaction } from "./transactions/types";

const TransactionsPage: React.FC = () => {
  const {
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
    bulkDeleteMutation,
  } = useTransactions();

  // Local UI States
  const [showFilters, setShowFilters] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [selectedTransactions, setSelectedTransactions] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Helper functions
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== null && v !== "").length;

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowEditModal(true);
  };

  const handleDelete = (id: number) => {
    setEditingTransaction(processedTransactions.find(t => t.id === id) || null);
    setShowDeleteModal(true);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(processedTransactions.map(t => t.id));
    }
    setSelectAll(!selectAll);
  };

  const toggleSelectTransaction = (id: number) => {
    if (selectedTransactions.includes(id)) {
      setSelectedTransactions(selectedTransactions.filter(sid => sid !== id));
    } else {
      setSelectedTransactions([...selectedTransactions, id]);
    }
  };

  if (error) {
    return (
      <div className="p-8 text-center text-error">
        <h2 className="text-2xl font-bold">Lỗi tải dữ liệu</h2>
        <p>{(error as Error).message}</p>
        <button onClick={() => refetch()} className="btn btn-outline btn-error mt-4">Thử lại</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pl-0 md:pl-6 animate-fadeIn pb-20">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Quản lý giao dịch</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Tổng cộng <span className="text-[#00C4B4] font-bold">{processedTransactions.length}</span> giao dịch được tìm thấy
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary gap-2 bg-[#00C4B4] border-none hover:bg-[#00a89a]">
            <FaPlus /> Thêm mới
          </button>
          <button onClick={() => setShowImportModal(true)} className="btn btn-outline gap-2 border-slate-200">
            <FaFileImport /> Import
          </button>
          <button onClick={() => setShowExportModal(true)} className="btn btn-outline gap-2 border-slate-200">
            <FaFileExport /> Export
          </button>
          <button onClick={() => setShowStatistics(!showStatistics)} className="btn btn-ghost gap-2 text-slate-600">
            <FaChartSimple /> Thống kê
          </button>
        </div>
      </div>

      {/* Stats component */}
      <TransactionStats
        showStatistics={showStatistics}
        statistics={statistics}
        formatCurrency={formatCurrency}
      />

      {/* Filter component */}
      <TransactionFilter
        filters={filters}
        setFilters={setFilters}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        quickFilter={quickFilter}
        applyQuickFilter={applyQuickFilter}
        clearFilters={clearFilters}
        categories={categories}
        activeFiltersCount={activeFiltersCount}
      />

      {/* Table component */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <TransactionTable
          isLoading={isLoading}
          transactions={processedTransactions}
          selectedTransactions={selectedTransactions}
          setSelectedTransactions={setSelectedTransactions}
          selectAll={selectAll}
          toggleSelectAll={toggleSelectAll}
          toggleSelectTransaction={toggleSelectTransaction}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleBulkDelete={() => {
            if (selectedTransactions.length === 0) return;
            bulkDeleteMutation.mutate(selectedTransactions, {
              onSettled: () => {
                setSelectedTransactions([]);
                setSelectAll(false);
              }
            });
          }}
          setShowAddModal={setShowAddModal}
        />
      </div>

      {/* Modals component */}
      <TransactionModals
        showAddModal={showAddModal} setShowAddModal={setShowAddModal}
        showEditModal={showEditModal} setShowEditModal={setShowEditModal}
        showDeleteModal={showDeleteModal} setShowDeleteModal={setShowDeleteModal}
        showImportModal={showImportModal} setShowImportModal={setShowImportModal}
        showExportModal={showExportModal} setShowExportModal={setShowExportModal}
        editingTransaction={editingTransaction}
        createMutation={createMutation}
        updateMutation={updateMutation}
        deleteMutation={deleteMutation}
      />
    </div>
  );
};

export default TransactionsPage;
