import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet,
  Image,
  Platform,
  TextInput,
  Pressable,
  Text,
  FlatList,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import useChatRoom from '@/services/websocket/chatRoom/firebase/useChatRoom';
import Ionicons from '@expo/vector-icons/Ionicons';
import { db } from '@/services/firebaseConfig';
import { ref, set } from 'firebase/database';
import { Default } from '@/constants/ChatRoom';

export default function ChatRoomInput(props: any) {
  const { user, chatRoomItem } = props;
  const { chatRoomId, members, group } = chatRoomItem;
  const [form, setForm] = useState({
    content: '',
  });
  const [isFocused, setIsFocused] = useState(false);
  const { createChat, getChat, getChatRoomList, getChatUnread } = useChatRoom();

  const handleInputChange = async (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const { content } = form;

    if (!user || !chatRoomId) {
      return;
    }

    await createChat(chatRoomId, content, group);
    await getChatUnread(chatRoomId, members, group);
    await getChat(chatRoomId);
    setForm((prev: any) => ({ ...prev, content: '' }));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.textInput,
          isFocused && styles.isFocused,
        ]}
        value={form.content}
        onChangeText={value => handleInputChange('content', value)}
        placeholder='message'
        placeholderTextColor='#fff6'
        multiline={true}
        numberOfLines={3}
        clearButtonMode='always'
        textAlignVertical='top'
        returnKeyType='send'
        submitBehavior='submit'
        onSubmitEditing={() => Platform.OS !== 'web' && handleSubmit()}
        onKeyPress={(event) => {
          if (Platform.OS === 'web') {
            const keyEvent = event.nativeEvent as unknown as KeyboardEvent;
            if (keyEvent.key === 'Enter' && !keyEvent.shiftKey) {
              event.preventDefault();
              handleSubmit();
            }
          }
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <View style={styles.buttomContainer}>
        <Pressable
          style={styles.buttonSubmit}
          onPress={() => handleSubmit()}
        >
          <Ionicons size={20} name="send" style={styles.icon} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 8,
    position: 'relative'
  },
  textInput: {
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
    color: '#fff',
  },
  buttomContainer: {
    position: 'absolute',
    right: 10,
    bottom: 5,
    padding: 5,
    display: 'flex',
    justifyContent: 'center',
  },
  buttonSubmit: {
    borderRadius: 15,
  },
  buttonSubmitText: {
    color: 'white',
    textAlign: 'center',
  },
  icon: {
    color: '#fff6',
    backgroundColor: 'transparent',
    padding: 0,
    margin: 0,
  },
  isFocused: {
    borderColor: 'red',
  }
});
