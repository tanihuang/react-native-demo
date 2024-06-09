import React from 'react';
import { Tabs } from 'expo-router';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Home from './index';
import Explore from './explore';

const colorScheme = useColorScheme();
const Tab = createBottomTabNavigator()

export default function TabLayout() {

  return (
    <>
      <Header />
      <Footer />
      {/* <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="index" component={Home} />
          <Tab.Screen name="index" component={Explore} />
        </Tab.Navigator>
      </NavigationContainer> */}
      <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            headerShown: false,
          }}>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="explore"
            options={{
              title: 'Explore',
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
              ),
            }}
          />
        </Tabs>
    </>
  );
}
