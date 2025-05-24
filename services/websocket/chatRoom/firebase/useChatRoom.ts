import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ref, push, set, onValue, onDisconnect, onChildAdded, get, off } from 'firebase/database';
import { db } from '@/services/firebaseConfig';
import { updateMembersThunk } from '@/store/chatRoom/firebase/chatRoomThunk';
import { setOnlineUser, setChatRoomList, setChatList, setUpdateChatList } from '@/store/chatRoom/firebase/chatRoomSlice';
import { Default } from '@/constants/ChatRoom';

export default function useChatRoom() {
  const dispatch = useDispatch<any>();
  const user = useSelector((state: any) => state.user);

  const PRIVATE_PATH = 'chatRooms/private';
  const PUBLIC_PATH = 'chatRooms/public';

  const getChatPath = (chatRoomId: string) =>
    chatRoomId === 'public'
      ? Default.public.messagesPath
      : `${Default.private.messagesPath}/${chatRoomId}`;

  const getOnlineUser = (user: any) => {
    if (!user?.uuid) return;

    const userRef = ref(db, `users/${user.uuid}`);
    const userData = {
      uuid: user.uuid,
      username: user.username,
      timestamp: Date.now(),
    };

    set(userRef, userData);
    onDisconnect(userRef).remove();

    const onlineRef = ref(db, 'users');
    onValue(onlineRef, (snapshot) => {
      const data = snapshot.val() || {};
      setTimeout(() => {
        dispatch(setOnlineUser(Object.values(data)));
      }, 0);
    });
  };

  const createChatRoom = async (members: any[], group: number) => {
    const result = await dispatch(updateMembersThunk({ member: members, group })).unwrap();
  
    const allMembers = result.some((m: any) => m.uuid === user.uuid)
      ? result
      : [...result, { uuid: user.uuid, username: user.username }];
  
    const roomRef = push(ref(db, group === 0 ? PRIVATE_PATH : PUBLIC_PATH));
    
    const newRoom = {
      chatRoomId: roomRef.key,
      chatRoomName: roomRef.key,
      createdBy: user.uuid,
      group,
      members: group === 0 ? allMembers : undefined,
    };
  
    await set(roomRef, newRoom);
    return newRoom;
  };

  const getChatRoomList = () => {
    const roomRef = ref(db, Default.private.chatRoomPath);
    const msgRef = ref(db, Default.private.messagesPath);
  
    onValue(roomRef, async (snapshot) => {
      const rooms = Object.values(snapshot.val() || {}).filter((item: any) =>
        item.members?.some((m: any) => m.uuid === user.uuid)
      );
  
      const msgSnap = await get(msgRef);
      const msgData = msgSnap.val() || {};
  
      const result = rooms.map((item: any) => {
        const msgs = Object.values(msgData[item.chatRoomId] || {}).sort(
          (a: any, b: any) => b.timestamp - a.timestamp
        );
        const last = msgs[0] as { content?: string; timestamp?: number } || {};
        return { 
          ...item, 
          lastMessage: last.content || '', 
          lastMessageTimestamp: last.timestamp || 0 
        };
      });
  
      dispatch(setChatRoomList(result));
    });
  };
  
  const createChat = async (chatRoomId: string, content: string, user: any) => {
    if (!chatRoomId || !content || !user) return;
    const msgRef = ref(db, getChatPath(chatRoomId));
    await push(msgRef, {
      content,
      timestamp: Date.now(),
      user: {
        uuid: user.uuid,
        username: user.username,
      },
    });
  };
  
  const getChat = (chatRoomId: string) => {  
    const msgRef = ref(db, getChatPath(chatRoomId));
    onValue(msgRef, (snapshot) => {
      const messages = Object.values(snapshot.val() || {});
      dispatch(setChatList({ chatRoomId, messages }));
    });
  };
  
  const subChat = (chatRoomId: string) => {  
    const msgRef = ref(db, getChatPath(chatRoomId));
    onChildAdded(msgRef, (snapshot) => {
      const messages = Object.values(snapshot.val() || {});
      dispatch(setUpdateChatList({ chatRoomId, messages }));
    });
  };

  const clearListener = (chatRoomId: string) => {
    off(ref(db, Default.users.users));
    off(ref(db, Default.users.usersCanvas));
    off(ref(db, Default.public.messagesPath));
    off(ref(db, Default.private.chatRoomPath));
    off(ref(db, Default.private.messagesPath));
  };
  

  return {
    getOnlineUser,
    createChatRoom,
    getChatRoomList,
    createChat,
    getChat,
    subChat,
    clearListener,
   };
}