import { 
  StyleSheet,
  View,
} from 'react-native';
import Login from '@/components/auth/guest';

export default function TabLogin() {
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
