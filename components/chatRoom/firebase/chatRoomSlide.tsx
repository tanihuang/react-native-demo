import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, StyleSheet, TouchableOpacity, Animated, Dimensions, Platform } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import ChatRoomOnlineUser from './chatRoomOnlineUser';
import ChatRoomCanvas from './chatRoomCanvas';
import { setChatRoomUnread } from '@/store/chatRoom/firebase/chatRoomSlice';
import useChatRoom from '@/services/websocket/chatRoom/firebase/useChatRoom';

const screenWidth = Dimensions.get('window').width;

export default function ChatRoomSlide( props: any) {
  const dispatch = useDispatch();
  const { user, chat, chatRoomList, children } = props;
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [prevChatRoomList, setPrevChatRoomList] = useState<any[]>([]);
  const translateX = useState(new Animated.Value(screenWidth))[0];
  const { onlineUser, chatRoomItem, chatRoomUnread } = useSelector((state: any) => state.chatRoomFirebase);
    const { getChat, subChat, clearChatUnread, clearChatRoomUnread } = useChatRoom();

  useEffect(() => {
    const getChatRoomUnread = chatRoomList
      .filter((item: any) => {
        if (item.chatRoomId === 'public') return false;
        const prev = prevChatRoomList.find((room: any) => room.chatRoomId === item.chatRoomId);
        return !prev || item.lastMessageTimestamp !== prev.lastMessageTimestamp;
      })
      .map((item: any) => item.chatRoomId)
      .filter((id: string) => id !== chatRoomItem.chatRoomId);

    if (getChatRoomUnread.length > 0) {
      dispatch(setChatRoomUnread(getChatRoomUnread));
    }
    clearChatUnread(chatRoomItem.chatRoomId);
    setPrevChatRoomList(chatRoomList);
  }, [chatRoomList]);

  useEffect(() => {
    if (!chatRoomList?.length) return;
    chatRoomList.forEach((item: any) => {
      subChat(item.chatRoomId);
    });
  }, [chatRoomList.length]);

  const handleOnPress = async (param: string) => {
    const isActive = activeKey === param;
    return new Promise((resolve) => {
      Animated.timing(translateX, {
        toValue: isActive ? screenWidth : 0,
        duration: 300,
        useNativeDriver: Platform.OS !== 'web',
      }).start(() => {
        setActiveKey(isActive ? null : param);
        resolve(true);
      });
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
      <View style={[styles.canvasWrapper, activeKey ? { marginRight: 2.5 } : null]}>
        <ChatRoomCanvas user={user} chat={chat || []} />
      </View>
        <Animated.View 
          style={[
            styles.animatedWrapper,
            activeKey ? { marginLeft: 2.5, width: 350 } : { width: 0 },
            { transform: [{ translateX }] }
          ]}
        >
          <View style={styles.borderContainer}>
            {activeKey === 'user' && <ChatRoomOnlineUser handleTogglePanel={() => handleOnPress('chat')}/>}
            {activeKey === 'chat' && children}
          </View>
        </Animated.View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          activeOpacity={1}
          onPress={() => handleOnPress('chat')}
          style={[
            styles.button,
            activeKey === 'chat' && styles.buttonActive,
          ]}
        >
          <Ionicons name="chatbox-ellipses" size={15} color="#fff" />
          {chatRoomUnread.length > 0 && (
            <View style={styles.buttonUnread} />
          )}
        </TouchableOpacity>
        <TouchableOpacity 
          activeOpacity={1}
          onPress={() => handleOnPress('user')}
          style={[
            styles.button,
            activeKey === 'user' && styles.buttonActive,
          ]}
        >
          <FontAwesome5 name="user-friends" size={14} color="white" />
          {onlineUser.length > 0 && (
            <View style={styles.buttonOnline} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgb(32, 37, 64)',
    paddingHorizontal: 5,
  },
  topContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 10,
    zIndex: 999,
  },
  button: {
    borderRadius: 8,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2.5,
    position: 'relative',
  },
  buttonActive: {
    backgroundColor: 'rgb(84, 92, 143)',
  },
  buttonUnread: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: 4,
    backgroundColor: 'red',
  },
  buttonOnline: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: 4,
    backgroundColor: 'rgb(6, 214, 160)',
  },
  canvasWrapper: {
    flex: 1,
  },
  animatedWrapper: {
    width: 350,
  },
  borderContainer: {
    flex: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
  },
});
