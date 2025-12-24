export type ModelRoomMessage = {
  _id: string;
  type: "text" | "system";
  sender_id: string;
  content: string;
  createdAt: string;
  room_id?: string;
};
