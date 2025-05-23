import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Pressable, FlatList, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import ChatRoomSearch from '@/components/chatRoom/socket/chatRoomSearch';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '@/store/authSlice';
import { clearSearch } from '@/store/chatRoom/socket/chatRoomSlice';
import { showAlert } from '@/components/dialog/AlertDialog';
import Ionicons from '@expo/vector-icons/Ionicons';
import { onValue, ref, remove } from 'firebase/database';
import { db } from '@/services/firebaseConfig';
import { Default } from '@/constants/ChatRoom';

export function Header({ navigation }: any) {
  const user = useSelector((state: any) => state.user);
  const router = useRouter();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    dispatch(clearUser());
    dispatch(clearSearch());
    setDropdowVisible(false);
    showAlert('Logout successful!');

    const privateRef = ref(db, Default.private.chatRoomPath);
    onValue(privateRef, (snapshot) => {
      const data = snapshot.val() || {};

      Object.entries(data).forEach(([roomId, room]: any) => {
        const members = room.members || [];
        const isInRoom = members.some((item: any) => item.uuid === user.uuid);
        
        if (isInRoom) {
          remove(ref(db, `${Default.private.chatRoomPath}/${roomId}`));
          remove(ref(db, `${Default.private.messagesPath}/${roomId}`));
        }
      });
    }, { onlyOnce: true });

    remove(ref(db, `users/${user.uuid}`));
    router.push("/");
  };
  const [dropdowVisible, setDropdowVisible] = useState(false);

  const renderFlatList: any[] = [ 
    { id: 'Exit', label: 'Exit', action: handleLogout },
  ];
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ChatRoom</Text>
      {/* <Text style={styles.title} onPress={() => router.push('/')}>ChatRoom</Text> */}
      {user.isLogged && (
        <>
          {user.role === 1 && <ChatRoomSearch />}
          <View style={styles.userContainer}>
            <TouchableOpacity 
              onPress={() => setDropdowVisible(!dropdowVisible)}
              activeOpacity={1}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <Text style={styles.user}>{user.username}</Text>
              <Ionicons
                name={dropdowVisible ? 'caret-up' : 'caret-down'}
                size={18}
                style={{ marginLeft: 5 }}
              />
            </TouchableOpacity>
            {/* <Text>{JSON.stringify(user)}</Text> */}
            {dropdowVisible && (
              <FlatList
                  data={renderFlatList}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity  style={styles.flatListItem} onPress={item.action}>
                      <Text>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                  style={styles.flatListContainer}
                  keyboardShouldPersistTaps="handled"
                />
            )}
          </View>
        </>
      )}
    </View>
  );
}

export default Header;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    minHeight: 50,
    zIndex: 9999,
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  userContainer: {
    position: 'relative',
  },
  user: {
    fontSize: 16,
    textAlign: 'center',
  },
  flatListContainer: {
    marginTop: 10,
    width: 200,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    maxHeight: 200,
    position: 'absolute',
    top: '100%',
    right: 0,
  },
  flatListItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: 'center'
  },
});
