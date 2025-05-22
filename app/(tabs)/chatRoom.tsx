import React from 'react';
import { StyleSheet, View } from 'react-native';
import _ from 'lodash';
import ChatRoom from '@/components/chatRoom/firebase';

export default function TabChatRoom() {
 
  return (
    <View style={styles.container}>
      <ChatRoom />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
