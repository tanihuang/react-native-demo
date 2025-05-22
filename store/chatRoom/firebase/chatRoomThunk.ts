import { createAsyncThunk } from '@reduxjs/toolkit';
import { setMemberList } from '@/store/chatRoom/firebase/chatRoomSlice';

export const updateMembersThunk = createAsyncThunk(
  'chatroom/firebase/updateMembersThunk',
  async (payload: { member: any; group: number }, { dispatch, getState }) => {
    dispatch(setMemberList(payload));
    return (getState() as { chatRoomFirebase: any }).chatRoomFirebase.members;
  }
);
