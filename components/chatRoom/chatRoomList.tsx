import React, { useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from '@react-navigation/drawer';
import ChatRoomScreen from './chatRoomScreen';
import DrawerContent from "./drawerContent";
import { navigationRef } from "@/constants/Ref";

const { width } = Dimensions.get('window');
const Drawer = createDrawerNavigator();
const isWeb = Platform.OS === 'web';

export default function ChatRoomList(props: any) {
  const {
    user,
    chatRoomList,
    chat,
    chatRoom,
    handleTabChange,
    handleCreateChat,
  } = props;

  if (!chatRoomList || !chatRoomList.length) {
    return null;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <View style={styles.container}>
        <Drawer.Navigator
          initialRouteName={chatRoom.chatRoomId|| chatRoomList[0].chatRoomId}
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
              user={user}
              chatRoomList={chatRoomList} 
              chatRoom={chatRoom}
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
                  chat={chat[item.chatRoomId] || []}
                  handleCreateChat={handleCreateChat}
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
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    minHeight: 'auto' 
  },
});
