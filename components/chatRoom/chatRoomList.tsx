import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from '@react-navigation/drawer';
import ChatRoomScreen from './chatRoomScreen';
import DrawerContent from "./drawerContent";
import { useSelector, useDispatch  } from 'react-redux';
import { navigationRef } from '@/constants/Ref';

const { width } = Dimensions.get('window');
const Drawer = createDrawerNavigator();
const isWeb = Platform.OS === 'web';

const ChatRoomList = forwardRef((props: any, ref) => {
  const { user, handleTabChange } = props;
  const { chatRoomList, chatRoomItem, chatList } = useSelector((state: any) => state.chatroom);
  const drawerContentRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    handleOnPress: (chatRoomId: string) => {
      drawerContentRef.current?.handleOnPress(chatRoomId);
    },
  }));
  
  if (!chatRoomList || !chatRoomList.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Drawer.Navigator
        initialRouteName={chatRoomItem.chatRoomId|| chatRoomList[0].chatRoomId || 'chatRoom'}
        screenOptions={{
          drawerPosition: 'left',
          drawerType: isWeb ? 'permanent' : 'slide', 
          headerShown: false,
          drawerStyle: {
            width: 250,
            padding: 0,
          },
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          drawerActiveTintColor: 'red',
          drawerActiveBackgroundColor: 'red',
        }}
        drawerContent={(props) => (
          <DrawerContent 
            {...props}
            ref={drawerContentRef}
            user={user}
            chatRoomList={chatRoomList} 
            chatRoom={chatRoomItem}
          />
        )}
      >
        {chatRoomList.map((item: any, index: number) => (
          <Drawer.Screen
            key={item.chatRoomId}
            name={item.chatRoomId}
            component={() => (
              <ChatRoomScreen 
                {...item}
                user={user}
                chat={chatList[item.chatRoomId] || []}
              />
            )}
            // options={({ route }: any) => {
            //   return {
            //     title: item.chatRoomName,
            //   };
            // }}
            // initialParams={item}
            listeners={{
              focus: () => {
                handleTabChange(item);
              },
            }}
          />
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
