import React, { useEffect, useRef } from 'react';
import { View, FlatList, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';

export default function ChatRoomScreen({ chat, onMount, variant }: any) {
  const flatListRef = useRef<FlatList>(null);
  const isPublic = variant === 'public';

  useEffect(() => {
    onMount?.();
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const renderGroupedChat = () => {
    return chat.map((item: any, index: number) => (
      <View key={index} style={styles.messageContainer}>
        <View style={styles.messageInfo}>
          <Text style={[styles.username, isPublic && styles.public]}>
            {item?.user?.username || ''}
          </Text>
          <Text style={[styles.timestamp, isPublic && styles.public]}>
          {item?.timestamp
            ? new Date(item.timestamp).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })
            : ''}
          </Text>
        </View>
        <Text style={[styles.content, isPublic && styles.public]}>
          {item.content}
        </Text>
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
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginVertical: 10,
    marginLeft: 10,
    color: '#888'
  },
  messageContainer: {
    padding: 10,
    marginHorizontal: 6,
    borderBottomWidth: 0
  },
  messageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontWeight: '600',
    color: '#fff',
  },
  timestamp: {
    color: 'rgba(255, 255, 255, 0.5)',
    marginLeft: 10,
  },
  content: {
    color: '#fff',
    marginTop: 5,
  },
  public: {
    color: '#000',
  }
});
