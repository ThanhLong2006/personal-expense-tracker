import React from "react";

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  height?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  children,
  actions,
  className = "",
  height = "h-80",
}) => {
  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {actions && (
          <div className="flex items-center gap-4 text-sm">{actions}</div>
        )}
      </div>
      <div className={height}>{children}</div>
    </div>
  );
};

export default ChartCard;
