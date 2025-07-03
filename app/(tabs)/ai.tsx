import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ai } from '@/constants/Ai';
import { Ionicons } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function AiPlatformPage() {
  const [activeModule, setActiveModule] = useState(Ai[0]);
  const ActiveComponent = activeModule.component;

  return (
    <View style={styles.container}>
      {/* 上方模組介紹區 */}
      <Text style={styles.title}>{activeModule.title}</Text>
      <Text style={styles.description}>{activeModule.description}</Text>

      {/* Tab 切換列 */}
      <View style={styles.tabRow}>
        {Ai.map((item: any) => (
          <TouchableOpacity
            key={item.key}
            onPress={() => setActiveModule(item)}
            style={[
              styles.tabButton,
              activeModule.key === item.key && styles.tabButtonActive,
            ]}
          >
            <Ionicons name={item.icon as any} size={20} color="#fff" />
            <Text style={styles.tabText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ✅ 只有內容可以滾動 */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <ActiveComponent />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: 'rgb(32, 37, 64)',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    height: 64,
    display: 'flex',
    alignItems: 'center',
  },
  description: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  tabRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tabButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    height: 76,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: 'rgb(84, 92, 143)',
  },
  tabText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 20,
  },
  content: {
    borderRadius: 16,
  },
});
