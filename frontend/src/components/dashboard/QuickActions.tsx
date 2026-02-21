import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FaPlus, FaFileExcel, FaChartBar, FaFileCsv } from "react-icons/fa";

const QuickActions = ({ onOpenAddModal }: { onOpenAddModal: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showImportMenu, setShowImportMenu] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Đóng khi click ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowImportMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const actions = [
    {
      icon: <FaPlus className="text-xl" />,
      label: "Thêm giao dịch",
      action: () => {
        onOpenAddModal();
        setIsOpen(false);
      },
      color: "#00C4B4",
    },
    {
      icon: <FaFileExcel className="text-xl" />,
      label: "Import Excel/CSV",
      action: () => setShowImportMenu(true),
      color: "#10b981",
    },
    {
      icon: <FaChartBar className="text-xl" />,
      label: "Xem báo cáo",
      link: "/reports",
      color: "#3b82f6",
    },
  ];

  return (
    <div ref={containerRef} className="relative">
      {/* Nút chính + (luôn hiển thị) */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#00C4B4] text-white rounded-full shadow-2xl flex items-center justify-center z-40 hover:bg-[#00a89a] hover:scale-110 transition-all duration-300 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaPlus className="text-2xl" />
        </motion.div>

        {/* Tooltip khi hover */}
        <span className="absolute right-20 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Hành động nhanh
        </span>
      </motion.button>

      {/* Các action hiện khi mở */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed bottom-28 right-8 flex flex-col items-end gap-3 z-40">
            {actions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.8 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="flex items-center gap-3"
              >
                {/* Label */}
                <span className="bg-slate-800 text-white text-sm px-4 py-2.5 rounded-2xl shadow-lg whitespace-nowrap">
                  {action.label}
                </span>

                {/* Nút action */}
                {action.link ? (
                  <Link
                    to={action.link}
                    onClick={() => setIsOpen(false)}
                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-xl text-white transition-all hover:scale-110"
                    style={{ backgroundColor: action.color }}
                  >
                    {action.icon}
                  </Link>
                ) : (
                  <button
                    onClick={action.action}
                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-xl text-white transition-all hover:scale-110"
                    style={{ backgroundColor: action.color }}
                  >
                    {action.icon}
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Modal Import */}
      <AnimatePresence>
        {showImportMenu && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md shadow-2xl rounded-3xl p-6"
            >
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                Import từ file
              </h3>
              <div className="space-y-3">
                <button className="flex items-center gap-3 w-full p-4 rounded-2xl border border-slate-100 hover:bg-green-50 transition-all">
                  <FaFileExcel className="text-green-600 text-xl" />
                  <span className="text-slate-700 font-medium">
                    Import từ Excel (.xlsx)
                  </span>
                </button>
                <button className="flex items-center gap-3 w-full p-4 rounded-2xl border border-slate-100 hover:bg-blue-50 transition-all">
                  <FaFileCsv className="text-blue-600 text-xl" />
                  <span className="text-slate-700 font-medium">
                    Import từ CSV (.csv)
                  </span>
                </button>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowImportMenu(false)}
                  className="px-6 py-2 text-slate-400 hover:text-slate-600 font-bold transition-colors"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuickActions;
