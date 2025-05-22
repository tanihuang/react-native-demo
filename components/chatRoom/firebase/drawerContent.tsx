import React, { useState, useEffect, forwardRef, useImperativeHandle, useMemo } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { toChatRoomName, toChatRoomListDate } from '@/utils/utils';
import { useSelector, useDispatch } from 'react-redux';
import {
  setChatRoomStatus,
  setChatRoomItem,
  clearChat,
} from '@/store/chatRoom/firebase/chatRoomSlice';

const DrawerContent = forwardRef((props: any, ref) => {
  const dispatch = useDispatch();
  const { navigation, chatRoomList, chatRoom, user, handleTabChange } = props;

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

  const handleOnPress = (params: any) => {
    navigation.navigate(params.chatRoomId);
    dispatch(setChatRoomItem(params));
    // navigation.navigate(params.chatRoomId, { chatRoomName: params.chatRoomName });
  };

  const renderItem = ({ item }: any) => {
    const { members, chatRoomName, group, lastMessage, lastMessageTimestamp } = item;
    const chatRoomTitle = toChatRoomName(members, user, chatRoomName, group);
    const isActive = chatRoom.chatRoomId === item.chatRoomId;

    return (
      <TouchableOpacity
        style={[styles.chatContainer, isActive && styles.isActive]}
        onPress={() => handleOnPress(item)}
      >
        <View style={styles.chatHeader}>
          <Text style={styles.chatCreatedBy}>{chatRoomTitle}</Text>
          <Text style={styles.chatTimestamp}>{lastMessageTimestamp}</Text>
        </View>
        <Text style={styles.chatContent}>{lastMessage}</Text>
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
    paddingVertical: 10,
    paddingHorizontal: 10,
    height: 66,
  },
  chatHeader: {
    flexDirection: "row",
    marginBottom: 5,
    verticalAlign: 'middle',
    justifyContent: 'space-between',
  },
  chatCreatedBy: {
    fontSize: 16,
  },
  chatTimestamp: { 
    fontSize: 12, 
    color: '#a0aeaf',
    marginLeft: 10,
  },
  chatContent: { 
    fontSize: 14, 
    color: "#333333",
    paddingVertical: 3,
  },
  isActive: {
    backgroundColor: '#eee',
  }
});