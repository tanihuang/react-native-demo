import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ref, remove } from 'firebase/database';
import { db } from '@/services/firebaseConfig';
import { Default } from '@/constants/ChatRoom';

const initialState = {
  uuid: undefined,
  username: undefined,
  role: 0, // 0: 訪客, 1: 會員, 2: 管理員
  isLogged: false,
};
const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { payload } = action;
      const params = { 
        ...state,
        ...payload,
        isLogged: true,
      };
      AsyncStorage.setItem('auth', JSON.stringify(params));
      return params;
    },
    clearUser: (state) => {
      AsyncStorage.removeItem('auth');
      return initialState;
    },
  },
});

export const loadUser = () => async (dispatch: any) => {
  const user = await AsyncStorage.getItem('auth');
  if (user) {
    dispatch(setUser(JSON.parse(user)));
  }
};

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
