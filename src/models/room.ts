export type ModelRoom = {
  _id: string;
  slug: string;
  owner_id: string;
  name: string;
  description: string;
  is_public: boolean;
  locked: boolean;
  chat_during_pomodoro: boolean;
  background: Background;
  created_at: string;
  updated_at: string;
  room_members: Member[];
};

type Background = {
  name: string;
  type: "static" | "animated";
};
type Member = {
  user_id: string;
  role: "member" | "admin";
  joined_at: string;
  last_active_at: string;
  _id: string;
};
