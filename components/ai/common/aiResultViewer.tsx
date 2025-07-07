import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import ImageModal from '@/components/common/modals/imageModal';

const SCREEN_WIDTH = Dimensions.get('window').width;

export type UploadItem = {
  id: number;
  imageUri: string;
  imageSize: { width: number; height: number };
  results: any[];
};

type Props = {
  uploads: UploadItem[];
  onDelete?: (id: number) => void;
  children?: React.ReactNode;
  isBoxMode?: boolean;
};

export default function AiResultViewer({
  uploads,
  onDelete,
  children,
  isBoxMode = true,
}: Props) {
  console.log('uploads: ', uploads);
  const [selectedItem, setSelectedItem] = useState<UploadItem | null>(null);

  return (
    <View style={styles.container}>
      {children}

      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
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
                    // ✅ 物件偵測用框框顯示
                    if (isBoxMode && Array.isArray(result.box) && result.box.length === 4) {
                      const [x1, y1, x2, y2] = result.box;
                      const boxStyle = {
                        left: x1 * scale,
                        top: y1 * scale,
                        width: (x2 - x1) * scale,
                        height: (y2 - y1) * scale,
                      };

                      return (
                        <View key={idx} style={[styles.box, boxStyle]}>
                          <Text style={styles.label}>
                            {result.label} ({(result.confidence * 100).toFixed(1)}%)
                          </Text>
                        </View>
                      );
                    }

                    return (
                      <View key={idx} style={styles.topLeftLabel}>
                        <Text style={styles.label}>
                          {result.label} ({(result.confidence * 100).toFixed(1)}%)
                        </Text>
                      </View>
                    );
                  })}
                </ImageBackground>
              </TouchableOpacity>

              {onDelete && (
                <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(item.id)}>
                  <Text style={styles.deleteText}>刪除</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </ScrollView>

      {selectedItem && (
        <ImageModal
          visible={true}
          imageUri={selectedItem.imageUri}
          imageSize={selectedItem.imageSize}
          results={selectedItem.results}
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
  contentContainerStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'flex-start',
  },
  thumbnail: {
    maxWidth: 250,
    width: '100%',
    marginTop: 16,
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
  topLeftLabel: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  label: {
    color: '#fff',
    fontSize: 12,
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
});
