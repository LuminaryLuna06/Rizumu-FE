interface BoxAnalyticsProps {
  icon: any;
  text: string;
  stat: any;
}

function BoxAnalytics({ icon, text, stat }: BoxAnalyticsProps) {
  return (
    <div className="flex flex-col text-xl text-text-inactive bg-zinc-900 border border-white/20 rounded-lg p-4">
      <div>{icon}</div>
      <p className="text-xs ml-1 mt-xs mb-md">{text}</p>
      <p className="text-text-active font-semibold ml-1">{stat}</p>
    </div>
  );
}

export default BoxAnalytics;
