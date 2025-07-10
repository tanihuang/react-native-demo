import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import LoadingDots from '@/components/animation/loadingDots';

const emotionImages: any = {
  happy: require('@/assets/images/agent_happy.png'),
  sad: require('@/assets/images/agent_sad.png'),
  angry: require('@/assets/images/agent_angry.png'),
  surprise: require('@/assets/images/agent_wink.png'),
  confused: require('@/assets/images/agent_meh.png'),
  neutral: require('@/assets/images/agent_neutral.png')
};

export default function Agent({ emotion, summary, isLoading }: any) {
  return (
    <View style={styles.container}>
      <Image source={emotionImages[emotion]} style={styles.image} />
      {summary && (
        <View style={styles.summaryContainer}>
          <ScrollView style={styles.summaryScroll}>
            {isLoading ? (
              <LoadingDots text="loading" color="#ccc" size={14} />
            ) : (
              <Text style={styles.summaryText}>{summary}</Text>
            )}
          </ScrollView>
        </View>
      )}
    </View>

  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    alignItems: 'center',
   },
  image: { width: 120, height: 120 },
  text: { marginTop: 10, fontSize: 16 },
  summaryContainer: {
    maxHeight: 80,
    width: '100%',
    borderRadius: 8,
    backgroundColor: 'rgb(51, 58, 100)',
    padding: 10,
    marginTop: 'auto',
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