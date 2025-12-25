interface OnlineUsersProps {
  members: any[];
}

function OnlineUsers({ members }: OnlineUsersProps) {
  const onlineMembers = members.filter((member) => member.status === "online");

  if (onlineMembers.length === 0) return null;

  return (
    <div className="fixed top-20 right-4">
      <div className="flex items-center gap-2 bg-primary/60 backdrop-blur-xl border border-primary/50 rounded-lg px-4 py-2 shadow-lg">
        <span className="text-xs text-text-inactive font-medium">
          Online: {onlineMembers.length}
        </span>
        <div className="flex -space-x-2">
          {onlineMembers.slice(0, 5).map((member) => (
            <div key={member.user_id} className="relative group">
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-8 h-8 rounded-full border-2 border-primary ring-2 ring-green-500/50 object-cover hover:scale-110 transition-transform cursor-pointer"
                />
              ) : (
                <div className="w-8 h-8 rounded-full border-2 border-primary ring-2 ring-green-500/50 bg-secondary/10 flex items-center justify-center text-xs font-bold hover:scale-110 transition-transform cursor-pointer">
                  {member.name?.[0]?.toUpperCase() || "?"}
                </div>
              )}

              {/* Tooltip */}
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {member.name}
              </div>
            </div>
          ))}
          {onlineMembers.length > 5 && (
            <div className="w-8 h-8 rounded-full border-2 border-primary bg-secondary flex items-center justify-center text-xs font-bold">
              +{onlineMembers.length - 5}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OnlineUsers;
