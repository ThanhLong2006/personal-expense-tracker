import React, { useState, useRef, useEffect } from "react";
import { FaRegCalendar } from "react-icons/fa6";
import Calendar from "./Calendar.tsx";

interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Chọn ngày",
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
    } else {
      setSelectedDate(undefined);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const formattedDate = date.toISOString().split("T")[0];
    onChange?.(formattedDate);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedDate(undefined);
    onChange?.("");
    setIsOpen(false);
  };

  const handleToday = () => {
    const today = new Date();
    setSelectedDate(today);
    const formattedDate = today.toISOString().split("T")[0];
    onChange?.(formattedDate);
    setIsOpen(false);
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="relative" ref={containerRef}>
      <div
        className={`relative cursor-pointer ${
          disabled ? "pointer-events-none opacity-50" : ""
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <input
          type="text"
          readOnly
          value={selectedDate ? formatDisplayDate(selectedDate) : ""}
          placeholder={placeholder}
          className={`input input-bordered w-full pl-10 rounded-[0.5rem] focus:outline-none h-14 focus:border-[#00C4B4] transition-all bg-white border-slate-200 cursor-pointer ${className}`}
        />
        <FaRegCalendar
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          size={16}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-[9999]">
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onClear={handleClear}
            onToday={handleToday}
          />
        </div>
      )}
    </div>
  );
};

export default DatePicker;
