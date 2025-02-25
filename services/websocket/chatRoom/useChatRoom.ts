import { useEffect, useState } from 'react';
import ChatRoomClient from './chatRoomClient';
import { useDispatch, useSelector } from 'react-redux';
import { updateMembersThunk } from '@/store/chatRoomThunk';

const useChatRoom = (eventHandlers: { [event: string]: (data: any) => void }) => {
  const [isConnected, setIsConnected] = useState(false);
  const user = useSelector((state: any) => state.user);
  const { searchList, members } = useSelector((state: any) => state.chatroom);
  const dispatch = useDispatch() as any;

  useEffect(() => {
    ChatRoomClient.connect();

    ChatRoomClient.on('connect', () => {
      setIsConnected(true);
    });

    ChatRoomClient.on("disconnect", (reason) => {
      setIsConnected(false);
    });

    Object.entries(eventHandlers).forEach(([event, handler]) => {
      ChatRoomClient.on(event, handler);
    });

    return () => {
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        ChatRoomClient.off(event, handler);
      });
      // ChatRoomClient.disconnect();
    };
  }, [eventHandlers]);

  const createChatRoom = async (params: any[], groupType: number) => {
    const updateMembers = await dispatch(
      updateMembersThunk({ member: params, groupType })
    ).unwrap();

    const newMembers = updateMembers.some((item: any) => item.uuid === user.uuid)
      ? updateMembers
      : [...updateMembers, { uuid: user.uuid, username: user.username }];

    const newChatRoom = {
      createdBy: user.uuid,
      chatRoomName: `${user.username}'s chatRoom`,
      members: newMembers,
      groupType,
    };

    ChatRoomClient.emit('createChatRoom', newChatRoom);
  };

  const getChatRoomList = (params: any) => {
    ChatRoomClient.emit('getChatRoomList', params);
  };

  const updateChatRoomList = (params: any) => {
    ChatRoomClient.emit('updateChatRoomList', params);
  };

  const createChat = (params: any) => {
    console.log('createChat', params);
    ChatRoomClient.emit('createChat', params);
  };

  const getChat = (params: any) => {
    ChatRoomClient.emit('getChat', params);
  };

  const updateChatList = (params: any) => {
    ChatRoomClient.emit('updateChatList', params);
  };

  return {
    isConnected,
    createChatRoom,
    getChatRoomList,
    updateChatRoomList,
    createChat,
    getChat,
    updateChatList,
  };
};

export default useChatRoom;
