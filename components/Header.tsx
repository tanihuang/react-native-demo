import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Pressable, FlatList, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import ChatRoomSearch from '@/components/chatRoom/chatRoomSearch';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '@/store/authSlice';
import { clearSearch } from '@/store/chatRoomSlice';
import { showAlert } from '@/components/dialog/AlertDialog';

export function Header({ navigation }: any) {
  const user = useSelector((state: any) => state.user);
  const router = useRouter();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    dispatch(clearUser());
    dispatch(clearSearch());
    setDropdowVisible(false);
    showAlert('Logout successful!');
    router.push("/");
  };
  const [dropdowVisiblen, setDropdowVisible] = useState(false);

  const renderFlatList: any[] = [ 
    { id: 'Logout', label: 'Logout', action: handleLogout },
  ];
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ChatRoom</Text>
      {/* <Text style={styles.title} onPress={() => router.push('/')}>ChatRoom</Text> */}
      {user.isLoggedIn && (
        <>
          <ChatRoomSearch/>
          <View style={styles.userContainer}>
            <TouchableOpacity 
              onPress={() => setDropdowVisible(!dropdowVisiblen)}
              activeOpacity={1}
            >
              <Text style={styles.user}>{user.username}</Text>
            </TouchableOpacity>
            {/* <Text>{JSON.stringify(user)}</Text> */}
            {dropdowVisiblen && (
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
