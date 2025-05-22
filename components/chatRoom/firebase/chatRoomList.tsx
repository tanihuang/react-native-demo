import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { View, StyleSheet, Dimensions, Platform, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useSelector } from 'react-redux';
import ChatRoomScreen from './chatRoomScreen';
import DrawerContent from './drawerContent';
import { useRouter } from 'expo-router';
import useChatRoom from '@/services/websocket/chatRoom/firebase/useChatRoom';
import ChatRoomInput from './chatRoomInput';

const { width } = Dimensions.get('window');
const Drawer = createDrawerNavigator();
const isWeb = Platform.OS === 'web';

const ChatRoomList = forwardRef((props: any, ref) => {
  const { chatRoom, chatRoomList, handleTabChange } = props;
  const { chatList, chatRoomItem } = useSelector((state: any) => state.chatRoomFirebase);
  const user = useSelector((state: any) => state.user);
  const drawerContentRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    handleOnPress: (chatRoomId: string) => {
      drawerContentRef.current?.handleOnPress(chatRoomId);
    },
  }));
  
  if (!chatRoomList?.length || !chatRoomItem?.chatRoomId) {
    return null;
  }

  const roomsToRender = chatRoomList.length
    ? chatRoomList
    : [];

  return (
    <View style={styles.container}>
      <Drawer.Navigator
        initialRouteName={chatRoom.chatRoomId}
        screenOptions={{
          drawerPosition: 'left',
          drawerType: isWeb ? 'permanent' : 'slide', 
          headerShown: false,
          drawerStyle: {
            width: 250,
            padding: 0,
          },
        }}
        drawerContent={(props) => (
          <DrawerContent 
            {...props}
            ref={drawerContentRef}
            user={user}
            chatRoomList={roomsToRender} 
            chatRoom={chatRoom}
            handleTabChange={handleTabChange}
          />
        )}
      >
        {chatRoomList.map((item: any) => (
          <Drawer.Screen key={item.chatRoomId} name={item.chatRoomId}>
            {() => (
              <ChatRoomScreen 
                {...item}
                user={user}
                chat={chatList[item.chatRoomId] || []}
                onMount={() => {
                  handleTabChange?.(item);
                }}
              />
            )}
          </Drawer.Screen>
        ))}
      </Drawer.Navigator>
    </View>
  );
});

export default ChatRoomList;

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    minHeight: 'auto' 
  },
});