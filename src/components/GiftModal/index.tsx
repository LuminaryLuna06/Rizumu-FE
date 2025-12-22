import type { ModelUserProfile } from "@rizumu/models/userProfile";
import Modal from "../Modal";
import { useAuth } from "@rizumu/context/AuthContext";
import { useEffect, useState } from "react";
import { gifts } from "../../constants/gift";
import { useToast } from "@rizumu/utils/toast/toast";
import axiosClient from "@rizumu/tanstack/api/config/axiosClient";

interface GiftModalProps {
  opened: boolean;
  onClose: () => void;
  profile: ModelUserProfile | null;
}

function GiftModal({ opened, onClose, profile }: GiftModalProps) {
  const { user } = useAuth();
  const [coins, setCoins] = useState(0);
  const [selectedGift, setSelectedGift] = useState<number | null>(null);
  const selectedGiftData = gifts.find((g) => g.id === selectedGift);
  const currentPrice = selectedGiftData?.price || 0;
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const getStat = async () => {
    try {
      const response = await axiosClient.get(`/progress/stats/${user?._id}`);
      setCoins(response.data.data.coins); // User earlier conversation mentioned "coin" property
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const sendGift = async () => {
    if (!selectedGiftData || !profile?._id) return;
    setIsLoading(true);
    try {
      await axiosClient.post(`/progress/gift`, {
        receiverId: profile?._id,
        icon: selectedGiftData.image,
      });
      await axiosClient.patch("/progress/stats", {
        coins: -1 * selectedGiftData.price,
      });
      toast.success(`Gift sent to ${profile.name}!`);
      onClose();
      getStat(); // Refresh coins after sending
      setIsLoading(false);
    } catch (error: any) {
      console.error("Error sending gift:", error);
      toast.error(error?.response?.data?.message || "Failed to send gift");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (opened) {
      if (user?._id) {
        getStat();
      }
    } else {
      setSelectedGift(null);
    }
  }, [opened, user?._id]);

  return (
    <Modal opened={opened} onClose={onClose} title="">
      <div className="flex flex-col items-center gap-6 p-4">
        <div className="text-center">
          <p className="text-xl font-semibold text-white">
            Send Gift to {profile?.name}
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-gray-400">Your coins:</span>
            <span className="text-yellow-400 font-bold flex items-center gap-1">
              {coins} <span className="text-xs">🪙</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 w-full max-h-[400px] px-2 overflow-y-auto custom-scrollbar scrollbar-hidden">
          {gifts.map((gift) => (
            <div
              key={gift.id}
              onClick={() => setSelectedGift(gift.id)}
              className={`relative flex flex-col items-center p-1 rounded-2xl cursor-pointer transition-all duration-300 border-2 mt-2 ${
                selectedGift === gift.id
                  ? "border-active bg-secondary/20 scale-105 shadow-lg shadow-active/30"
                  : "border-transparent bg-secondary/30 hover:border-white/10"
              }`}
            >
              <div className="w-35 h-35 flex items-center justify-center drop-shadow-xl">
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
              sendGift();
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
