import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import ChatRoomList from './chatRoomList';
import ChatRoomInput from './chatRoomInput';
import useChatRoom from '@/services/websocket/chatRoom/firebase/useChatRoom';
import { ref, remove, onValue, off } from 'firebase/database';
import { db } from '@/services/firebaseConfig';
import { setChatRoomItem, setInitial } from '@/store/chatRoom/firebase/chatRoomSlice';
import { setUser, clearUser } from '@/store/authSlice';
import ChatRoomSlide from './chatRoomSlide';
import { Default } from '@/constants/ChatRoom';

export default function ChatRoom() {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const { onlineUser, chatRoomItem, chatList, chatRoomList } = useSelector((state: any) => state.chatRoomFirebase);
  const { 
    getPublicPath, 
    getOnlineUser, 
    getChatRoomList, 
    getChat, 
    subChat, 
    subChatUnread,
    clearChatRoomPublic,
    clearChatRoomPrivate,
    clearListener
  } = useChatRoom();
  const chatRoomListRef = useRef<any>(null);

  useEffect(() => {
    if (user.isLogged) {
      getOnlineUser(user);
      getChatRoomList();
      clearChatRoomPublic();
      subChatUnread();
      getChat(getPublicPath.chatRoomId);
      subChat(getPublicPath.chatRoomId);
    }

    return () => {
      clearChatRoomPrivate();
      clearListener();
      dispatch(setInitial());
    };
  }, [user.isLogged]);

  useEffect(() => {
    if (!chatRoomItem?.chatRoomId && chatRoomList[0]) {
      const room = chatRoomList[0];
      dispatch(setChatRoomItem(room));
      getChat(room.chatRoomId);
      subChat(room.chatRoomId);
    }
  }, [chatRoomItem, chatRoomList]);  

  return (
    <View style={styles.container}>
      <ChatRoomSlide
        user={user}
        chat={chatList[getPublicPath.chatRoomId]}
        chatRoomList={chatRoomList}
      >
        <ChatRoomList
          ref={chatRoomListRef}
          user={user}
          chatRoom={chatRoomItem}
          chatRoomList={chatRoomList}
          handleTabChange={(params: any) => {
            dispatch(setChatRoomItem(params));
            getChat(params.chatRoomId);
            subChat(params.chatRoomId);
          }}
        />
        <ChatRoomInput user={user} chatRoomItem={chatRoomItem} />
      </ChatRoomSlide>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  username: {
    fontSize: 16,
  },
  toggleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});
