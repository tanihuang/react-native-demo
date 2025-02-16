// const BASE_URL_PROD = 'http://ec2-54-168-90-93.ap-northeast-1.compute.amazonaws.com/api';
// const BASE_URL_DEV = 'http://localhost:3000';
// const BASE_URL_SOCKET = 'http://ec2-54-168-90-93.ap-northeast-1.compute.amazonaws.com';

// const BASE_URL_DEF = process.env.NODE_ENV === 'production' ? BASE_URL_PROD : BASE_URL_DEV;

// const Default = {
//   signup: `${BASE_URL_DEF}/auth/signup`,
//   signin: `${BASE_URL_DEF}/auth/signin`,
//   userByUsername: (username: string) => `${BASE_URL_DEF}/auth/user/${username}`,
//   chatRoom: `${BASE_URL_SOCKET}/chatroom`,
// };

// export default Default;

const BASE_URL_PROD = 'https://api.tanihuang.com/api';
const BASE_URL_DEV = 'http://localhost:3000/api';
const BASE_URL_SOCKET = 'https://api.tanihuang.com';

const BASE_URL_DEF = process.env.NODE_ENV === 'production' ? BASE_URL_PROD : BASE_URL_PROD;

const Default = {
  signup: `${BASE_URL_DEF}/auth/signup`,
  signin: `${BASE_URL_DEF}/auth/signin`,
  userByUsername: (username: any) => `${BASE_URL_DEF}/auth/user/${username}`,
  chatRoom: `${BASE_URL_SOCKET}/chatroom`,
};

export default Default;


