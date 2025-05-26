import { createSlice } from '@reduxjs/toolkit';
import { toChatRoomDate } from "@/utils/utils";

const initialState = {
  onlineUser: [] as any,
  members: [] as { uuid: string; username: string }[],
  chatRoomStatus: 1, // 0 private, 1 public
  chatRoomList: [] as any,
  chatRoomItem: {
    chatRoomId: undefined as any,
  },
  chatList: {} as Record<string, any[]>,
  chatRoomUnread: [] as string[],
  chatUnread: 0,
};

const chatRoomSlice = createSlice({
  name: 'chatRoomFirebase',
  initialState,
  reducers: {
    setOnlineUser: (state, action) => {
      state.onlineUser = action.payload;
    },
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
      const initialState = {
        chatRoomId: 'public',
        chatRoomName: '大廳',
        group: 1,
      };
    
      const updatedData = action.payload.filter((item: any) => item.chatRoomId !== 'public');
      state.chatRoomList = [initialState, ...updatedData];
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
    setChatRoomUnread: (state, action) => {
      state.chatRoomUnread = action.payload;
    },
    removeChatRoomUnread: (state, action) => {
      state.chatRoomUnread = state.chatRoomUnread.filter((item: any) => item !== action.payload);
    },
    setChatUnread: (state, action) => {
      state.chatUnread = action.payload;
    },
    setInitial: () => initialState,
  },
});

export const {
  setOnlineUser,
  setMemberList,
  setChatRoomStatus,
  setChatRoomList,
  setChatRoomItem,
  setChatList,
  setUpdateChatList,
  setChatRoomUnread,
  removeChatRoomUnread,
  setChatUnread,
  setInitial,
} = chatRoomSlice.actions;
export default chatRoomSlice.reducer;
