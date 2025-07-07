import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';

type Props = {
  visible: boolean;
  imageUri: string;
  imageSize: { width: number; height: number };
  results: any[];
  labelMap?: Record<string, string>;
  onClose: () => void;
};

const ImageModal = ({
  visible,
  imageUri,
  imageSize,
  results,
  labelMap,
  onClose,
}: Props) => {
  const [renderWidth, setRenderWidth] = useState(1);

  if (!visible || !imageUri) return null;

  const onImageLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    setRenderWidth(width);
  };

  const scale = renderWidth / imageSize.width;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.background} onPress={onClose} />

        <ImageBackground
          source={{ uri: imageUri }}
          style={[
            styles.image,
            { aspectRatio: imageSize.width / imageSize.height },
          ]}
          onLayout={onImageLayout}
        >
          {Array.isArray(results) && results.length > 0 &&
            results.map((item, idx) => {
              const labelZh = labelMap?.[item.label] || item.label;
              if (!Array.isArray(item.box) || item.box.length !== 4) return null;
              const [x1, y1, x2, y2] = item.box;
              const boxStyle = {
                left: x1 * scale,
                top: y1 * scale,
                width: (x2 - x1) * scale,
                height: (y2 - y1) * scale,
              };

              return (
                <View key={idx} style={[styles.box, boxStyle]}>
                  <Text style={styles.label}>
                    {labelZh} ({(item.confidence * 100).toFixed(1)}%)
                  </Text>
                </View>
              );
            })}
        </ImageBackground>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ImageModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    width: '90%',
    resizeMode: 'contain',
    position: 'relative',
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 30,
    padding: 10,
  },
  closeText: {
    color: '#fff',
    fontSize: 24,
  },
});
