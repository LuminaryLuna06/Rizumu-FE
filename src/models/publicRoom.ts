export type ModelPublicRoom = {
  description: string;
  host_avatar: string;
  host_name: string;
  id: string;
  members: MemberAvatar[];
  avatar: string;
  name: string;
};

type MemberAvatar = {
  avatar: string;
};
