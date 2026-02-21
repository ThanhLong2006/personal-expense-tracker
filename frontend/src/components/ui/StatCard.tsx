import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: "increase" | "decrease";
  };
  icon?: React.ReactNode;
  iconColor?: string;
  borderColor?: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  iconColor = "#6366f1",
  borderColor = "#6366f1",
  className = "",
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className={`bg-white rounded-lg p-6 shadow-sm border-2 border-gray-200 transition-all duration-200 cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderColor: isHovered ? borderColor : "#e5e7eb",
      }}
    >
      <div className="flex items-start gap-4">
        {/* Icon with hover color effect */}
        {icon && (
          <div
            className="flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-all duration-200"
            style={{
              backgroundColor: isHovered ? `${iconColor}15` : "#f9fafb",
              borderColor: isHovered ? iconColor : "#e5e7eb",
              color: isHovered ? iconColor : "#9ca3af",
            }}
          >
            {icon}
          </div>
        )}

        <div className="flex-1">
          <h3 className="text-gray-500 text-base font-medium mb-2">{title}</h3>
          <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
          {change && (
            <div className="flex items-center">
              <span
                className={`text-sm font-medium ${
                  change.type === "increase" ? "text-green-500" : "text-red-500"
                }`}
              >
                {change.type === "increase" ? "+" : ""}
                {change.value}
              </span>
              <span
                className={`ml-1 ${
                  change.type === "increase" ? "text-green-500" : "text-red-500"
                }`}
              >
                {change.type === "increase" ? "↑" : "↓"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
