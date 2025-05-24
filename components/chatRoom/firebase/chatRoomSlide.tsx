import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import ChatRoomOnlineUser from './chatRoomOnlineUser';
import ChatRoomCanvas from './chatRoomCanvas';

const screenWidth = Dimensions.get('window').width;

export default function ChatRoomSlide( props: any) {
  const { user, chat, children } = props;
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
    <View style={styles.container}>
      <View style={styles.topContainer}>
      <View style={[styles.canvasWrapper, activePanel ? { marginRight: 2.5 } : null]}>
        <ChatRoomCanvas user={user} chat={chat || []} />
      </View>
        <Animated.View 
          style={[
            styles.animatedWrapper,
            activePanel ? { marginLeft: 2.5, width: 350 } : { width: 0 },
            { transform: [{ translateX }] }
          ]}
        >
          <View style={styles.borderContainer}>
            {activePanel === 'user' && <ChatRoomOnlineUser handleTogglePanel={() => handleOnPress('chat')}/>}
            {activePanel === 'chat' && children}
          </View>
        </Animated.View>
      </View>

      <View style={styles.buttonContainer}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgb(32, 37, 64)',
    paddingHorizontal: 5,
  },
  topContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  buttonContainer: {
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
  canvasWrapper: {
    flex: 1,
  },
  animatedWrapper: {
    width: 350,
  },
  borderContainer: {
    flex: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
  },
});
