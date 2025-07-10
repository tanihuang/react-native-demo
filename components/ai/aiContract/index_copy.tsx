import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions,
  Modal,
  ImageBackground,
  Image,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { getMimeType } from '@/utils/mime';
import axios from 'axios';

const SCREEN_WIDTH = Dimensions.get('window').width;
const MAX_IMAGE_WIDTH = 250;

export default function AiContract() {
  const [chatId, setChatId] = useState('');
  const [summary, setSummary] = useState('');
  const [markedImageUrl, setMarkedImageUrl] = useState('');
  const [boxes, setBoxes] = useState<any[]>([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 600, height: 800 }); // default

  const handleUpload = async () => {
    const result: any = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      type: ['*/*'],
    });

    let file: any = null;
    let mimeType = '';

    if (result?.type === 'success') {
      mimeType = getMimeType(result.name);
      file = {
        uri: result.uri,
        name: result.name,
        type: mimeType,
      };
    }

    if (Platform.OS === 'web' && result?.assets?.[0]?.file) {
      try {
        const response = result.assets[0];
        mimeType = getMimeType(response.name);
        file = new File([response.file], response.name, { type: mimeType });
      } catch (err) {
        console.warn('❌ Web 讀取 blob 失敗:', err);
        return;
      }
    }

    if (!file) {
      console.warn('❌ 無法取得有效檔案');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:8000/ai/contract/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const chat_id = res.data.chat_id;
      setChatId(chat_id);
      setMarkedImageUrl(res.data.imageUrl || '');
      setBoxes(res.data.data || []);

      // 取得原圖大小（需確保網址能存取圖片）
      if (res.data.imageUrl) {
        Image.getSize(res.data.imageUrl, (width, height) => {
          setImageSize({ width, height });
        });
      }

      const summaryRes = await axios.get(`http://localhost:8000/ai/contract/${chat_id}/summary`);
      setSummary(summaryRes.data.summary);
    } catch (err: any) {
      console.error('Upload or fetch failed:', err?.response?.data || err.message);
    }
  };

  const handleAsk = async () => {
    if (!chatId || !question) return;
    try {
      const res = await axios.post('http://localhost:8000/ai/contract/ask', {
        chat_id: chatId,
        question,
      });
      setAnswer(res.data.answer);
    } catch (err: any) {
      console.error('Ask failed:', err?.response?.data || err.message);
    }
  };

  const renderBoxes = (scale: number) => {
    return (
      boxes.map((box, idx) => (
        <View
          key={idx}
          style={[
            styles.box,
            {
              left: box.left * scale,
              top: box.top * scale,
              width: box.width * scale,
              height: box.height * scale,
            },
          ]}
        />
      ))
    )
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleUpload}>
        <Text style={styles.buttonText}>📄 上傳合約文件</Text>
      </TouchableOpacity>

      {markedImageUrl !== '' && (
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <ImageBackground
            source={{ uri: markedImageUrl }}
            style={[styles.image, { aspectRatio: imageSize.width / imageSize.height }]}
            resizeMode="contain"
          >
            {renderBoxes(Math.min(MAX_IMAGE_WIDTH, SCREEN_WIDTH) / imageSize.width)}
          </ImageBackground>
        </TouchableOpacity>
      )}
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        {summary !== '' && <Text style={styles.summary}>{summary}</Text>}
      </ScrollView>

      <TextInput
        value={question}
        onChangeText={setQuestion}
        placeholder="輸入合約問題..."
        placeholderTextColor="#999"
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleAsk}>
        <Text style={styles.buttonText}>📩 送出提問</Text>
      </TouchableOpacity>

      {answer !== '' && <Text style={styles.answer}>{answer}</Text>}

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalScrollContainer}>
            <TouchableOpacity onPress={() => setModalVisible(false)} activeOpacity={1}>
              <ImageBackground
                source={{ uri: markedImageUrl }}
                style={[
                  styles.modalImage,
                  {
                    aspectRatio: imageSize.width / imageSize.height,
                    width: SCREEN_WIDTH * 0.9,
                  },
                ]}
                resizeMode="contain"
              >
                {renderBoxes((SCREEN_WIDTH * 0.9) / imageSize.width)}
              </ImageBackground>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(32, 37, 64)',
  },
  contentContainerStyle: {
    flexDirection: 'column',
    gap: 12,
    paddingVertical: 12,
    marginTop: 16,
  },
  summary: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  image: {
    width: '100%',
    maxWidth: MAX_IMAGE_WIDTH,
    marginTop: 12,
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 8,
    marginTop: 16,
    borderRadius: 5,
    color: '#000',
  },
  button: {
    backgroundColor: 'rgb(88, 130, 247)',
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  answer: {
    marginTop: 12,
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    paddingHorizontal: 12,
  },
  box: {
    position: 'absolute',
    borderColor: 'red',
    borderWidth: 2,
    backgroundColor: 'rgba(255, 0, 0, 0.15)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    position: 'relative',
  },
  modalScrollContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
});
