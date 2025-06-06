import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Pressable, FlatList, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import ChatRoomSearch from '@/components/chatRoom/socket/chatRoomSearch';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '@/store/authSlice';
import { clearSearch } from '@/store/chatRoom/socket/chatRoomSlice';
import { showAlert } from '@/components/dialog/AlertDialog';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { onValue, ref, remove } from 'firebase/database';
import { db } from '@/services/firebaseConfig';
import { Default } from '@/constants/ChatRoom';

export function Header({ navigation }: any) {
  const user = useSelector((state: any) => state.user);
  const router = useRouter();
  const dispatch = useDispatch();
  const [dropdowVisible, setDropdowVisible] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      dispatch(clearUser());
      dispatch(clearSearch());
      setDropdowVisible(false);
      router.push("/");
    }, 60 * 60 * 1000);
  };
 
  useEffect(() => {
    resetTimer();
  
    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    const handleActivity = (e: Event) => resetTimer();
  
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });
  
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const handleLogout = async () => {
    dispatch(clearUser());
    dispatch(clearSearch());
    setDropdowVisible(false);

    showAlert('Logout successful!');
    router.push("/");
  
  };

  const renderFlatList: any[] = [ 
    { id: 'Exit', label: 'Exit', action: handleLogout },
  ];

  return (
    <View
      style={[
        styles.container,
        user.isLogged && { backgroundColor: 'rgb(32, 37, 64)' }
      ]}
    >
      <Text style={[
        styles.title,
        user.isLogged && { color: '#fff' }
      ]}>ChatRoom</Text>
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
              <Text style={[
                styles.user,
                user.isLogged && { color: '#fff' }
              ]}>{user.username}</Text>
              <FontAwesome
                name={dropdowVisible ? 'angle-up' : 'angle-down'} 
                size={24} 
                style={{
                  marginLeft: 5,
                  color: user.isLogged ? '#fff' : '#000'
                }}
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
    justifyContent: 'space-between',
    // borderColor: 'rgba(255, 255, 255, 0.1)',
    // borderBottomWidth: 1,
    backgroundColor: '#fff',
    minHeight: 50,
    zIndex: 9999,
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000',
  },
  userContainer: {
    position: 'relative',
  },
  user: {
    fontSize: 16,
    textAlign: 'center',
    color: '#000',
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
