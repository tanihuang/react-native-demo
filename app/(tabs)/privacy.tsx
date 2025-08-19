import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { 
  StyleSheet,
  View,
  ScrollView,
  Text,
} from 'react-native';
import Login from '@/components/auth/guest';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';

export default function TabPrivacy() {
  const user = useSelector((state: any) => state.user);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.paragraph}>
          1. We do not collect personal data on external servers.{"\n\n"}
          2. All settings and history are stored locally in your browser or device.{"\n\n"}
          3. Data transmission is handled securely via Firebase official SDK.{"\n\n"}
          4. Users may clear app/browser data anytime to remove stored information.{"\n\n"}
          5. For questions, contact tannihuang@gmail.com
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
   title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
  },
});
