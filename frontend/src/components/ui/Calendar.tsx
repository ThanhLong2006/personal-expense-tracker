import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

interface CalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  onClear?: () => void;
  onToday?: () => void;
}

const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
  onClear,
  onToday,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Get previous month's last days
  const prevMonth = new Date(currentYear, currentMonth - 1, 0);
  const daysInPrevMonth = prevMonth.getDate();

  const today = new Date();
  const isToday = (day: number) => {
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear
    );
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    onDateSelect?.(newDate);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(currentMonth - 1);
    } else {
      newDate.setMonth(currentMonth + 1);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    onToday?.();
    onDateSelect?.(today);
  };

  const handleClear = () => {
    onClear?.();
  };

  // Generate calendar days - chỉ hiện ngày trong tháng
  const calendarDays = [];

  // Empty cells for days before month starts
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
  }

  // Current month days only
  for (let day = 1; day <= daysInMonth; day++) {
    const isCurrentDay = isToday(day);
    const isSelectedDay = isSelected(day);

    calendarDays.push(
      <button
        key={day}
        onClick={() => handleDateClick(day)}
        className={`w-8 h-8 rounded-full text-xs font-semibold transition-all duration-200 ${
          isSelectedDay
            ? "bg-[#00C4B4] text-white shadow-md scale-105"
            : isCurrentDay && !isSelectedDay
            ? "bg-[#00C4B4] text-white"
            : "text-gray-700 hover:bg-gray-100 hover:scale-105"
        }`}
      >
        {day}
      </button>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 w-72 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth("prev")}
          className="w-8 h-8 rounded-full text-gray-600 hover:text-[#00C4B4] hover:bg-gray-100 flex items-center justify-center transition-colors"
        >
          <FaChevronLeft size={12} />
        </button>

        <h2 className="text-lg font-bold text-gray-900">
          Tháng {currentMonth + 1}/{currentYear}
        </h2>

        <button
          onClick={() => navigateMonth("next")}
          className="w-8 h-8 rounded-full text-gray-600 hover:text-[#00C4B4] hover:bg-gray-100 flex items-center justify-center transition-colors"
        >
          <FaChevronRight size={12} />
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-gray-600 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">{calendarDays}</div>

      {/* Footer buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleClear}
          className="text-gray-500 font-medium hover:text-gray-700 transition-colors text-sm"
        >
          Clear
        </button>

        <button
          onClick={handleToday}
          className="bg-[#00C4B4] text-white px-4 py-1.5 rounded-full font-semibold hover:bg-[#00a89a] transition-colors shadow-md text-sm"
        >
          Today
        </button>
      </div>
    </div>
  );
};

export default Calendar;
