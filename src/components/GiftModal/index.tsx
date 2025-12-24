import type { ModelUserProfile } from "@rizumu/models/userProfile";
import Modal from "../Modal";
import { useAuth } from "@rizumu/context/AuthContext";
import { useState } from "react";
import { gifts } from "../../constants/gift";
import { useToast } from "@rizumu/utils/toast/toast";
import {
  useStatsById,
  useSendGift,
  useUpdateStats,
} from "@rizumu/tanstack/api/hooks";

interface GiftModalProps {
  opened: boolean;
  onClose: () => void;
  profile: ModelUserProfile | null;
}

function GiftModal({ opened, onClose, profile }: GiftModalProps) {
  const { user } = useAuth();
  const [selectedGift, setSelectedGift] = useState<number | null>(null);
  const selectedGiftData = gifts.find((g) => g.id === selectedGift);
  const currentPrice = selectedGiftData?.price || 0;
  const toast = useToast();

  // React Query hooks
  const { data: stats } = useStatsById(user?._id || "", opened && !!user?._id);
  const sendGiftMutation = useSendGift();
  const updateStats = useUpdateStats();

  const coins = stats?.coins || 0;
  const isLoading = sendGiftMutation.isPending || updateStats.isPending;

  const handleSendGift = () => {
    if (!selectedGiftData || !profile?._id || !profile?.name) return;

    sendGiftMutation.mutate(
      {
        receiverId: profile._id,
        icon: selectedGiftData.image,
      },
      {
        onSuccess: () => {
          // Update coins after sending gift
          updateStats.mutate(
            { coins: -1 * selectedGiftData.price },
            {
              onSuccess: () => {
                toast.success(`Gift sent to ${profile.name}!`, "Success");
                onClose();
                setSelectedGift(null);
              },
              onError: (error: any) => {
                console.error("Error updating coins:", error);
                toast.error(
                  error?.response?.data?.message || "Failed to update coins",
                  "Error"
                );
              },
            }
          );
        },
        onError: (error: any) => {
          console.error("Error sending gift:", error);
          toast.error(
            error?.response?.data?.message || "Failed to send gift",
            "Error"
          );
        },
      }
    );
  };

  return (
    <Modal opened={opened} onClose={onClose} title="">
      <div className="flex flex-col items-center gap-6 p-4">
        <div className="text-center">
          <p className="text-xl font-semibold text-white">
            Send Gift to {profile?.name || "User"}
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-gray-400">Your coins:</span>
            <span className="text-yellow-400 font-bold flex items-center gap-1">
              {coins} <span className="text-xs">🪙</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 w-full max-h-[400px] px-2 overflow-y-auto custom-scrollbar scrollbar-hidden">
          {gifts.map((gift) => (
            <div
              key={gift.id}
              onClick={() => setSelectedGift(gift.id)}
              className={`relative flex flex-col items-center py-4 p-1 rounded-2xl cursor-pointer transition-all duration-300 border-2 mt-2 ${
                selectedGift === gift.id
                  ? "border-active bg-secondary/20 scale-105 shadow-lg shadow-active/30"
                  : "border-transparent bg-secondary/30 hover:border-white/10"
              }`}
            >
              <div className="w-20 h-20 flex items-center justify-center drop-shadow-xl">
                <img
                  src={gift.image}
                  alt={`Gift ${gift.id}`}
                  className="w-full h-full object-contain transform hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="mt-3 flex items-center gap-1">
                <span className="text-lg font-bold text-yellow-500">
                  {gift.price}
                </span>
                <span className="text-sm">🪙</span>
              </div>
            </div>
          ))}
        </div>

        <button
          disabled={!selectedGift || coins < currentPrice || isLoading}
          className={`w-full py-3 rounded-xl font-bold transition-all duration-300 bg-gray-800 text-gray-400 ${
            selectedGift && coins >= currentPrice && !isLoading
              ? "bg-active text-white hover:brightness-110 shadow-lg shadow-active/40 cursor-pointer"
              : "cursor-not-allowed opacity-50"
          }`}
          onClick={() => {
            if (selectedGift && coins >= currentPrice) {
              handleSendGift();
            }
          }}
        >
          {!selectedGift
            ? "Select a gift"
            : coins < currentPrice
            ? "Not enough coins"
            : isLoading
            ? "Sending..."
            : "Send now"}
        </button>
      </div>
    </Modal>
  );
}

export default GiftModal;
