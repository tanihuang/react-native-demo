import React from 'react';
import { View, Text, StyleSheet, Button, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import ChatRoomSearch from '@/components/chatRoom/chatRoomSearch';
import { useRouter } from 'expo-router';

export function Header({ navigation }: any) {
  const user = useSelector((state: any) => state.user);
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title} onPress={() => router.push('/')}>ChatRoom</Text>
      {user.isLoggedIn && (
        <>
          <ChatRoomSearch/>
          <View style={styles.userContainer}>
            <Text style={styles.user}>{user.username}</Text>
            {/* <Text>{JSON.stringify(user)}</Text> */}
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

  },
  user: {
    fontSize: 16,
    textAlign: 'center',
  },
});