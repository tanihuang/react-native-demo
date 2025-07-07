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

  return (
    <View style={styles.container}>
      {/* Info */}
      <Text style={styles.title}>{activeModule.title}</Text>
      <Text style={styles.description}>{activeModule.description}</Text>

      {/* Tabs */}
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

      {/* Panel */}
      <View style={styles.tabContainer}>
        {Ai.map((item: any) => (
          <View
            key={item.key}
            style={{ flex: 1, display: activeModule.key === item.key ? 'flex' : 'none' }}
          >
            <item.component />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
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
  tabContainer: {
    flex: 1,
    marginTop: 16,
  },
});
