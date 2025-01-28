import React, { useEffect, useRef, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, TextInput, Pressable, Text, View } from 'react-native';
import io, { Socket } from 'socket.io-client';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '@/store/authSlice';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';

const initForm = {
  username: '',
  password: '',
};

export default function TabLogin() {
  const [submit, setSubmit] = useState(false);
  const [form, setForm] = useState(initForm);
  const ws = useRef<Socket | null>(null);
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (user.isLoggedIn) {
      router.push('/chatRoom');
    }
  }, [user.isLoggedIn, router]);

  const handleInputChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://ec2-18-181-213-113.ap-northeast-1.compute.amazonaws.com/api/auth/signin', {
        username: form.username,
        password: form.password,
      });

      if (response.data.user) {
        dispatch(setUser(response.data.user));
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleLogout = () => {
    dispatch(clearUser());
  };

  const handleSignUp = async () => {
    try {
      const response = await axios.post('http://ec2-18-181-213-113.ap-northeast-1.compute.amazonaws.com/api/auth/signup', {
        username: form.username,
        password: form.password,
      });

      if (response.data.user) {
        console.log('User data:', response.data.user);
        dispatch(setUser(response.data.user));
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

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
        <TextInput
          value={form.password}
          onChangeText={(value) => handleInputChange('password', value)}
          placeholder='password'
          secureTextEntry={true}
          style={[styles.textInput, { marginTop: 10 }]}
          clearButtonMode='always'
        />

        {!user.isLoggedIn ? (
          <>
            <Pressable
              style={styles.submitButton}
              onPress={() => {
                setSubmit(true)
                handleLogin();
              }}
            >
              <Text style={styles.submitButtonText}>Login</Text>
            </Pressable>
            <Pressable
              style={styles.submitButton}
              onPress={handleSignUp}
            >
              <Text style={styles.submitButtonText}>Signup</Text>
            </Pressable>
          </>
        ) : (
          <Pressable
            style={styles.submitButton}
            onPress={handleLogout}
          >
            <Text style={styles.submitButtonText}>Logout</Text>
          </Pressable>
        )}
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
