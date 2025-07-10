import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
setChatRoomStatus,
setChatRoomItem,
} from '@/store/chatRoom/firebase/chatRoomSlice';
import useChatRoom from '@/services/websocket/chatRoom/firebase/useChatRoom';
import { FontAwesome } from '@expo/vector-icons';
import store from '@/store';
import { drawerContentRef } from '@/constants/Ref';

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
  const { createChatRoom, getChatRoomList, getChat, subChat } = useChatRoom();
  const [visible, setVisible] = useState(true);

  const handleOnPress = async (param: any) => {
    dispatch(setChatRoomStatus(0));
  
    const { chatRoomList } = store.getState().chatRoomFirebase;
  
    let room = chatRoomList.find((item: any) =>
      item.group === 0 &&
      Array.isArray(item.members) &&
      item.members.some((m: any) => m.uuid === user.uuid) &&
      item.members.some((m: any) => m.uuid === param.uuid)
    );
  
    if (!room) {
      room = await createChatRoom([user, param], 0);
      await getChatRoomList();
    }
  
    await handleTogglePanel?.('chat');
    requestAnimationFrame(() => {
      drawerContentRef.current?.handleOnPress(room);
    });
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
            data={onlineUser}
            keyExtractor={(item) => item.uuid}
            ListEmptyComponent={<Text style={styles.noUser}>無其他在線用戶</Text>}
            renderItem={({ item }) => {
              const isSelf = item.uuid === user.uuid;
              return (
                <TouchableOpacity
                  onPress={() => !isSelf && handleOnPress(item)}
                  disabled={isSelf}
                >
                  <View style={styles.userRow}>
                    <View style={styles.greenDot} />
                    <Text style={styles.username}>{item.username}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
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
    fontWeight: 'bold',
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
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
});