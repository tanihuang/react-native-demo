import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import axios from 'axios';

import { getMimeType } from '@/utils/mime';
import { getImageSize } from '@/utils/utils';
import ModePicker from '@/components/common/picker/modePicker';

type UploadItem = {
  id: number;
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
  component: React.FC<{ uploads: UploadItem[]; onDelete: (id: number) => void }>;
  confidence: boolean;
  threshold: number;
};

type Props = {
  config: Record<string, ModeItem>;
};

export default function AiPage({ config }: Props) {
  const firstKey = Object.keys(config)[0];
  const [mode, setMode] = useState<string>(firstKey);
  const [uploadsByMode, setUploadsByMode] = useState<Record<string, UploadItem[]>>({});

  const handlePickImage = async () => {
    if (!mode) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      for (const asset of result.assets) {
        const originalUri = asset.uri;

        const compressed = await ImageManipulator.manipulateAsync(
          originalUri,
          [{ resize: { width: 1024 } }],
          {
            compress: 0.7,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true,
          }
        );

        const imageBase64 = `data:image/jpeg;base64,${compressed.base64}`;
        const item = await sendImageToApi(compressed.uri, imageBase64);
        if (item) {
          setUploadsByMode((prev) => ({
            ...prev,
            [mode]: [...(prev[mode] || []), item],
          }));
        }
      }
    }
  };

  const sendImageToApi = async (
    compressedUri: string,
    base64Uri: string
  ): Promise<UploadItem | null> => {
    if (!mode) return null;

    try {
      const mimeType = getMimeType(compressedUri);
      const formData = new FormData();

      if (Platform.OS === 'web') {
        const response = await fetch(compressedUri);
        const blob = await response.blob();
        const file = new File([blob], 'image.jpg', { type: mimeType });
        formData.append('file', file);
      } else {
        formData.append('file', {
          uri: compressedUri,
          name: 'image.jpg',
          type: mimeType,
        } as any);
      }

      const { endpoint, confidence, threshold } = config[mode];
      const res = await axios.post(`http://localhost:8000${endpoint}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const json = res.data;
      console.log('json', json);

      const resultArray = Array.isArray(json.data)
        ? confidence
          ? json.data.filter((r: any) => r.confidence >= threshold)
          : json.data
        : [];

      console.log('resultArray', resultArray);

      const imageSize = await getImageSize(compressedUri);
      if (!imageSize) return null;

      return {
        id: Date.now(),
        imageUri: base64Uri,
        imageSize,
        results: resultArray,
        maskUrl: json.maskUrl || undefined,
      };
    } catch (error: any) {
      console.error('Upload failed:', error?.response?.data || error.message);
      return null;
    }
  };

  const handleDelete = (id: number) => {
    if (!mode) return;
    setUploadsByMode((prev) => ({
      ...prev,
      [mode]: prev[mode].filter((item) => item.id !== id),
    }));
  };

  const RenderedComponent = mode && mode in config
    ? config[mode].component
    : null;

  return (
    <View style={styles.container}>
      <ModePicker
        selectedKey={mode}
        options={Object.values(config).map((m) => ({
          key: m.key,
          label: m.label,
        }))}
        onSelect={(key) => setMode(key)}
      />

      {RenderedComponent && (
        <RenderedComponent
          key={mode}
          uploads={uploadsByMode[mode] || []}
          onDelete={handleDelete}
        />
      )}

      <TouchableOpacity
        style={[styles.uploadButton, !mode && { opacity: 0.5 }]}
        onPress={handlePickImage}
        disabled={!mode}
      >
        <Text style={styles.uploadButtonText}>上傳產品影像</Text>
      </TouchableOpacity>
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
    marginTop: 16,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
