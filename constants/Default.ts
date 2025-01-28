export const Default = {
  api1: 'http://ec2-18-181-213-113.ap-northeast-1.compute.amazonaws.com',
  api2: 'http://localhost:3000',
  chatRoomDemo: 'http://localhost:3000/chatroom',
  chatRoom: 'http://ec2-18-181-213-113.ap-northeast-1.compute.amazonaws.com/chatroom',
  userByUsername: ({ value1 }: any) => `http://ec2-18-181-213-113.ap-northeast-1.compute.amazonaws.com/api/auth/user/${value1}`,
};

export const Dev = {
  chatRoom: 'http://localhost:3000/chatroom',
};

export const Prod = {
  chatRoom: 'http://ec2-18-181-213-113.ap-northeast-1.compute.amazonaws.com/chatroom',
};
