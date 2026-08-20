import type { ModelUserProfile } from "@rizumu/models/userProfile";
import Modal from "../Modal";
import { useAuth } from "@rizumu/context/AuthContext";
import { useState } from "react";
import { gifts } from "../../constants/gift";
import { useToast } from "@rizumu/utils/toast/toast";
import { useStatsById, useSendGift } from "@rizumu/tanstack/api/hooks";
import { IconGift } from "@tabler/icons-react";

interface GiftModalProps {
  opened: boolean;
  onClose: () => void;
  profile: ModelUserProfile | null;
}

function GiftModal({ opened, onClose, profile }: GiftModalProps) {
  const { user } = useAuth();
  const [sendingGiftId, setSendingGiftId] = useState<number | null>(null);
  const toast = useToast();

  // React Query hooks
  const { data: stats } = useStatsById(user?._id || "", opened && !!user?._id);
  const sendGiftMutation = useSendGift();

  const coins = stats?.coins || 0;

  const handleQuickSend = (gift: (typeof gifts)[0]) => {
    if (!profile?._id || !profile?.name) return;
    if (coins < gift.price) {
      toast.warning(
        `You need ${gift.price} coins to send this gift (you have ${coins})`,
        "Not enough coins"
      );
      return;
    }

    setSendingGiftId(gift.id);

    sendGiftMutation.mutate(
      {
        receiverId: profile._id,
        icon: gift.image,
        price: gift.price,
      },
      {
        onSuccess: () => {
          toast.success(
            `Successfully sent a gift to ${profile.name}! 🎁`,
            "Gift Sent"
          );
          setSendingGiftId(null);
          onClose();
        },
        onError: (error: any) => {
          console.error("Error sending gift:", error);
          toast.error(
            error?.response?.data?.message || "Failed to send gift",
            "Error"
          );
          setSendingGiftId(null);
        },
      }
    );
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Send a Gift"
      more={<IconGift size={22} className="text-yellow-400" />}
      className="gift-modal max-w-[560px]"
    >
      <div className="flex flex-col gap-4">
        {/* Recipient & Coin Header */}
        <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-3.5 px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/40 border border-white/20 flex items-center justify-center font-bold text-white text-base">
              {profile?.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                profile?.name?.[0]?.toUpperCase() || "U"
              )}
            </div>
            <div>
              <p className="text-xs text-white/50 font-medium">Recipient</p>
              <p className="text-sm font-semibold text-white truncate max-w-[180px] sm:max-w-[220px]">
                {profile?.name || "Friend"}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <p className="text-xs text-white/50 font-medium">Your Balance</p>
            <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 px-3 py-1 rounded-full mt-0.5 shadow-sm">
              <span className="text-sm font-bold text-yellow-400">{coins}</span>
              <span className="text-xs">🪙</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-white/40 text-center -mt-1">
          Tap any gift below to send it instantly ⚡
        </p>

        {/* 1-Click Fast Gift Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-[380px] overflow-y-auto custom-scrollbar overscroll-contain pr-1 pb-1">
          {gifts.map((gift) => {
            const hasEnough = coins >= gift.price;
            const isSendingThis = sendingGiftId === gift.id;

            return (
              <button
                key={gift.id}
                type="button"
                disabled={!hasEnough || sendGiftMutation.isPending}
                onClick={() => handleQuickSend(gift)}
                className={`group relative flex flex-col items-center justify-between p-3 rounded-2xl border transition-all duration-200 text-left ${
                  hasEnough
                    ? "bg-white/5 border-white/10 hover:border-yellow-400/60 hover:bg-yellow-400/5 hover:scale-[1.04] active:scale-[0.96] cursor-pointer shadow-md hover:shadow-yellow-500/10"
                    : "bg-white/[0.02] border-white/5 opacity-40 grayscale cursor-not-allowed"
                }`}
              >
                {/* Gift Image */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center my-1">
                  <img
                    src={gift.image}
                    alt={`Gift ${gift.id}`}
                    loading="lazy"
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-200 drop-shadow-md"
                  />
                </div>

                {/* Price Pill */}
                <div className="flex items-center justify-center gap-1 w-full pt-2 border-t border-white/10">
                  {isSendingThis ? (
                    <span className="text-xs font-semibold text-yellow-400 animate-pulse">
                      Sending...
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-yellow-400 flex items-center gap-1">
                      {gift.price} <span className="text-[10px]">🪙</span>
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}

export default GiftModal;
