export type MemberUpdatedDto = {
  new: {
    type: string;
  };
  old: {
    type: string;
  };
  userId: string;
  fromUser: {
    id: string;
    email: string;
  };
};
