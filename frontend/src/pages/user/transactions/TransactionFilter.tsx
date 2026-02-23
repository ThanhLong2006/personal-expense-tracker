import React from "react";
import { FaMagnifyingGlass, FaFilter, FaLayerGroup, FaMoneyBill1Wave } from "react-icons/fa6";
import DatePicker from "../../../components/ui/DatePicker";
import { Filter } from "./types";

interface TransactionFilterProps {
    filters: Filter;
    setFilters: (filters: Filter) => void;
    showFilters: boolean;
    setShowFilters: (show: boolean) => void;
    quickFilter: string | null;
    applyQuickFilter: (filter: any) => void;
    clearFilters: () => void;
    categories: any[];
    activeFiltersCount: number;
}

const TransactionFilter: React.FC<TransactionFilterProps> = ({
    filters, setFilters, showFilters, setShowFilters,
    quickFilter, applyQuickFilter, clearFilters,
    categories, activeFiltersCount
}) => {
    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center !mb-6 gap-4">
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-slate-800">
                        Lịch sử giao dịch
                    </h3>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <input
                            type="text"
                            placeholder="Tìm kiếm giao dịch..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="input input-sm bg-white border-slate-200 focus:border-[#00C4B4] focus:outline-none pl-10 pr-4 w-full sm:w-64"
                        />
                        <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`btn btn-sm gap-2 transition-all duration-300 ${showFilters ? "bg-[#00C4B4] text-white border-[#00C4B4]" : "bg-white text-slate-600 border-slate-200"
                            }`}
                    >
                        <FaFilter size={12} />
                        <span className="text-sm font-semibold">Bộ lọc</span>
                    </button>
                </div>
            </div>

            <div className={`transition-all duration-500 !mt-0 ease-in-out ${showFilters ? "max-h-[2000px] opacity-100 mb-8" : "max-h-0 opacity-0 overflow-hidden"}`}>
                <div className="card bg-white shadow-xl border border-slate-100 rounded-2xl">
                    <div className="card-body p-6">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 flex-wrap gap-4">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-l font-bold text-slate-600 tracking-wider mr-2">Lọc nhanh:</span>
                                {["today", "week", "month", "year", "all"].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => applyQuickFilter(type)}
                                        className={`btn btn-sm px-4 font-medium ${quickFilter === type ? "bg-[#00C4B4] text-white" : "btn-ghost"}`}
                                    >
                                        {type === "today" ? "Hôm nay" : type === "week" ? "Tuần này" : type === "month" ? "Tháng này" : type === "year" ? "Năm nay" : "Tất cả"}
                                    </button>
                                ))}
                                {activeFiltersCount > 0 && (
                                    <span className="badge bg-[#00C4B4] border-none text-white px-3 py-4 text-sm font-semibold ml-3">
                                        Đang lọc {activeFiltersCount} mục
                                    </span>
                                )}
                            </div>
                            <button onClick={clearFilters} className="btn btn-sm btn-ghost text-error hover:bg-error/10 font-medium">Xóa bộ lọc</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {/* Category Filter */}
                            <div className="form-control w-full">
                                <label className="label pb-1">
                                    <span className="label-text font-semibold text-slate-700 text-sm">Danh mục</span>
                                </label>
                                <select
                                    value={filters.categoryId || ""}
                                    onChange={(e) => setFilters({ ...filters, categoryId: e.target.value ? Number(e.target.value) : null })}
                                    className="select select-sm bg-slate-50 border-slate-200"
                                >
                                    <option value="">Tất cả danh mục</option>
                                    {categories?.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-control w-full">
                                <label className="label pb-1"><span className="label-text font-semibold text-sm">Từ ngày</span></label>
                                <DatePicker value={filters.startDate || ""} onChange={(v) => setFilters({ ...filters, startDate: v || null })} placeholder="Bắt đầu" className="input-sm" />
                            </div>

                            <div className="form-control w-full">
                                <label className="label pb-1"><span className="label-text font-semibold text-sm">Đến ngày</span></label>
                                <DatePicker value={filters.endDate || ""} onChange={(v) => setFilters({ ...filters, endDate: v || null })} placeholder="Kết thúc" className="input-sm" />
                            </div>

                            <div className="form-control w-full">
                                <label className="label pb-1"><span className="label-text font-semibold text-sm">Giá từ</span></label>
                                <input type="number" className="input input-sm border-slate-200" value={filters.minAmount || ""} onChange={(e) => setFilters({ ...filters, minAmount: Number(e.target.value) || null })} />
                            </div>

                            <div className="form-control w-full">
                                <label className="label pb-1"><span className="label-text font-semibold text-sm">Giá đến</span></label>
                                <input type="number" className="input input-sm border-slate-200" value={filters.maxAmount || ""} onChange={(e) => setFilters({ ...filters, maxAmount: Number(e.target.value) || null })} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TransactionFilter;
