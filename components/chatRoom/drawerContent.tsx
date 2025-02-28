import React, { useState, useEffect, forwardRef, useImperativeHandle, useMemo } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { toChatRoomName, toChatRoomListDate } from '@/utils/utils';

const DrawerContent = forwardRef((props: any, ref) => {
  const { navigation, chatRoomList, chatRoom, user } = props;

  useImperativeHandle(ref, () => ({
    handleOnPress,
  }));

  // const filteredChatRoomList = chatRoomList.filter((item: any) =>
  //   item.chatRoomName.toLowerCase().includes(searchText.toLowerCase())
  // );

  const renderFlatList = useMemo(() => {
    return chatRoomList.map((item: any) => {
      return {
        ...item,
        lastMessageTimestamp: toChatRoomListDate(item.lastMessageTimestamp),
      };
    });
  }, [chatRoomList]);

  const handleOnPress = (chatRoomId: string) => {
    navigation.navigate(chatRoomId);
    // navigation.navigate(item.chatRoomId, { chatRoomName: item.chatRoomName });
  };

  const renderItem = ({ item }: any) => {
    const { members, chatRoomName, groupType, lastMessage, lastMessageTimestamp } = item;
    const chatRoomTitle = toChatRoomName(members, user, chatRoomName, groupType);
    const isActive = chatRoom.chatRoomId === item.chatRoomId;

    return (
      <TouchableOpacity
        style={[styles.chatContainer, isActive && styles.isActive]}
        onPress={() => handleOnPress(item.chatRoomId)}
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
      {/* <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View> */}
      <Text style={styles.title} onPress={() => navigation.navigate('index')}>ChatRoom</Text>
      <FlatList
        // data={filteredChatRoomList}
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