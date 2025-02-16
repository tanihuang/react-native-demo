// const BASE_URL_PROD = 'http://ec2-54-168-90-93.ap-northeast-1.compute.amazonaws.com/api';
// const BASE_URL_DEV = 'http://localhost:3000';
// const BASE_URL_SOCKET = 'http://ec2-54-168-90-93.ap-northeast-1.compute.amazonaws.com';

// const BASE_URL = process.env.NODE_ENV === 'production' ? BASE_URL_PROD : BASE_URL_DEV;

// const Default = {
//   signup: `${BASE_URL}/auth/signup`,
//   signin: `${BASE_URL}/auth/signin`,
//   userByUsername: (username: string) => `${BASE_URL}/auth/user/${username}`,
//   chatRoom: `${BASE_URL_SOCKET}/chatroom`,
// };

// export default Default;

const BASE_URL_PROD = 'https://eponovzhw9.execute-api.ap-northeast-1.amazonaws.com/prod/api';
const BASE_URL_DEV = 'http://localhost:3000';
const BASE_URL_SOCKET = 'https://eponovzhw9.execute-api.ap-northeast-1.amazonaws.com/prod';

const BASE_URL = process.env.NODE_ENV === 'production' ? BASE_URL_PROD : BASE_URL_DEV;

const Default = {
  signup: `${BASE_URL}/auth/signup`,
  signin: `${BASE_URL}/auth/signin`,
  userByUsername: (username: any) => `${BASE_URL}/auth/user/${username}`,
  chatRoom: `${BASE_URL_SOCKET}/chatroom`, // WebSocket 也走 HTTPS
};

export default Default;


