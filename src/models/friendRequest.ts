export type ModelFriendRequest = {
  _id: string;
  user1: string;
  user2: string;
  status: string;
  requester: User;
  receiver: User;
  created_at: string;
  updated_at: string;
};

type User = {
  _id: string;
  username: string;
  name: string;
  avatar?: string;
};
