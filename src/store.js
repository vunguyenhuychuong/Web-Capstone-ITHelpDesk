import { configureStore } from '@reduxjs/toolkit';
import userSlice from './features/user/userSlice';
import authReducer from './features/user/authSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    auth: authReducer,
  },
});
