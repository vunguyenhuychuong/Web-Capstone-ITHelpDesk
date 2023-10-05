import { createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const storedUser = JSON.parse(sessionStorage.getItem("profile"));

const initialState = {
  user: storedUser || null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.error = null;
      console.log(state.user); 
    },
    setError: (state, action) => {
      state.user = null;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.error = null;
    },
  },
});

export const { setUser, setError, clearError, logout } = authSlice.actions;
export default authSlice.reducer;





