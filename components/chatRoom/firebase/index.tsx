import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import ChatRoomList from './chatRoomList';
import ChatRoomInput from './chatRoomInput';
import useChatRoom from '@/services/websocket/chatRoom/firebase/useChatRoom';
import { ref, remove, onValue } from 'firebase/database';
import { db } from '@/services/firebaseConfig';
import {
  setChatRoomStatus,
  setChatRoomItem,
  clearChat,
} from '@/store/chatRoom/firebase/chatRoomSlice';
import ChatRoomScreen from './chatRoomScreen';
import ChatRoomOnlineUser from './chatRoomOnlineUser';
import Ionicons from '@expo/vector-icons/Ionicons';
import ChatRoomSlidePanel from './chatRoomSlidePanel';
import { Default } from '@/constants/ChatRoom';

const PUBLIC_ROOM = {
  chatRoomId: 'public',
  chatRoomName: '大廳',
  group: 1,
};

export default function ChatRoom() {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const { chatRoomList, chatRoomItem, chatList } = useSelector((state: any) => state.chatRoomFirebase);
  const { getOnlineUser, getChatRoomList, getChat, subChat } = useChatRoom();
  const chatRoomListRef = useRef<any>(null);
  const { chatRoomId } = chatRoomItem;

  useEffect(() => {
    if (user.isLogged) {
      getOnlineUser(user);
      getChatRoomList();

      const now = Date.now();
      onValue(ref(db, Default.public.messagesPath), (snap) => {
        Object.entries(snap.val() || {}).forEach(([id, msg]: any) => {
          if (msg.timestamp < now) {
            remove(ref(db, `${Default.public.messagesPath}/${id}`));
          }
        });
      }, { onlyOnce: true });
    } else {
      chatRoomList.forEach((item: any) => {
        if (item.members?.[user.uuid]) {
          remove(ref(db, `${Default.private.chatRoomPath}/${item.chatRoomId}`));
          remove(ref(db, `${Default.private.messagesPath}/${item.chatRoomId}`));
        }
      });
      dispatch(clearChat());
    }
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
      <View style={styles.chatRoomContainer}>
        <ChatRoomScreen 
          user={user}
          chat={chatList[PUBLIC_ROOM.chatRoomId] || []}
          variant="public"
        />
        <ChatRoomSlidePanel>
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
        </ChatRoomSlidePanel>
      </View>
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
  chatRoomContainer: {
    flex: 1,
  },
  toggleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});
