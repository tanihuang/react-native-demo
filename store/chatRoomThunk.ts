import { createAsyncThunk } from '@reduxjs/toolkit';
import { setMember } from '@/store/chatRoomSlice';

export const updateMembersThunk = createAsyncThunk(
  'chatroom/updateMembersThunk',
  async (payload: { member: any; groupType: number }, { dispatch, getState }) => {
    dispatch(setMember(payload));
    return (getState() as { chatroom: any }).chatroom.members;
  }
);

