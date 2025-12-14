export type ModelFriendRequest = {
  _id: string;
  user1: string;
  user2: string;
  status: string;
  requester: {
    _id: string;
    username: string;
    name: string;
    avatar?: string;
  };
  receiver: {
    _id: string;
    username: string;
    name: string;
    avatar?: string;
  };
  created_at: string;
  updated_at: string;
};
