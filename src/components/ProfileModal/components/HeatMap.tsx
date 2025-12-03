interface HeatMapProps {
  month: string;
  monthNumber: number;
  day: number;
  year: number;
  data: Record<string, number>;
}

function HeatMap({ month, monthNumber, day, year, data }: HeatMapProps) {
  const getBackgroundColor = (level: number | undefined) => {
    if (!level) return "bg-gray-100/20 ";

    switch (level) {
      case 1:
        return "bg-emerald-100";
      case 2:
        return "bg-emerald-300";
      case 3:
        return "bg-emerald-500";
      case 4:
        return "bg-emerald-700";
      default:
        return "bg-gray-100/20 ";
    }
  };

  const formatDate = (year: number, month: number, day: number) => {
    const monthStr = month.toString().padStart(2, "0");
    const dayStr = day.toString().padStart(2, "0");
    return `${year}-${monthStr}-${dayStr}`;
  };

  return (
    <div className="flex flex-col items-center m-sm">
      <div className="text-xs font-medium text-gray-300 text-center mb-2">
        {month}
      </div>
      <div className="grid grid-cols-7 gap-xs lg:gap-1 max-w-[143px]">
        {Array.from({ length: day }).map((_, index) => {
          const dayNumber = index + 1;
          const dateKey = formatDate(year, monthNumber, dayNumber);
          const activityLevel = data[dateKey];

          return (
            <div
              key={index}
              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-xs hover:scale-110 transition-transform cursor-pointer ${getBackgroundColor(
                activityLevel
              )}`}
              title={`${dateKey}: ${
                activityLevel ? `${activityLevel} pomodoros` : "No activity"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

export default HeatMap;
