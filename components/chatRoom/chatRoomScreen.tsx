import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import ChatRoomInput from './chatRoomInput';
import { toChatRoomName } from '@/utils/utils';

export default function ChatRoomScreen(props: any) {
  const { chat, user, members, groupType, chatRoomName } = props;
  const chatRoomTitle = toChatRoomName(members, user, chatRoomName, groupType);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (chat.length > 0) {
      flatListRef.current?.scrollToOffset({
        animated: true,
      });
    }
  }, [chat]);

  const renderFlatList = ({ item }: any) => {
    const { data = [] } = item;
    return (
      <View style={styles.chatContainer}>
        <View style={styles.lineContainer}>
          <View style={styles.line} />
          <Text style={styles.chatTitle}>{item.title}</Text>
          <View style={styles.line} />
        </View>
        {data.map((message: any, index: number) => {
          const isCurrentUser = message.user.uuid === user.uuid;
          return(
            <View 
              key={index} 
              style={[
                index !== 0 && styles.chatSubContainer,
                isCurrentUser && styles.isCurrentUser
              ]}
            >
              <View style={styles.chatHeader}>
                <Text style={styles.chatCreatedBy}>{message.user.username}</Text>
                <Text style={styles.chatTimestamp}>{new Date(message.timestamp).toLocaleString()}</Text>
              </View>
              <Text style={styles.chatContent}>{message.content}</Text>
            </View>
          );
        })}
      </View>
    )
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{chatRoomTitle}</Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={chat}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderFlatList}
        contentContainerStyle={styles.flatList}
        // inverted // 使最新消息显示在底部
        showsVerticalScrollIndicator={true}
      />
      <ChatRoomInput {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#fff',
  },
  header: { 
    borderBottomWidth: 1,
    borderBottomColor: "#cad2d3",
    borderStyle: "solid",
    padding: 10,
  },
  title: {
    fontSize: 24, 
    fontWeight: "bold",
  },
  flatList: {
    flexGrow: 1,
    padding: 10,
    justifyContent: 'flex-end',
  },
  chatContainer: { 
    marginBottom: 10,
  },
  lineContainer: {
    marginVertical: 15,
    alignItems: 'center',
    flexDirection: 'row',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  chatTitle: {
    color: '#000',
    textAlign: 'center',
    fontSize: 12,
    paddingVertical: 3,
    paddingHorizontal: 5,
    marginHorizontal: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  chatSubContainer: {
    marginTop: 20,
  },
  chatHeader: {
    flexDirection: "row",
    marginBottom: 5,
    verticalAlign: 'middle',
  },
  chatHeaderDiv: {
    marginLeft: 10,
  },
  chatCreatedBy: { 
    fontSize: 14, 
    color: '000',
  },
  chatTimestamp: { 
    fontSize: 12, 
    color: '#a0aeaf',
    marginLeft: 10,
  },
  chatContent: { 
    fontSize: 14, 
    color: "#333333",
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 3,
  },
  isCurrentUser: {
    alignItems: 'flex-end',
  }
});
