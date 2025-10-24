import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../config/apiConfig';

// Helper function to get initial state from session storage
const getInitialState = () => {
  const token = sessionStorage.getItem('token');
  const userStr = sessionStorage.getItem('user');
  
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      return {
        isAuthenticated: true,
        user: user,
        token: token,
        loading: false,
        error: null,
        isSessionLoading: false
      };
    } catch (error) {
      // If parsing fails, clear invalid session data
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      console.log(error);
    }
  }
  
  return {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null,
    isSessionLoading: false
  };
};

const initialState = getInitialState();

// Async thunks
export const signup = createAsyncThunk(
  'user/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.signup(userData);
      return response?.data || response;
    } catch (err) {
      const message = err.data?.message || err.message || 'Signup failed';
      if(message.includes('E11000 duplicate')){
        return rejectWithValue('Mobile number already exists')
      }
      return rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      return response?.data || response;
    } catch (err) {
      const message = err?.data?.message || err.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authAPI.forgotPassword(email);
      return response;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Email verification failed';
      return rejectWithValue(message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async ({ email, newPassword }, { rejectWithValue }) => {
    try {
      const response = await authAPI.resetPassword({ email, newPassword });
      return response;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Password reset failed';
      return rejectWithValue(message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      state.isSessionLoading = false;
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.isSessionLoading = false;
        const payload = action.payload || {};
        state.user = payload.user || payload;
        state.token = payload.token || null;
        if (state.token) sessionStorage.setItem('token', state.token);
        if (state.user) sessionStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.isSessionLoading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

export const { logout, clearError } = userSlice.actions;

export default userSlice.reducer;

// Selectors
export const selectUser = (state) => state.user.user;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;
export const selectUserRole = (state) => state.user.user?.role;
export const selectIsSessionLoading = (state) => state.user.isSessionLoading;