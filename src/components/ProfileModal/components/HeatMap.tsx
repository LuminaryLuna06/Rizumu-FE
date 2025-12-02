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
        return "bg-emerald-500/30";
      case 2:
        return "bg-emerald-500/50";
      case 3:
        return "bg-emerald-500/70";
      case 4:
        return "bg-emerald-500/100";
      default:
        return "bg-gray-100/20 ";
    }
  };

  // Function to format date as YYYY-MM-DD
  const formatDate = (year: number, month: number, day: number) => {
    const monthStr = month.toString().padStart(2, "0");
    const dayStr = day.toString().padStart(2, "0");
    return `${year}-${monthStr}-${dayStr}`;
  };

  return (
    <div className="m-sm">
      <div className="text-xs font-medium text-gray-300 text-center mb-2">
        {month}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: day }).map((_, index) => {
          const dayNumber = index + 1;
          const dateKey = formatDate(year, monthNumber, dayNumber);
          const activityLevel = data[dateKey];

          return (
            <div
              key={index}
              className={`w-4 h-4 rounded-xs hover:scale-110 transition-transform cursor-pointer ${getBackgroundColor(
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
