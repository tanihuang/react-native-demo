import React, { useEffect, useRef, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, TextInput, Pressable, Text, View, Alert, TouchableOpacity } from 'react-native';
import io, { Socket } from 'socket.io-client';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '@/store/authSlice';
import { clearSearch } from '@/store/chatRoom/socket/chatRoomSlice';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import Default from '@/services/api';
import { showAlert } from '@/components/dialog/AlertDialog';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthButton from './AuthButton';

const initForm = {
  username: '',
  password: '',
  visible: false,
};

export default function Login() {
  const [submit, setSubmit] = useState(false);
  const [form, setForm] = useState(initForm);
  const ws = useRef<Socket | null>(null);
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const router = useRouter();

  useEffect(() => {
    const handleInitParam = async () => {
      if (user && user.isLogged) {
        router.push('/chatRoom');
      }
    }
    handleInitParam();
  }, [user.isLogged, router]);

  const handleInputChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleVisible = () => {
    setForm((prev) => ({
      ...prev,
      visible: !prev.visible,
    }));
  };

  const handleLogin = async () => {
    try {
      const { data } = await axios.post(Default.signin, {
        username: form.username,
        password: form.password,
      });
      if (data.user) {
        dispatch(setUser({
          ...data.user,
          role: 1,
          isLogged: true,
        }));
        showAlert('Login successful!');
      }
    } catch (error: any) {
      const message = Array.isArray(error.response?.data?.message)
        ? error.response.data.message.join(' ')
        : error.response?.data?.message;
      showAlert('error', message);
    }
  };

  const handleSignUp = async () => {
    try {
      const response = await axios.post(Default.signup, {
        username: form.username,
        password: form.password,
      });
      if (response) {
        showAlert('Registered successful!');
      }
      if (response.data) {
        dispatch(setUser(response.data));
        router.push('/chatRoom');
      }
    } catch (error: any) {
      const message = Array.isArray(error.response?.data?.message)
        ? error.response.data.message.join(' ')
        : error.response?.data?.message;
      showAlert('error', message);
    }
  };

  const actions = [
    { label: 'LOGIN', onPress: handleLogin },
    { label: 'SIGNUP', onPress: handleSignUp },
  ];

  return (
    <View style={styles.container}>
      {/* <TextInput
        value={email}
        onChangeText={onChangeEmail}
        placeholder='email'
        keyboardType='email-address'
        style={styles.textInput}
      /> */}
      <View style={styles.formContainer}>
        <TextInput
          value={form.username}
          onChangeText={(value) => handleInputChange('username', value)}
          placeholder='username'
          style={styles.textInput}
          clearButtonMode='always'
        />
        <View style={{ position: 'relative' }}>
          <TextInput
            value={form.password}
            onChangeText={(value) => handleInputChange('password', value)}
            placeholder='password'
            secureTextEntry={!form.visible}
            style={[styles.textInput, { marginTop: 10 }]}
            clearButtonMode='always'
          />
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: [{ translateY: -4 }],
            }}
            onPress={handleVisible}
          >
            <Ionicons
              name={form.visible ? 'eye' : 'eye-off'}
              size={16}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        {actions.map((btn, index) => (
          <AuthButton key={index} label={btn.label} onPress={btn.onPress} />
        ))}
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
