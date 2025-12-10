export interface HeatMapData {
  [key: string]: number;
}

interface HeatMapProps {
  month: string;
  monthNumber: number;
  data: HeatMapData;
}

function HeatMap({ month, monthNumber, data }: HeatMapProps) {
  const year = new Date().getFullYear();
  const day = new Date(year, monthNumber, 0).getDate();

  const formatDate = (year: number, month: number, day: number): string => {
    const monthStr = month.toString().padStart(2, "0");
    const dayStr = day.toString().padStart(2, "0");
    return `${year}-${monthStr}-${dayStr}`;
  };

  const getBackgroundColor = (duration: number | undefined) => {
    if (!duration || duration === 0) return "bg-gray-100/20";

    if (duration < 30) return "bg-emerald-200";
    if (duration < 60) return "bg-emerald-300";
    if (duration < 120) return "bg-emerald-500";
    return "bg-emerald-700";
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
          const duration = Math.floor(data[dateKey] / 60) || 0;

          return (
            <div
              key={index}
              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-xs hover:scale-110 transition-transform cursor-pointer ${getBackgroundColor(
                duration
              )}`}
              title={`${dateKey}: ${
                duration
                  ? duration < 60
                    ? `${duration} minutes`
                    : `${Math.floor(duration / 60)}h ${
                        duration - Math.floor(duration / 60)
                      }m`
                  : "No activity"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

export default HeatMap;
