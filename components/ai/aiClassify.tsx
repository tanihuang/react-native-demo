import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import axios from 'axios';
import { getMimeType } from '@/utils/mime';
import { getImageSize } from '@/utils/utils';
import ImageModal from '@/components/modals/ImageModal';
import { AiClassify as LABEL_MAP } from '@/constants/AiClassify';
import { isMobile, isWeb } from '@/utils/utils';

const SCREEN_WIDTH = Dimensions.get('window').width;

type UploadItem = {
  id: number;
  imageUri: string;
  imageSize: { width: number; height: number };
  results: any[];
};

export default function AiClassify() {
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<UploadItem | null>(null);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      for (const asset of result.assets) {
        let uri = asset.uri;

        const compressed = await ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { width: 1024 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );

        uri = compressed.uri;
        const item = await sendImageToApi(uri);
        if (item) {
          setUploads((prev) => [...prev, item]);
        }
      }
    }
  };

  const handleTakePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      for (const asset of result.assets) {
        let uri = asset.uri;

        const compressed = await ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { width: 1024 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );

        uri = compressed.uri;
        const item = await sendImageToApi(uri);
        if (item) {
          setUploads((prev) => [...prev, item]);
        }
      }
    }
  };

  const sendImageToApi = async (uri: string): Promise<UploadItem | null> => {
    try {
      const mimeType = getMimeType(uri);
      const formData = new FormData();

      if (Platform.OS === 'web') {
        const response = await fetch(uri);
        const blob = await response.blob();
        const file = new File([blob], 'image.jpg', { type: mimeType });
        formData.append('file', file);
      } else {
        formData.append('file', {
          uri,
          name: 'image.jpg',
          type: mimeType,
        } as any);
      }

      const res = await axios.post('http://localhost:8000/ai/classify', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const json = res.data;
      const resultArray = Array.isArray(json.results) ? json.results : [];
      const imageSize = await getImageSize(uri);
      if (!imageSize) return null;

      return {
        id: Date.now(),
        imageUri: uri,
        imageSize,
        results: resultArray,
      };
    } catch (error: any) {
      console.error('Upload failed:', error?.response?.data || error.message);
      return null;
    }
  };

  const handleDelete = (id: number) => {
    setUploads((prev) => prev.filter((item) => item.id !== id));
    if (selectedItem?.id === id) setSelectedItem(null);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.gallery} horizontal={false}>
        {uploads.map((item) => {
          const scale = 250 / item.imageSize.width;
          return (
            <View key={item.id} style={styles.thumbnail}>
              <TouchableOpacity onPress={() => setSelectedItem(item)}>
                <ImageBackground
                  source={{ uri: item.imageUri }}
                  style={[
                    styles.image,
                    { aspectRatio: item.imageSize.width / item.imageSize.height },
                  ]}
                >
                  {item.results.map((result, idx) => {
                    if (!Array.isArray(result.box) || result.box.length !== 4) return null;
                    const [x1, y1, x2, y2] = result.box;
                    const boxStyle = {
                      left: x1 * scale,
                      top: y1 * scale,
                      width: (x2 - x1) * scale,
                      height: (y2 - y1) * scale,
                    };

                    const labelZh = LABEL_MAP[result.label] || result.label;

                    return (
                      <View key={idx} style={[styles.box, boxStyle]}>
                        <Text style={styles.label}>
                          {labelZh} ({(result.confidence * 100).toFixed(1)}%)
                        </Text>
                      </View>
                    );
                  })}
                </ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteText}>刪除</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      {isWeb && (
        <TouchableOpacity style={styles.uploadButton} onPress={handlePickImage}>
          <Text style={styles.uploadButtonText}>從圖庫選擇</Text>
        </TouchableOpacity>
      )}

      {isMobile && (
         <TouchableOpacity style={styles.uploadButton} onPress={handleTakePhoto}>
          <Text style={styles.uploadButtonText}>使用相機拍照</Text>
        </TouchableOpacity>
      )}

      {selectedItem && (
        <ImageModal
          visible={true}
          imageUri={selectedItem.imageUri}
          imageSize={selectedItem.imageSize}
          results={selectedItem.results}
          labelMap={LABEL_MAP} 
          onClose={() => setSelectedItem(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(32, 37, 64)',
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'flex-start',
  },
  thumbnail: {
    maxWidth: 250,
    width: '100%',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  box: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'red',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
  },
  label: {
    color: '#fff',
    fontSize: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  deleteBtn: {
    marginTop: 6,
    backgroundColor: '#ff4d4f',
    paddingVertical: 4,
    borderRadius: 4,
    alignItems: 'center',
  },
  deleteText: {
    color: '#fff',
    fontSize: 12,
  },
  uploadButton: {
    backgroundColor: 'rgb(88, 130, 247)',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
