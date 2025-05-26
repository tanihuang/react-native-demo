import React, { useState, useEffect, forwardRef, useImperativeHandle, useMemo } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { toChatRoomName, toChatRoomListDate } from '@/utils/utils';
import { useSelector, useDispatch } from 'react-redux';
import { setChatRoomItem, removeChatRoomUnread } from '@/store/chatRoom/firebase/chatRoomSlice';
import useChatRoom from '@/services/websocket/chatRoom/firebase/useChatRoom';

const DrawerContent = forwardRef((props: any, ref) => {
  const dispatch = useDispatch();
  const { chatRoomUnread, chatUnread } = useSelector((state: any) => state.chatRoomFirebase);
  const { navigation, user, chatRoom, chatRoomList } = props;
  const { getChat, clearChatUnread, clearChatRoomUnread } = useChatRoom();

  useImperativeHandle(ref, () => ({
    handleOnPress,
  }));

  const renderFlatList = useMemo(() => {
    return chatRoomList.map((item: any) => {
      return {
        ...item,
        lastMessageTimestamp: toChatRoomListDate(item.lastMessageTimestamp),
      };
    });
  }, [chatRoomList]);

  const handleOnPress = (param: any) => {
    navigation.navigate(param.chatRoomId);
    dispatch(setChatRoomItem(param));
    getChat(param.chatRoomId);
    // navigation.navigate(params.chatRoomId, { chatRoomName: params.chatRoomName });

    clearChatRoomUnread(param.chatRoomId);
    clearChatUnread(param.chatRoomId);
  };

  const renderItem = ({ item }: any) => {
    const { members, chatRoomName, group, lastMessage, lastMessageTimestamp } = item;
    const isActive = chatRoom.chatRoomId === item.chatRoomId;

    if (group === 1) {
      return (
        <TouchableOpacity
          style={[styles.chatContainer, isActive && styles.isActive]}
          onPress={() => handleOnPress(item)}
        >
          <Text style={styles.chatName}>{toChatRoomName(members, user, chatRoomName, group)}</Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        style={[styles.chatContainer, isActive && styles.isActive]}
        onPress={() => handleOnPress(item)}
      >
        <Text style={styles.chatName}>{toChatRoomName(members, user, chatRoomName, group)}</Text>
        <View style={styles.chatInfo}>
          <Text style={styles.chatContent}>{lastMessage}</Text>
          <Text style={styles.chatTimestamp}>{lastMessageTimestamp}</Text>
        </View>
        {chatUnread[item.chatRoomId] > 0 && (
          <View style={styles.chatUnread}>
            <Text style={styles.chatUnreadText}>{chatUnread[item.chatRoomId]}</Text>
          </View>
        )}
      </TouchableOpacity>
    )
  };

  return (
    <DrawerContentScrollView 
      {...props} 
      contentContainerStyle={{ padding: 0 }}
    >
      <FlatList
        data={renderFlatList}
        keyExtractor={(item) => item.chatRoomId.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.chatList}
      />
    </DrawerContentScrollView>
  );
});

export default DrawerContent;

const styles = StyleSheet.create({
  searchContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  title: {
    fontSize: 16,
    textAlign: 'left',
    fontWeight: 'bold',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  chatList: {
    padding: 0,
  },
  chatContainer: {
    padding: 10,
    paddingHorizontal: 8,
    marginHorizontal: 8,
    height: 66,
    borderRadius: 16,
    justifyContent: 'center',
    position: 'relative',
  },
  chatInfo: {
    flexDirection: "row",
    verticalAlign: 'middle',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  chatName: {
    fontSize: 16,
    color: '#fff',
  },
  chatTimestamp: { 
    fontSize: 12, 
    color: '#fff',
    marginLeft: 10,
  },
  chatContent: { 
    fontSize: 14, 
    color: "#fff",
    paddingVertical: 3,
  },
  chatUnread: {
    position: 'absolute',
    top: 11.5,
    right: 10,
    width: 15,
    height: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    borderRadius: 10,
  },
  chatUnreadText: {
    color: '#fff',
    fontSize: 8,
  },
  isActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  }, 
});