import { configureStore } from '@reduxjs/toolkit';
import userReducer from './authSlice';
import chatRoomSocketReducer from './chatRoom/socket/chatRoomSlice';
import chatRoomFirebaseReducer from './chatRoom/firebase/chatRoomSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    chatRoomSocket: chatRoomSocketReducer,
    chatRoomFirebase: chatRoomFirebaseReducer,
  },
});

export default store;
