import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
setChatRoomStatus,
setChatRoomItem,
} from '@/store/chatRoom/firebase/chatRoomSlice';
import useChatRoom from '@/services/websocket/chatRoom/firebase/useChatRoom';
import { FontAwesome } from '@expo/vector-icons';

interface Props {
  user: { uuid: string };
  onlineUser: any[];
  onPress: (targetUser: any) => void;
}

export default function ChatRoomOnlineUser(props: any) {
  const { handleTogglePanel } = props
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const { chatRoomList, onlineUser } = useSelector((state: any) => state.chatRoomFirebase);
  const { createChatRoom, getChat, subChat } = useChatRoom();
  const [visible, setVisible] = useState(true);

  const handleOnPress = async (targetUser: any) => {
    dispatch(setChatRoomStatus(0));
    handleTogglePanel();

    const room = chatRoomList?.find((room: any) => {
      if (room.group !== 0 || !Array.isArray(room.members)) return false;
      const uuids = room.members.map((item: any) => item.uuid);
      return uuids.includes(user.uuid) && uuids.includes(targetUser.uuid);
    });

    const result = room || await createChatRoom([user, targetUser], 0);

    dispatch(setChatRoomItem(result));
    getChat(result.chatRoomId);
    subChat(result.chatRoomId);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setVisible(!visible)} activeOpacity={1}>
        <View style={styles.buttonContent}>
          <FontAwesome
            name={visible ? 'angle-up' : 'angle-down'} 
            size={24} 
            color="#fff" 
          />
          <Text style={styles.button}>在線用戶</Text>
          {(onlineUser.length - 1) > 0 && (
            <Text style={styles.number}>{onlineUser.length - 1}</Text>
          )}
        </View>
      </TouchableOpacity>

      {visible && (
        <View style={styles.onlineUserContainer}>
          <FlatList
            data={onlineUser.filter((item: any) => item.uuid !== user.uuid)}
            keyExtractor={(item) => item.uuid}
            ListEmptyComponent={<Text style={styles.noUser}>無其他在線用戶</Text>}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.item} onPress={() => handleOnPress(item)}>
                <Text style={styles.username}>{item.username}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  button: {
    color: '#fff',
    height: 64,
    fontSize: 18,
    alignItems: 'center',
    display: 'flex',
    marginLeft: 11,
  },
  number: {
    backgroundColor: 'rgba(84, 92, 143, 0.3)',
    borderRadius: 5,
    marginLeft: 11,
    color: '#fff',
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 6,
  },
  noUser: {
    textAlign: 'center',
    color: '#888',
    fontSize: 13,
  },
  onlineUserContainer: {
    paddingHorizontal: 16,
  },
  item: {
    color: '#fff',
    paddingVertical: 8,
    borderBottomWidth: 0,
  },
  username: {
    fontSize: 16,
    color: '#fff',
  },
});