import React, { useEffect, useRef, useState, useCallback } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { 
  StyleSheet,
  Image,
  Platform,
  TextInput,
  Pressable,
  Text,
  FlatList,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import io, { Socket } from 'socket.io-client';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Default } from '@/constants/Default';
import _ from 'lodash';
import ChatRoom from '@/components/chatRoom';

export default function TabChatRoom() {
 
  return (
    <View style={styles.container}>
      <ChatRoom />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  textInput: {
    backgroundColor: '#eee',
    padding: 5,
  },
});
