import { configureStore } from '@reduxjs/toolkit';
import userReducer from './authSlice';
import chatRoomReducer from './chatRoomSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    chatroom: chatRoomReducer,
  },
});

export default store;
