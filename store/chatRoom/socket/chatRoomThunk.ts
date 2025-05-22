import { createAsyncThunk } from '@reduxjs/toolkit';
import { setMemberList } from '@/store/chatRoom/socket/chatRoomSlice';

import { 
  setChatRoomList, 
  setUpdateChatRoomList, 
  setChatRoomItem, 
  setChatList, 
  setUpdateChatList, 
  clearChat,
} from '@/store/chatRoom/socket/chatRoomSlice';

export const updateMembersThunk = createAsyncThunk(
  'chatroom/socket/updateMembersThunk',
  async (payload: { member: any; group: number }, { dispatch, getState }) => {
    dispatch(setMemberList(payload));
    return (getState() as { chatRoomSocket: any }).chatRoomSocket.members;
  }
);
