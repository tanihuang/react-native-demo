import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
setChatRoomStatus,
setChatRoomItem,
clearChat,
} from '@/store/chatRoom/firebase/chatRoomSlice';
import useChatRoom from '@/services/websocket/chatRoom/firebase/useChatRoom';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  user: { uuid: string };
  onlineUser: any[];
  onPress: (targetUser: any) => void;
}

export default function ChatRoomOnlineUser() {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const { chatRoomStatus, chatRoomList, chatRoomItem, chatList } = useSelector((state: any) => state.chatRoomFirebase);
  const { getOnlineUser, onlineUser, createChatRoom, getChatRoomList, getChat, subChat } = useChatRoom();
  const chatRoomListRef = useRef<any>(null);
  const { chatRoomId } = chatRoomItem;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (user.isLogged) {
      getOnlineUser(user);
    }
  }, [user.isLogged]);


  const handleOnPress = async (targetUser: any) => {
    dispatch(setChatRoomStatus(0));

    const room = chatRoomList?.find((room: any) => {
      if (room.group !== 0 || !Array.isArray(room.members)) return false;
      const uuids = room.members.map((m: any) => m.uuid);
      return uuids.includes(user.uuid) && uuids.includes(targetUser.uuid);
    });

    const result = room || await createChatRoom([user, targetUser], 0);

    dispatch(setChatRoomItem(result));
    getChat(result.chatRoomId);
    subChat(result.chatRoomId);
};

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.toggleButton} 
        onPress={() => setVisible(!visible)}
        activeOpacity={1}
      >
        <Ionicons name="document-text-outline" size={24} color="white" />
      </TouchableOpacity>

      {visible && (
        <View style={styles.dropdown}>
          <FlatList
            data={onlineUser.filter((item) => item.uuid !== user.uuid)}
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
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 100,
    alignItems: 'flex-end',
  },
  toggleButton: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(0,0,0,1)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 6,
  },
  dropdown: {
    marginTop: 4,
    backgroundColor: '#fff',
    width: 180,
    maxHeight: 300,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  noUser: {
    textAlign: 'center',
    color: '#888',
    fontSize: 13,
  },
  item: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  username: {
    fontSize: 14,
    color: '#333',
  },
});