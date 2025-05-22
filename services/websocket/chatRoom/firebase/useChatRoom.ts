import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ref, push, set, onValue, onDisconnect, onChildAdded } from 'firebase/database';
import { db } from '@/services/firebaseConfig';
import { updateMembersThunk } from '@/store/chatRoom/firebase/chatRoomThunk';
import { setChatRoomList, setChatList, setUpdateChatList } from '@/store/chatRoom/firebase/chatRoomSlice';

export default function useChatRoom() {
  const dispatch = useDispatch<any>();
  const user = useSelector((state: any) => state.user);
  const [onlineUser, setOnlineUser] = useState<any[]>([]);

  const PRIVATE_PATH = 'chatRooms/private';
  const PUBLIC_PATH = 'chatRooms/public';

  const getChatPath = (chatRoomId: string) =>
    chatRoomId === 'public'
      ? `messages/public`
      : `messages/private/${chatRoomId}`;

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
      setOnlineUser([...Object.values(data)]);
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
    const privateRef = ref(db, PRIVATE_PATH);
  
    onValue(privateRef, (snapshot) => {
      const data = snapshot.val() || {};
      const privateList = Object.values(data).filter((item: any) =>
        Array.isArray(item.members) &&
        item.members.some((m: any) => m.uuid === user.uuid)
      );
      dispatch(setChatRoomList(privateList));
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
  

  return {
    getOnlineUser,
    onlineUser,
    createChatRoom,
    getChatRoomList,
    createChat,
    getChat,
    subChat,
   };
}