import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { View, StyleSheet, Dimensions, Platform, Text, TouchableOpacity } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useSelector, useDispatch } from 'react-redux';
import ChatRoomScreen from './chatRoomScreen';
import DrawerContent from './drawerContent';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { toChatRoomName, toChatRoomListDate } from '@/utils/utils';
import { drawerContentRef } from '@/constants/Ref';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { setChatRoomItem } from '@/store/chatRoom/firebase/chatRoomSlice';
import useChatRoom from '@/services/websocket/chatRoom/firebase/useChatRoom';

const Stack = createNativeStackNavigator();
const { width } = Dimensions.get('window');
const Drawer = createDrawerNavigator();
const isWeb = Platform.OS === 'web';

const ChatRoomList = forwardRef((props: any, ref) => {
  const dispatch = useDispatch();
  const { chatRoom, chatRoomList, handleTabChange } = props;
  const { chatList, chatRoomItem } = useSelector((state: any) => state.chatRoomFirebase);
  const user = useSelector((state: any) => state.user);
  const { getPublicPath } = useChatRoom();

  // useImperativeHandle(ref, () => ({
  //   handleOnPress: (chatRoomId: string) => {
  //     drawerContentRef.current?.handleOnPress(chatRoomId);
  //   },
  // }));
  
  if (!chatRoomList?.length || !chatRoomItem?.chatRoomId) {
    return null;
  }

  const initialOptions: any = {
    headerStyle: {
      backgroundColor: 'rgb(32, 37, 64)',
      borderWidth: 0,
    } as any,
    headerTitleStyle: {
      color: '#fff',
      fontWeight: 'bold',
    },
    headerTintColor: '#fff',
    contentStyle: { backgroundColor: 'rgb(32, 37, 64)' },
  }

  return (
    <View style={styles.container}>
      <Stack.Navigator initialRouteName="ChatRoomList">
        <Stack.Screen
          name="ChatRoomList"
          options={{
            ...initialOptions,
            title: '聊天室列表',
          }}
        >
          {(props) => (
            <DrawerContent 
              {...props}
              ref={drawerContentRef}
              user={user}
              chatRoom={chatRoom}
              chatList={chatList}
              chatRoomList={chatRoomList} 
              handleTabChange={handleTabChange}
            />
          )}
        </Stack.Screen>
        {chatRoomList
          // .filter((item: any) => item.lastMessageTimestamp) 
          .map((item: any) => {
            const chatRoomName = toChatRoomName(item.members, user, item.chatRoomName, item.group);
            return (
              <Stack.Screen
                key={item.chatRoomId}
                name={item.chatRoomId}
                options={({ route, navigation }) => ({
                  ...initialOptions,
                  title: chatRoomName,
                  headerLeft: () => (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.goBack();
                        dispatch(setChatRoomItem(getPublicPath));
                      }}
                      style={{ paddingHorizontal: 10 }}
                    >
                      <FontAwesome name="angle-left" size={24} color="#fff" />
                    </TouchableOpacity>
                  ),
                })}
              >
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
              </Stack.Screen>
            )
        })}
      </Stack.Navigator>
      {/* <Drawer.Navigator
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
      </Drawer.Navigator> */}
    </View>
  );
});

export default ChatRoomList;

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    minHeight: 'auto',
  },
});