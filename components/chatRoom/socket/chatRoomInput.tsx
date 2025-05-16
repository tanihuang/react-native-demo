import React, { useState, useRef } from 'react';
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
import useChatRoomSocket from '@/services/websocket/chatRoom/socket/useChatRoom';
import { Feather } from '@expo/vector-icons';

export default function ChatRoomInput(props: any) {
  const { user, chatRoomId } = props;
  const [form, setForm] = useState({
    content: undefined,
  });
  const [isFocused, setIsFocused] = useState(false);
  const { createChat, getChat } = useChatRoomSocket({});

  const handleInputChange = async (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const { content } = form;

    if (!user || !chatRoomId) {
      return;
    }

    const params = {
      createdBy: user.uuid,
      chatRoomId,
      content,
      user: {
        uuid: user.uuid,
        username: user.username,
      },
      timestamp: Date.now(),
    }

    await createChat(params);
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
        placeholderTextColor='#333'
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
          <Feather name='send' size={20} color='black' />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    position: 'relative'
  },
  textInput: {
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
  },
  buttomContainer: {
    position: 'absolute',
    right: 10,
    bottom: 5,
    padding: 5,
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  buttonSubmit: {
    borderRadius: 15,
  },
  buttonSubmitText: {
    color: 'white',
    textAlign: 'center',
  },
  isFocused: {
    borderColor: 'red',
  }
});
