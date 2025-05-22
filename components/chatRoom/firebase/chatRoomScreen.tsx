import React, { useEffect, useRef } from 'react';
import { View, FlatList, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';

export default function ChatRoomScreen({ chatRoomId, user, chat, onMount }: any) {
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    onMount?.();
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const renderGroupedChat = () => {
    return chat.map((item: any, index: number) => (
      <View key={index} style={styles.messageContainer}>
        <Text style={styles.username}>{item?.user?.username || ''}</Text>
        <Text>{item.content}</Text>
      </View>
    ));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <FlatList
        ref={flatListRef}
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={renderGroupedChat}
        keyExtractor={(_, index) => index.toString()}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginVertical: 10,
    marginLeft: 10,
    color: '#888'
  },
  messageContainer: {
    padding: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1
  },
  username: {
    fontWeight: '600'
  }
});
