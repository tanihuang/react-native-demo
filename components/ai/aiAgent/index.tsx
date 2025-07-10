import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { connectWebSocket, sendMessage } from '@/services/websocket/useAgent';
import AiResultViewer from './aiResultViewer';
import { useSelector, useDispatch } from 'react-redux';

export default function AiAgent() {
  const user = useSelector((state: any) => state.user);
  const [message, setMessage] = useState('');
  const [summary, setSummary] = useState('');
  const [emotion, setEmotion] = useState('neutral');
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    connectWebSocket((data: any) => {
      setSummary(data.summary);
      setEmotion(data.emotion);
      setIsLoading(false);
    });
  }, []);

  const handleSend = () => {
    setIsLoading(true);
    sendMessage({ user, message });
    setMessage('');
  };

  return (
    <View style={styles.container}>
      <AiResultViewer emotion={emotion} summary={summary} isLoading={isLoading}/>
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="請輸入訊息..."
        style={styles.input}
        onSubmitEditing={handleSend}
        submitBehavior="blurAndSubmit"
      />
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={handleSend}
      >
        <Text style={styles.uploadButtonText}>送出提問</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  input: {
    height: 46,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    color: '#000',
    width: '100%',
    marginTop: 16,
  },
  uploadButton: {
    backgroundColor: 'rgb(88, 130, 247)',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
  },
   uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});