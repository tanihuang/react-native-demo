import { createSlice } from '@reduxjs/toolkit';
import { toRemoveUser } from '@/utils/utils';

const chatRoomSlice = createSlice({
  name: 'chatroom',
  initialState: {
    searchVisible: false,
    searchItem: {},
    searchResult: [] as { uuid: string; username: string }[],
    members: [] as { uuid: string; username: string }[],
  },
  reducers: {
    setSearchVisible: (state, action) => {
      state.searchVisible = action.payload;
    },
    setSearchItem: (state, action: any) => {
      const { uuid, username } = action.payload;
      state.searchItem = { uuid, username };
    },
    setSearchResult: (state, action: { payload: { data: any[]; user?: any } }) => {
      const { data, user } = action.payload;
      if (user) {
        state.searchResult = toRemoveUser(data, user);
      } else {
        state.searchResult = data;
      }
    },
    clearSearch: (state) => {
      state.searchItem = {};
      state.searchResult = [];
      state.searchVisible = false; 
    },
    setMember: (
      state, 
      action: { payload: { member: any, groupType: number }}
    ) => {
      const { member, groupType } = action.payload;
      if (!Array.isArray(state.members)) {
        state.members = [];
      }
      if (groupType === 0) {
        state.members = [{
          uuid: member.uuid,
          username: member.username,
        }];
      } else {
        const exists = state.members.some((item: any) => item.uuid === member.uuid);
        if (!exists) {
          state.members.push({
            uuid: member.uuid,
            username: member.username,
          });
        }
      }
    },
    setMemberState(state, action: any) {
      state.members = action.payload; // Update state.members directly
    },
  },
});

export const {
  setSearchVisible,
  setSearchItem, 
  setSearchResult, 
  clearSearch,
  setMember,
} = chatRoomSlice.actions;
export default chatRoomSlice.reducer;
