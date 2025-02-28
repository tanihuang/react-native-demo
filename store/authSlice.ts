import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  uuid: undefined,
  username: undefined,
  isLoggedIn: false,
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
        isLoggedIn: true,
      };
      AsyncStorage.setItem('user', JSON.stringify(params));
      return params;
    },
    clearUser: () => {
      AsyncStorage.removeItem('user');
      return initialState;
    },
  },
});

export const loadUser = () => async (dispatch: any) => {
  const user = await AsyncStorage.getItem('user');
  if (user) {
    console.log(user);
    dispatch(setUser(JSON.parse(user)));
  }
};

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
