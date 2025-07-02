import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { 
  StyleSheet,
  View,
} from 'react-native';
import Login from '@/components/auth/guest';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';

export default function TabLogin() {
  const user = useSelector((state: any) => state.user);
  const router = useRouter();

  useEffect(() => {
    const handleInitParam = async () => {
      const json = await AsyncStorage.getItem('auth');
      if (json) {
        const user = JSON.parse(json);
        if (user && user.isLogged) {
          router.push('/chatRoom');
        }
      }
    };
    handleInitParam();
  }, [user.isLogged, router]);

  return (
    <View style={styles.container}>
      <Login />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
