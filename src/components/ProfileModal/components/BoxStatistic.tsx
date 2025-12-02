import React from "react";

interface BoxStatisticProps {
  className?: string;
  header: string;
  detail: any;
  note: string;
  icon?: React.ReactNode;
}

function BoxStatistic({
  className,
  header,
  detail,
  note,
  icon,
}: BoxStatisticProps) {
  return (
    <div
      className={`${(
        className || ""
      ).trim()} bg-gradient-to-r h-[150px] p-lg rounded-3xl shadow-xl flex flex-col justify-between transform hover:scale-102 transition relative overflow-hidden`}
    >
      {icon && (
        <div className="absolute top-1 right-1 opacity-20 text-white rotate-20">
          <div className="text-5xl">{icon}</div>
        </div>
      )}
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className={`text-base mb-xs`}>{header}</p>
          <p className="text-2xl font-bold">{detail}</p>
          <p className={`text-sm opacity-80`}>{note}</p>
        </div>
      </div>
    </div>
  );
}

export default BoxStatistic;
