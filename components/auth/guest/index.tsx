import React, { useEffect, useRef, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, TextInput, Pressable, Text, View, Alert, TouchableOpacity } from 'react-native';
import io, { Socket } from 'socket.io-client';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '@/store/authSlice';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import Default from '@/services/api';
import { showAlert } from '@/components/dialog/AlertDialog';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/services/firebaseConfig';
import { ref, set, onDisconnect, get, child } from 'firebase/database';

const initialForm = {
  username: '',
  password: '',
  visible: false,
};

export default function Login() {
  const [submit, setSubmit] = useState(false);
  const [form, setForm] = useState(initialForm);
  const ws = useRef<Socket | null>(null);
  const dispatch = useDispatch();
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

  const handleInputChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleJoin = async () => {
    const username = form.username.trim();
    if (!username) return;
  
    const snapshot = await get(ref(db, 'users'));
    const users = snapshot.val() || {};
    const exists = Object.values(users).some((item: any) => item.username === username);

    if (exists) {
      showAlert('error', 'Username already exists');
      return;
    }

    const guest = {
      uuid: uuidv4(),
      username,
    };
    const onlineRef = ref(db, `users/${guest.uuid}`);

    await set(onlineRef, {
      ...guest,
      timestamp: Date.now(),
    });
    onDisconnect(onlineRef).remove();
  
    await AsyncStorage.setItem('auth', JSON.stringify(guest));
    dispatch(setUser(guest));
    showAlert('Login successful!');
    router.push('/chatRoom');
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          value={form.username}
          onChangeText={(value) => handleInputChange('username', value)}
          placeholder='nickname'
          style={styles.textInput}
          clearButtonMode='always'
        />
        <Pressable
          style={styles.submitButton}
          onPress={() => {
            setSubmit(true)
            handleJoin();
          }}
        >
          <Text style={styles.submitButtonText}>JOIN</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    width: 300,
  },
  textInput: {
    backgroundColor: '#eee',
    padding: 5,
    borderRadius: 5,
    height: 45,
  },
  submitButton: {
    backgroundColor: 'black',
    paddingVertical: 10,
    marginTop: 10,
    borderRadius: 5,
    height: 40,
  },
  submitButtonText: {
    color: 'white',
    textAlign: 'center',
  }
});
