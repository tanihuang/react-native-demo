import { createSlice } from '@reduxjs/toolkit';
import { toChatRoomDate } from "@/utils/utils";

const chatRoomSlice = createSlice({
  name: 'chatRoomFirebase',
  initialState: {
    members: [] as { uuid: string; username: string }[],
    chatRoomStatus: 1, // 0 private, 1 public
    chatRoomList: [],
    chatRoomItem: {
      chatRoomId: undefined as any,
    },
    chatList: {} as Record<string, any[]>,
  },
  reducers: {
    setMemberList: (
      state, 
      action: { payload: { member: any, group: number }}
    ) => {
      const { member } = action.payload;
      state.members = member;
    },
    setChatRoomStatus: (state, action) => {
      state.chatRoomStatus = action.payload;
    },
    setChatRoomList: (state, action) => {
      state.chatRoomList = action.payload;
    },
    setChatRoomItem: (state, action) => {
      state.chatRoomItem = action.payload;
    },
    setChatList: (state, action) => {
      const { chatRoomId, messages } = action.payload;
      state.chatList = {
        ...state.chatList,
        [chatRoomId]: messages.filter(Boolean),
      };
    },    
    setUpdateChatList: (state, action) => {
      const { chatRoomId, messages } = action.payload;
      const existing = state.chatList[chatRoomId] || [];
      state.chatList = {
        ...state.chatList,
        [chatRoomId]: [...existing, messages.filter(Boolean)],
      };
    },
    clearChat: (state) => {
      state.members = [];
      state.chatRoomStatus = 1;
      state.chatRoomList = [];
      state.chatRoomItem = {
        chatRoomId: undefined,
      };
      state.chatList = {};
    },
  },
});

export const {
  setMemberList,
  setChatRoomStatus,
  setChatRoomList,
  setChatRoomItem,
  setChatList,
  setUpdateChatList,
  clearChat,
} = chatRoomSlice.actions;
export default chatRoomSlice.reducer;
