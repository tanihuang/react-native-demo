import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Provider, useSelector } from 'react-redux';
import store from '@/store/index';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, View, StyleSheet } from 'react-native';
import { clearSearch } from '@/store/chatRoomSlice';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const router = useRouter();
  const searchVisible = store.getState().chatroom.searchVisible;


  // useEffect(() => {
  //   if (loaded) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [loaded]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      router.replace('/(tabs)');
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const handleFeedback = (e: any) => {
    const target = e.target;

    const isInteractive = [
      'input',
      'textarea',
      'button',
      'select',
      'a',
      'label',
      '[contenteditable="true"]',
      '[role="button"]',
    ].some((tag) => target.matches(tag));

    if (!isInteractive && searchVisible) {
      store.dispatch(clearSearch());
    }
  };

  return (
    <Provider store={store}>
      <TouchableWithoutFeedback
        onPress={(e) => handleFeedback(e)}
      >
        <View style={styles.container}>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </ThemeProvider>
        </View>
      </TouchableWithoutFeedback>
    </Provider>
    // <Provider store={store}>
    //   <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    //     <Stack>
    //       <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    //       <Stack.Screen name="+not-found" />
    //     </Stack>
    //   </ThemeProvider>
    // </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});