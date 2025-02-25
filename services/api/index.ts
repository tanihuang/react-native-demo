const PROD = 'https://api.tanihuang.com';
const DEV = 'http://localhost:3000';

const BASE_URL = process.env.NODE_ENV === 'production' ? `${PROD}/api` : `${DEV}/api`;
const BASE_URL_SOCKET = process.env.NODE_ENV === 'production' ? PROD : DEV;

const Default = {
  signup: `${BASE_URL}/auth/signup`,
  signin: `${BASE_URL}/auth/signin`,
  userByUsername: ({ value1 }: { value1: string }) => `${BASE_URL}/auth/user/${value1}`,
  chatRoom: `${BASE_URL_SOCKET}/chatroom`,
};

export default Default;
