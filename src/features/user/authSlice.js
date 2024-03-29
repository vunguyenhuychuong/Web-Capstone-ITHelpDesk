import { createSlice } from '@reduxjs/toolkit';

const storedUser = JSON.parse(sessionStorage.getItem("profile"));

const initialState = {
  user: storedUser || null,
  isSidebarOpen: false,
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
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
  },
});

export const { setUser, setError, clearError, logout, toggleSidebar } = authSlice.actions;
export default authSlice.reducer;





