import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';

import { getMimeType } from '@/utils/mime';
import { getImageSize } from '@/utils/utils';
import ModePicker from '@/components/common/picker/modePicker';

type UploadItem = {
  id: number;
  chatId?: string;
  imageUri: string;
  imageSize: { width: number; height: number };
  results: any[];
  maskUrl?: string;
};

type ModeItem = {
  key: string;
  label: string;
  description: string;
  endpoint: string;
  component: React.FC<{
    uploads: UploadItem[];
    onDelete: (id: number) => void;
    modeKey: string;
  }>;
  confidence: boolean;
  threshold: number;
};

type Props = {
  config: Record<string, ModeItem>;
};

export default function AiPageImage({ config }: Props) {
  const firstKey = Object.keys(config)[0];
  const [mode, setMode] = useState(firstKey);
  const [uploadsByMode, setUploadsByMode] = useState<Record<string, UploadItem[]>>({});
  const [form, setForm] = useState({ 
    question: '',
    answer: '',
    summary: ''
  });
  const [chatId, setChatId] = useState('');

  const handlePickFile = async () => {
    if (!mode) return;

    const result: any = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      type: '*/*',
    });

    let file: any = null;
    let mimeType = '';
    let fileUri = '';

    if (Platform.OS === 'web' && result?.assets?.[0]?.file) {
      const response = result.assets[0];
      mimeType = getMimeType(response.name);
      file = new File([response.file], response.name, { type: mimeType });
      fileUri = URL.createObjectURL(file);
    }

    if (!file) {
      console.warn('❌ 無法取得有效檔案');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const { endpoint, confidence, threshold } = config[mode];
      const res = await axios.post(`http://localhost:8000${endpoint}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const json = res.data;

      const resultArray = Array.isArray(json.data)
        ? confidence
          ? json.data.filter((r: any) => r.confidence >= threshold)
          : json.data
        : [];

      let imageSize = { width: 0, height: 0 };

      if (mimeType.startsWith('image/')) {
        const size = await getImageSize(fileUri);
        if (size) imageSize = size;
      }

      const item: UploadItem = {
        id: Date.now(),
        chatId: json.chatId || null,
        imageUri: mimeType.startsWith('image/') ? fileUri : '',
        imageSize,
        results: resultArray,
      };

      const newChatId = json.chatId || '';
      setChatId(newChatId);
      setUploadsByMode((prev) => ({
        ...prev,
        [mode]: [...(prev[mode] || []), item],
      }));

      if (newChatId) {
        const summaryRes = await axios.get(`http://localhost:8000/ai/contract/${newChatId}/summary`);
        const summaryData = summaryRes.data;
        setForm((prev) => ({
          ...prev,
          summary: summaryData.summary || ''
        }));
      }
    } catch (error: any) {
      console.error('Upload failed:', error?.response?.data || error.message);
    }
  };

  const handleDelete = (id: number) => {
    if (!mode) return;
    setUploadsByMode((prev) => ({
      ...prev,
      [mode]: prev[mode].filter((item) => item.id !== id),
    }));
  };

  const handleForm = async () => {
    if (!chatId || !form.question) return;

    try {
      const formData = new FormData();
      formData.append('chatId', chatId);
      formData.append('question', form.question);

      const context = form.summary;
      const prompt = `問題：${form.question}\n回答：`;
      formData.append('prompt', prompt);

      const res = await axios.post('http://localhost:8000/ai/contract/form', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setForm((prev) => ({
        ...prev,
        answer: res.data.answer || '',
      }));
    } catch (err: any) {
      console.error('Ask failed:', err?.response?.data || err.message);
    }
  };

  const RenderedComponent = mode && config[mode]?.component;

  return (
    <View style={styles.container}>
      <ModePicker
        selectedKey={mode}
        options={Object.values(config).map((m) => ({ key: m.key, label: m.label }))}
        onSelect={(key) => setMode(key)}
      />

      {RenderedComponent && (
        <RenderedComponent
          key={mode}
          modeKey={mode}
          uploads={uploadsByMode[mode] || []}
          onDelete={handleDelete}
        />
      )}

      <View>
        <TouchableOpacity
          style={[styles.uploadButton, (!mode) && styles.disabledButton]}
          onPress={handlePickFile}
          disabled={!mode}
        >
          <Text style={styles.uploadButtonText}>上傳文件或影像</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {form.summary !== '' && (
          <View style={styles.summaryContainer}>
            <ScrollView style={styles.summaryScroll}>
              <Text style={styles.summaryText}>{form.summary}</Text>
            </ScrollView>
          </View>
        )}

        {form?.answer !== '' && (
          <View style={styles.answerContainer}>
            <ScrollView style={styles.answerScroll}>
              <Text 
                style={[styles.answerText, form.answer.length === 0 && styles.disabledAnswer]}
              >
                {form.answer.length === 0 ? '未找到相關條文' : form.answer}
              </Text>
            </ScrollView>
          </View>
        )}

        {chatId && (
          <TextInput
            value={form.question}
            onChangeText={(text) => setForm((prev) => ({ ...prev, question: text }))}
            placeholder="輸入合約問題..."
            placeholderTextColor="#999"
            style={styles.input}
          />
        )}

        <TouchableOpacity
          style={[styles.uploadButton, (!mode || !chatId) && styles.disabledButton]}
          onPress={handleForm}
          disabled={!mode || !chatId}
        >
          <Text style={styles.uploadButtonText}>送出提問</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(32, 37, 64)',
  },
  uploadButton: {
    backgroundColor: 'rgb(88, 130, 247)',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  divider: {
    height: 1,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 16,
  },
  answerContainer: {
    maxHeight: 100,
    borderRadius: 8,
    marginTop: 16,
  },
  answerScroll: {
    maxHeight: 100,
  },
  answerText: {
    color: '#fff',
    fontSize: 14,
  },
  disabledAnswer: {
    color: 'rgb(189, 189, 189)',
  },
  summaryContainer: {
    maxHeight: 80,
    borderRadius: 8,
    backgroundColor: 'rgb(51, 58, 100)',
    padding: 10,
    marginTop: 16,
  },
  summaryScroll: {
    maxHeight: 80,
  },
  summaryText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
});
