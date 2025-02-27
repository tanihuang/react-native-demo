import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import ChatRoomList from './chatRoomList';
import { useSelector, useDispatch  } from 'react-redux';
import useChatRoom from '@/services/websocket/chatRoom/useChatRoom';
import { 
  setChatRoomList, 
  setUpdateChatRoomList, 
  setChatRoomItem, 
  setChatList, 
  setUpdateChatList, 
  clearChat,
} from '@/store/chatRoomSlice';

export default function ChatRoom(props: any) {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const { chatRoomList, chatRoomItem, chatList } = useSelector((state: any) => state.chatroom);
  const { connected, getChatRoomList, updateChatRoomList, getChat } = useChatRoom({
    getChatRoomList: (data) => {
      if (data && data.length) {
        dispatch(setChatRoomList(data));
      }
    },
    getChat: (data) => {
      dispatch(setChatList(data));
    },
    updateChatRoomList: (data) => {
      dispatch(setUpdateChatRoomList(data));
      handleTabChange(data);
    },
    updateChatList: (data) => {
      dispatch(setUpdateChatList(data));
      dispatch(setUpdateChatRoomList(data));
    },
    getError: (error) => {
      console.error('getError:', error);
    },
  });
  const chatRoomListRef = useRef<any>(null);

  useEffect(() => {
    if (user.isLoggedIn) {
      getChatRoomList(user.uuid);
    } else {
      dispatch(clearChat());
    }
  }, [connected, user.isLoggedIn]);

  useEffect(() => {
    if (!chatRoomList.length) {
      return;
    }
    if (!chatRoomItem.chatRoomId) {
      handleTabChange(chatRoomList[0]);
      return;
    }
    chatRoomListRef.current?.handleOnPress(chatRoomItem.chatRoomId);
  }, [chatRoomList.length]);

  const handleTabChange = async (params: any) => {
    dispatch(setChatRoomItem(params));
    getChat({ chatRoomId: params.chatRoomId });
  };

  return (
    <>
      <ChatRoomList
        ref={chatRoomListRef}
        user={user}
        chat={chatList}
        chatRoom={chatRoomItem}
        chatRoomList={chatRoomList}
        handleTabChange={handleTabChange}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    minHeight: 'auto',
  },
});

