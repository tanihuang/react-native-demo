import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import ChatRoomList from './chatRoomList';
import ChatRoomInput from './chatRoomInput';
import useChatRoom from '@/services/websocket/chatRoom/firebase/useChatRoom';
import { ref, remove, onValue, off } from 'firebase/database';
import { db } from '@/services/firebaseConfig';
import {
  setChatRoomStatus,
  setChatRoomItem,
  clearChat,
} from '@/store/chatRoom/firebase/chatRoomSlice';
import ChatRoomSlide from './chatRoomSlide';
import { Default } from '@/constants/ChatRoom';

const PUBLIC_ROOM = {
  chatRoomId: 'public',
  chatRoomName: '大廳',
  group: 1,
};

export default function ChatRoom() {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const { onlineUser, chatRoomList, chatRoomItem, chatList } = useSelector((state: any) => state.chatRoomFirebase);
  const { getOnlineUser, getChatRoomList, getChat, subChat, clearListener } = useChatRoom();
  const chatRoomListRef = useRef<any>(null);
  const { chatRoomId } = chatRoomItem;

  useEffect(() => {
    const publicRef = ref(db, Default.public.messagesPath);

    if (user.isLogged) {
      getOnlineUser(user);
      getChatRoomList();

      const now = Date.now();

      onValue(publicRef, (snap) => {
        Object.entries(snap.val() || {}).forEach(([id, msg]: any) => {
          if (msg.timestamp < now - 60 * 60 * 1000) {
            remove(ref(db, `${Default.public.messagesPath}/${id}`));
          }
        });
      }, { onlyOnce: true });
    } else {
      const onlineSet = new Set(onlineUser.map((item: any) => item.uuid));
      chatRoomList
        .filter((room: any) => room.group === 0)
        .forEach((room: any) => {
          const offline = room.members.every((item: any) => !onlineSet.has(item.uuid));
          if(offline) {
            remove(ref(db, `${Default.private.chatRoomPath}/${room.chatRoomId}`));
            remove(ref(db, `${Default.private.messagesPath}/${room.chatRoomId}`));
          }
        });
      dispatch(clearChat());
    }
    return () => {
      clearListener(chatRoomId);
    };
  }, [user.isLogged]);

  useEffect(() => {
    const now = Date.now();
    const msgRef = ref(db, 'message');
    onValue(msgRef, (snapshot) => {
      const all = snapshot.val() || {};
      Object.entries(all).forEach(([roomId, messages]: any) => {
        Object.entries(messages).forEach(([msgId, msg]: any) => {
          if (msg.timestamp && now - msg.timestamp > 3600000) {
            remove(ref(db, `message/${roomId}/${msgId}`));
          }
        });
      });
    });
    getChat(PUBLIC_ROOM.chatRoomId);
    subChat(PUBLIC_ROOM.chatRoomId);
  }, []);

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
        chat={chatList[PUBLIC_ROOM.chatRoomId] || []}
        chatRoom={chatRoomItem}
      >
        <ChatRoomList
          ref={chatRoomListRef}
          user={user}
          chat={chatList[chatRoomId]}
          chatRoom={chatRoomItem}
          chatRoomList={chatRoomList}
          handleTabChange={(params: any) => {
            dispatch(setChatRoomItem(params));
            getChat(params.chatRoomId);
            subChat(params.chatRoomId);
          }}
        />
        <ChatRoomInput chatRoomId={chatRoomId} user={user} />
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
