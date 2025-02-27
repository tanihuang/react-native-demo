import { createSlice } from '@reduxjs/toolkit';
import { toRemoveUser } from '@/utils/utils';
import { toChatRoomDate } from "@/utils/utils";

const chatRoomSlice = createSlice({
  name: 'chatroom',
  initialState: {
    searchVisible: false,
    searchList: [] as { uuid: string; username: string }[],
    searchItem: {},
    members: [] as { uuid: string; username: string }[],
    chatRoomList: [] as any,
    chatRoomItem: {
      chatRoomId: undefined as any,
    },
    chatList: {} as Record<string, any[]>,
  },
  reducers: {
    setSearchVisible: (state, action) => {
      state.searchVisible = action.payload;
    },
    setSearchList: (state, action: { payload: { data: any[]; user?: any } }) => {
      const { data, user } = action.payload;
      if (user) {
        state.searchList = toRemoveUser(data, user);
      } else {
        state.searchList = data;
      }
    },
    setSearchItem: (state, action: any) => {
      const { uuid, username } = action.payload;
      state.searchItem = { uuid, username };
    },
    clearSearch: (state) => {
      state.searchItem = {};
      state.searchList = [];
      state.searchVisible = false; 
    },
    setMemberList: (
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
    setChatRoomList: (state, action) => {
      state.chatRoomList = [
        ...state.chatRoomList.filter(({ chatRoomId }: any) =>
          !action.payload.some((item: any) => item.chatRoomId === chatRoomId)
        ),
        ...action.payload,
      ];
    },
    setUpdateChatRoomList: (state, action) => {
      const { chatRoomId, content, createdBy, timestamp } = action.payload;
      const chatRoomIndex = state.chatRoomList.findIndex((item: any) => item.chatRoomId === chatRoomId);
      if (chatRoomIndex !== -1) {
        state.chatRoomList[chatRoomIndex] = {
          ...state.chatRoomList[chatRoomIndex],
          lastMessage: content,
          lastMessageSender: createdBy,
          lastMessageTimestamp: timestamp,
        };
      } else {
        state.chatRoomList = [
          ...state.chatRoomList,
          action.payload,
        ];
      }
    },
    setChatRoomItem: (state, action) => {
      state.chatRoomItem = action.payload;
    },
    setChatList: (state, action) => {
      const { chatRoomItem } = state;
      state.chatList = { 
        ...state.chatList,
        [chatRoomItem.chatRoomId]: action.payload.map((item: any) => ({
          ...item,
          title: toChatRoomDate(item._id)
        })),
      };
    },
    setUpdateChatList: (state, action) => {
      const chatRoomId = state.chatRoomItem?.chatRoomId;
      if (!chatRoomId) return;
  
      const chatData = state.chatList[chatRoomId];
      if (!chatData) return;
  
      let todayChat = chatData.find(chat => chat.title === "Today");
  
      todayChat 
          ? todayChat.messages.push(action.payload) 
          : chatData.push({ title: "Today", messages: [action.payload], _id: Date.now() });

      state.chatList[chatRoomId] = [...chatData];
    },
    clearChat: (state) => {
      state.chatRoomList = [];
      state.chatRoomItem = {
        chatRoomId: undefined,
      };
      state.chatList = {};
    },
  },
});

export const {
  setSearchVisible, 
  setSearchList,
  setSearchItem,
  clearSearch,
  setMemberList,
  setChatRoomList,
  setUpdateChatRoomList,
  setChatRoomItem,
  setChatList,
  setUpdateChatList,
  clearChat,
} = chatRoomSlice.actions;
export default chatRoomSlice.reducer;
