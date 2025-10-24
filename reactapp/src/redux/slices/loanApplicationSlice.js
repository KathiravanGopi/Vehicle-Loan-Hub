import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loanApplicationAPI } from '../../config/apiConfig';

const initialState = {
  loanApplications: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    status: 'All',
    page: 1,
    limit: 10
  },
  totalPages: 1,
  totalCount: 0
};

// Async thunks for loan application operations
export const fetchLoanApplications = createAsyncThunk(
  'loanApplications/fetchAll',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await loanApplicationAPI.getAllLoanApplications(filters);
      return response;
    } catch (err) {
      const message = err?.data?.message || err.message || 'Failed to fetch loan applications';
      return rejectWithValue(message);
    }
  }
);

export const approveLoanApplication = createAsyncThunk(
  'loanApplications/approve',
  async (id, { rejectWithValue }) => {
    try {
      const response = await loanApplicationAPI.approveLoanRequest(id);
      return { id, ...response };
    } catch (err) {
      const message = err?.data?.message || err.message || 'Failed to approve loan application';
      return rejectWithValue(message);
    }
  }
);

export const rejectLoanApplication = createAsyncThunk(
  'loanApplications/reject',
  async (id, { rejectWithValue }) => {
    try {
      const response = await loanApplicationAPI.rejectLoanRequest(id);
      return { id, ...response };
    } catch (err) {
      const message = err?.data?.message || err.message || 'Failed to reject loan application';
      return rejectWithValue(message);
    }
  }
);

export const fetchLoanApplicationById = createAsyncThunk(
  'loanApplications/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await loanApplicationAPI.getLoanApplicationById(id);
      return response;
    } catch (err) {
      const message = err?.data?.message || err.message || 'Failed to fetch loan application';
      return rejectWithValue(message);
    }
  }
);

export const createLoanApplication = createAsyncThunk(
  'loanApplications/create',
  async (applicationData, { rejectWithValue }) => {
    try {
      const response = await loanApplicationAPI.addLoanApplication(applicationData);
      return response;
    } catch (err) {
      const message = err?.data?.message || err.message || 'Failed to create loan application';
      return rejectWithValue(message);
    }
  }
);

export const updateLoanApplication = createAsyncThunk(
  'loanApplications/update',
  async ({ id, applicationData }, { rejectWithValue }) => {
    try {
      const response = await loanApplicationAPI.updateLoanApplication({ id, applicationData });
      return response;
    } catch (err) {
      const message = err?.data?.message || err.message || 'Failed to update loan application';
      return rejectWithValue(message);
    }
  }
);

export const deleteLoanApplication = createAsyncThunk(
  'loanApplications/delete',
  async (id, { rejectWithValue }) => {
    try {
      await loanApplicationAPI.deleteLoanApplication(id);
      return id;
    } catch (err) {
      const message = err?.data?.message || err.message || 'Failed to delete loan application';
      return rejectWithValue(message);
    }
  }
);

export const fetchUserLoanApplications = createAsyncThunk(
  'loanApplications/fetchByUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await loanApplicationAPI.getLoanApplicationsByUserId(userId);
      return response;
    } catch (err) {
      const message = err?.data?.message || err.message || 'Failed to fetch user loan applications';
      return rejectWithValue(message);
    }
  }
);

const loanApplicationSlice = createSlice({
  name: 'loanApplications',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    resetLoanApplications: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all loan applications
      .addCase(fetchLoanApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLoanApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.loanApplications = action.payload.loanApplications || action.payload;
        state.totalPages = action.payload.totalPages || 1;
        state.totalCount = action.payload.totalCount || 0;
      })
      .addCase(fetchLoanApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Approve loan application
      .addCase(approveLoanApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveLoanApplication.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.loanApplications.findIndex(app => app._id === action.payload.id);
        if (index !== -1) {
          state.loanApplications[index].loanStatus = 1; // 1 = Approved
        }
      })
      .addCase(approveLoanApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reject loan application
      .addCase(rejectLoanApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectLoanApplication.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.loanApplications.findIndex(app => app._id === action.payload.id);
        if (index !== -1) {
          state.loanApplications[index].loanStatus = 2; // 2 = Rejected
        }
      })
      .addCase(rejectLoanApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create loan application
      .addCase(createLoanApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLoanApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.loanApplications.unshift(action.payload);
      })
      .addCase(createLoanApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update loan application
      .addCase(updateLoanApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLoanApplication.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.loanApplications.findIndex(app => app._id === action.payload._id);
        if (index !== -1) {
          state.loanApplications[index] = action.payload;
        }
      })
      .addCase(updateLoanApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete loan application
      .addCase(deleteLoanApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLoanApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.loanApplications = state.loanApplications.filter(app => app._id !== action.payload);
      })
      .addCase(deleteLoanApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch user loan applications
      .addCase(fetchUserLoanApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserLoanApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.loanApplications = action.payload.loanApplications || action.payload;
      })
      .addCase(fetchUserLoanApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setFilters, clearError, resetLoanApplications } = loanApplicationSlice.actions;

export default loanApplicationSlice.reducer;

// Selectors
export const selectLoanApplications = (state) => state.loanApplications.loanApplications;
export const selectLoanApplicationsLoading = (state) => state.loanApplications.loading;
export const selectLoanApplicationsError = (state) => state.loanApplications.error;
export const selectLoanApplicationsFilters = (state) => state.loanApplications.filters;
export const selectTotalPages = (state) => state.loanApplications.totalPages;
export const selectTotalCount = (state) => state.loanApplications.totalCount;