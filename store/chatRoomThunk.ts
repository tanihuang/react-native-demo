import { createAsyncThunk } from '@reduxjs/toolkit';
import { setMemberList } from '@/store/chatRoomSlice';
import { 
  setChatRoomList, 
  setUpdateChatRoomList, 
  setChatRoomItem, 
  setChatList, 
  setUpdateChatList, 
  clearChat,
} from '@/store/chatRoomSlice';

export const updateMembersThunk = createAsyncThunk(
  'chatroom/updateMembersThunk',
  async (payload: { member: any; group: number }, { dispatch, getState }) => {
    dispatch(setMemberList(payload));
    return (getState() as { chatroom: any }).chatroom.members;
  }
);
