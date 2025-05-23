import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import ChatRoomOnlineUser from './chatRoomOnlineUser';

const screenWidth = Dimensions.get('window').width;

export default function ChatRoomSlidePanel({ children }: { children: React.ReactNode }) {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const translateX = useState(new Animated.Value(screenWidth))[0];

  const handleOnPress = (param: string) => {
    const isActive = activePanel === param;
  
    Animated.timing(translateX, {
      toValue: isActive ? screenWidth : 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setActivePanel(isActive ? null : param);
    });
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity 
          activeOpacity={1}
          onPress={() => handleOnPress('chat')}
          style={[
            styles.button,
            activePanel === 'chat' && styles.buttonActive,
          ]}
        >
          <Ionicons name="chatbox-ellipses" size={15} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity 
          activeOpacity={1}
          onPress={() => handleOnPress('user')}
          style={[
            styles.button,
            activePanel === 'user' && styles.buttonActive,
          ]}
        >
          <FontAwesome5 name="user-friends" size={14} color="white" />
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.animatedContainer, { transform: [{ translateX }] }]}>
        <View style={styles.chatRoomContainer}>
          {activePanel === 'user' && <ChatRoomOnlineUser />}
          {activePanel === 'chat' && children}
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: 'rgb(32, 37, 64)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 10,
    zIndex: 999,
  },
  button: {
    borderRadius: 8,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2.5,
  },
  buttonActive: {
    backgroundColor: 'rgb(84, 92, 143)',
  },
  animatedContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 350,
    backgroundColor: 'rgb(32, 37, 64)',
    padding: 5,
    paddingBottom: 50,
  },
  chatRoomContainer: {
    flex: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
  },
});
