export type ModelRoom = {
  _id: string;
  slug: string;
  owner_id: string;
  name: string;
  description: string;
  is_public: boolean;
  locked: boolean;
  chat_during_pomodoro: boolean;
  background_name: string;
  background_type: string;
  created_at: string;
  updated_at: string;
  room_members: string;
};
