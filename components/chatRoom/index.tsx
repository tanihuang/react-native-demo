import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import ChatRoomList from './chatRoomList';
import { useSelector, useDispatch  } from 'react-redux';
import useChatRoom from '@/services/websocket/chatRoom/useChatRoom';
import { toChatRoomScreenDate } from "@/utils/utils";
import { navigationRef } from "@/constants/Ref";

export default function ChatRoom(props: any) {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const [chatRoomList, setChatRoomList] = useState<any[]>([]);
  const [chatRoom, setChatRoom] = useState<any>({
    chatRoomId: undefined,
  });
  const [chat, setChat] = useState<any[]>([]);
  const [updateChatRoomList, setUpdateChatRoomList] = useState<any>();

  const { isConnected, getChatRoom, getChat } = useChatRoom({
    getChatRoom: (data) => {
      if (data && data.length) {
        setChatRoomList(data);
      }
    },
    getChat: (data) => {
      setChat((prev: any) => ({
        ...prev,
        [chatRoom.chatRoomId]: toChatRoomScreenDate(data),
      }));
    },
    updateChatRoomList: (data) => {
      const { chatRoomId } = data;
      setChatRoomList((prev: any) => [...prev, data]);
      setUpdateChatRoomList(chatRoomId);
    },
    updateChat: (data) => {
      handleCreateChat(data);
    },
    getError: (error) => {
      console.error('getError:', error);
    },
  });

  useEffect(() => {
    const initialRequestParam = async () => {
      if (user.isLoggedIn) {
        await getChatRoom(user.uuid);
      }
    };
    initialRequestParam();
  }, [isConnected, user]);

  useEffect(() => {
    if (!chatRoom.chatRoomId && chatRoomList && chatRoomList.length) {
      handleTabChange(chatRoomList[0]);
    }
    if (updateChatRoomList) {
      handleUpdateChatRoomList(updateChatRoomList);
    }
  }, [chatRoomList]);

  const handleTabChange = async (params: any) => {
    setChatRoom(params);
    getChat({ chatRoomId: params.chatRoomId });
  };

  const handleCreateChat = (params: any) => {
    const { createdBy, content } = params;
    setChat((prev) => ({
      ...prev,
      [chatRoom.chatRoomId]: [
        ...prev[chatRoom.chatRoomId]?.filter((date: any) => date.title !== "Today") || [],
        {
          title: "Today",
          data: [...(prev[chatRoom.chatRoomId]?.find((item: any) => item.title === "Today")?.data || []), params],
        },
      ],
    }));

    setChatRoomList((prev) =>
      prev.map((item) =>
        item.chatRoomId === chatRoom.chatRoomId
          ? {
              ...item,
              lastMessageSender: createdBy,
              lastMessage: content,
              lastMessageTimestamp: Date.now(),
            }
          : item
      )
    );
  };

  const handleUpdateChatRoomList = async (params: any) => {
    if (navigationRef.isReady()) {
      navigationRef.navigate(params);
    }
    setUpdateChatRoomList(undefined);
  };

  return (
    <>
      <ChatRoomList
        user={user}
        chat={chat}
        chatRoom={chatRoom}
        chatRoomList={chatRoomList}
        handleTabChange={handleTabChange}
        handleCreateChat={handleCreateChat}
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

