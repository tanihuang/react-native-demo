import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import useLoadUser from '@/hooks/useLoadUser';
import { useSelector } from 'react-redux';

const colorScheme = useColorScheme();
const Tab = createBottomTabNavigator()

export default function TabLayout() {

  const { isLoading } = useLoadUser();
  const user = useSelector((state: any) => state.user);

  const config = [
    {
      name: 'index',
      options: {
        title: 'Login',
        tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
          <TabBarIcon name={focused ? 'log-in' : 'log-in-outline'} color={color} />
        ),
        tabBarButton: () => null,
      },
    },
  ];

  return (
    <>
      <Header />
      {/* <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name='index' component={Home} />
          <Tab.Screen name='index' component={Explore} />
        </Tab.Navigator>
      </NavigationContainer> */}
      <Tabs
        initialRouteName={user.isLogged ? 'chatRoom' : 'index'}
        screenOptions={{
          tabBarStyle: { display: 'none' },
          tabBarActiveTintColor: Colors['light'].tint,
          headerShown: false,
        }}
      >
        {config.map((item: any) => (
          <Tabs.Screen
            key={item.name}
            name={item.name}
            options={item.options}
          />
        ))}
      </Tabs>
      <Footer />
    </>
  );
}
