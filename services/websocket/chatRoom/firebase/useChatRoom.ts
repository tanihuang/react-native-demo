import { useDispatch, useSelector } from 'react-redux';
import { ref, push, set, onValue, onDisconnect, onChildAdded, get, off, update, remove } from 'firebase/database';
import { db } from '@/services/firebaseConfig';
import { updateMembersThunk } from '@/store/chatRoom/firebase/chatRoomThunk';
import { 
  setOnlineUser, 
  setChatRoomList, 
  setChatList, 
  setUpdateChatList, 
  setChatUnread, 
  removeChatRoomUnread, 
  setInitial 
} from '@/store/chatRoom/firebase/chatRoomSlice';
import { Default } from '@/constants/ChatRoom';

export default function useChatRoom() {
  const dispatch = useDispatch<any>();
  const user = useSelector((state: any) => state.user);
  const { onlineUser, chatRoomList, chatRoomUnread } = useSelector((state: any) => state.chatRoomFirebase);

  const PRIVATE_PATH = 'chatRooms/private';
  const PUBLIC_PATH = 'chatRooms/public';

  const getPublicPath = {
    chatRoomId: 'public',
    chatRoomName: '大廳',
    group: 1,
  };

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
        dispatch(setOnlineUser(Object.values(data).filter((item: any) => item.uuid !== user.uuid)));
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
  
    onValue(roomRef, async (snapshot) => {
      const result = Object.values(snapshot.val() || {}).filter((item: any) =>
        item.members?.some((m: any) => m.uuid === user.uuid)
      );
      dispatch(setChatRoomList(result));
    });
  };
  
  const createChat = async (chatRoomId: string, content: string, group: number) => {
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
    const chatRoomRef = 
      group === 0 ? `${Default.private.chatRoomPath}/${chatRoomId}` : Default.public.chatRoomPath
    await update(ref(db, chatRoomRef), {
      lastMessage: content,
      lastMessageTimestamp: Date.now(),
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

  const subChatUnread = () => {  
    const unreadRef = ref(db, Default.users.usersUnread);
    onValue(unreadRef, (snap) => {
      const data = snap.val() || {};
      const getUnread = Object.entries(data).reduce((item: any, [roomId, roomData]: any) => {
        if (roomData[user.uuid] > 0) {
          item[roomId] = roomData[user.uuid];
        }
        return item;
      }, {});
      dispatch(setChatUnread(getUnread));
    });
  };

  const getChatUnread = async (chatRoomId: string, members: any[], group: number) => {
    if (group === 1) return;

    const updated: any = {};
    for (const item of members) {
      if (item.uuid !== user.uuid) {
        const path = `${Default.users.usersUnread}/${chatRoomId}/${item.uuid}`;
        const unreadRef = ref(db, path);
        const snap = await get(unreadRef);
        const current = snap.val() || 0;
        updated[path] = current + 1;
      }
    }
    await update(ref(db), updated);
  };

  const clearChatUnread = (chatRoomId: string) => {
    set(ref(db, `${Default.users.usersUnread}/${chatRoomId}/${user.uuid}`), 0);
  };

  const clearChatRoomUnread = (chatRoomId: string) => {
    if (chatRoomUnread.includes(chatRoomId)) {
      dispatch(removeChatRoomUnread(chatRoomId));
    }
  };

  const clearChatRoomPublic = () => {
    const now = Date.now();
    onValue(ref(db, Default.public.messagesPath), (snap) => {
      Object.entries(snap.val() || {}).forEach(([id, msg]: any) => {
        if (msg.timestamp < now - 60 * 60 * 1000) {
          remove(ref(db, `${Default.public.messagesPath}/${id}`));
        }
      });
    }, { onlyOnce: true });
  };

  const clearChatRoomPrivate = async () => {
    const removals: Promise<any>[] = [];
    const onlineSet = new Set(onlineUser.map((item: any) => item.uuid));
  
    chatRoomList
      .filter((room: any) => room.group === 0)
      .forEach((room: any) => {
        const offline = room.members.every((item: any) => !onlineSet.has(item.uuid));
        if (offline) {
          removals.push(
            remove(ref(db, `${Default.private.chatRoomPath}/${room.chatRoomId}`)),
            remove(ref(db, `${Default.private.messagesPath}/${room.chatRoomId}`)),
            remove(ref(db, `${Default.users.usersUnread}/${room.chatRoomId}`))
          );
        }
      });
    removals.push(
      remove(ref(db, `${Default.users.users}/${user.uuid}`)),
      remove(ref(db, `${Default.users.usersCanvas}/${user.uuid}`))
    );
  
    await Promise.all(removals);
  };

  const clearListener = () => {
    off(ref(db, Default.users.users));
    off(ref(db, Default.users.usersCanvas));
    off(ref(db, Default.users.usersUnread));
    off(ref(db, Default.public.messagesPath));
    off(ref(db, Default.private.chatRoomPath));
    off(ref(db, Default.private.messagesPath));
  };

  return {
    getPublicPath,
    getOnlineUser,
    createChatRoom,
    getChatRoomList,
    createChat,
    getChat,
    subChat,
    getChatUnread,
    subChatUnread,
    clearChatUnread,
    clearChatRoomUnread,
    clearChatRoomPublic,
    clearChatRoomPrivate,
    clearListener,
   };
}