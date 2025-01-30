const BASE_URL_PROD = 'http://ec2-54-168-90-93.ap-northeast-1.compute.amazonaws.com';
const BASE_URL_DEV = 'http://localhost:3000';

const BASE_URL = process.env.NODE_ENV === 'production' ? BASE_URL_PROD : BASE_URL_DEV;

const Default = {
  signup: `${BASE_URL}/api/auth/signup`,
  signin: `${BASE_URL}/api/auth/signin`,
  userByUsername: (username: string) => `${BASE_URL}/api/auth/user/${username}`,
  chatRoom: `${BASE_URL}/chatroom`,
};

export default Default;
