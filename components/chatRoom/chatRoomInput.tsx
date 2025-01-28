import React, { useState, useRef } from "react";
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
import useChatRoom from '@/services/websocket/chatRoom/useChatRoom';
import Icon from 'react-native-vector-icons/Feather';

export default function ChatRoomInput(props: any) {
  const { user, chatRoomId, handleCreateChat } = props;
  const [form, setForm] = useState({
    content: undefined,
  });
  const [isFocused, setIsFocused] = useState(false);
  const { createChat, getChat } = useChatRoom({});

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

    handleCreateChat(params);
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
        textAlignVertical="top"
        blurOnSubmit={false}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <View style={styles.buttomContainer}>
        <Pressable
          style={styles.buttonSubmit}
          onPress={() => handleSubmit()}
        >
          <Icon name="send" size={20} color="black" />
          {/* <Text style={styles.buttonSubmitText}>Submit</Text> */}
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
    shadowOpacity: 0,
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
