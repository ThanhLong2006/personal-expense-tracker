import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMoneyBill1Wave, FaListUl, FaArrowTrendDown, FaArrowTrendUp, FaEquals, FaChartSimple } from "react-icons/fa6";
import { Statistics } from "./types";

interface TransactionStatsProps {
    showStatistics: boolean;
    statistics: Statistics;
    formatCurrency: (value: number) => string;
}

const TransactionStats: React.FC<TransactionStatsProps> = ({ showStatistics, statistics, formatCurrency }) => {
    return (
        <AnimatePresence>
            {showStatistics && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gradient-to-r from-slate-100/80 via-blue-100/50 to-purple-100/50 backdrop-blur-sm border border-white/40 rounded-2xl shadow-sm overflow-hidden relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-200/15 via-purple-200/15 to-pink-200/15"></div>
                    <div className="p-6 relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl border-2 border-slate-200 flex items-center justify-center">
                                    <FaChartSimple className="text-slate-600 text-lg" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Thống kê</h3>
                                    <p className="text-sm text-slate-500">Tổng quan giao dịch hiện tại</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <StatCard title="Tổng chi" value={formatCurrency(statistics.total)} icon={<FaMoneyBill1Wave />} color="text-[#00C4B4]" borderColor="hover:border-[#00C4B4]" description="Tổng số tiền đã chi" />
                            <StatCard title="Số lượng" value={statistics.count.toString()} icon={<FaListUl />} color="text-blue-600" borderColor="hover:border-blue-500" description="Giao dịch đã thực hiện" />
                            <StatCard title="Thấp nhất" value={formatCurrency(statistics.min)} icon={<FaArrowTrendDown />} color="text-green-600" borderColor="hover:border-green-500" description="Giao dịch nhỏ nhất" />
                            <StatCard title="Cao nhất" value={formatCurrency(statistics.max)} icon={<FaArrowTrendUp />} iconColor="text-red-600" color="text-red-600" borderColor="hover:border-red-500" description="Giao dịch lớn nhất" />
                            <StatCard title="Trung bình" value={formatCurrency(statistics.average)} icon={<FaEquals />} color="text-purple-600" borderColor="hover:border-purple-500" description="Trung bình mỗi giao dịch" />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    color: string;
    borderColor: string;
    description: string;
    iconColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, borderColor, description, iconColor }) => (
    <div className={`bg-white rounded-xl p-4 border-2 border-slate-200 ${borderColor} transition-all duration-300 group`}>
        <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-bold ${color} uppercase tracking-wider`}>{title}</span>
            <div className={`w-6 h-6 rounded-lg border border-current opacity-30 flex items-center justify-center group-hover:opacity-100 transition-colors ${iconColor || color}`}>
                {icon}
            </div>
        </div>
        <div className="text-2xl font-black text-slate-800 leading-none">{value}</div>
        <div className="text-xs text-slate-500 mt-1">{description}</div>
    </div>
);

export default TransactionStats;
