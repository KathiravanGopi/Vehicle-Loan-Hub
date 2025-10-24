import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loanAPI } from '../../config/apiConfig';

const initialState = {
  loans: [],
  loading: false,
  error: null,
  selectedLoan: null
};

// Async thunks for loan operations
export const fetchLoans = createAsyncThunk(
  'loans/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await loanAPI.getAllLoans();
      return response;
    } catch (err) {
      const message = err?.data?.message || err.message || 'Failed to fetch loans';
      return rejectWithValue(message);
    }
  }
);

export const fetchLoanById = createAsyncThunk(
  'loans/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await loanAPI.getLoanById(id);
      return response;
    } catch (err) {
      const message = err?.data?.message || err.message || 'Failed to fetch loan';
      return rejectWithValue(message);
    }
  }
);

export const createLoan = createAsyncThunk(
  'loans/create',
  async (loanData, { rejectWithValue }) => {
    try {
      const response = await loanAPI.addLoan(loanData);
      return response;
    } catch (err) {
      const message = err?.data?.message || err.message || 'Failed to create loan';
      return rejectWithValue(message);
    }
  }
);

export const updateLoan = createAsyncThunk(
  'loans/update',
  async ({ id, loanData }, { rejectWithValue }) => {
    try {
      const response = await loanAPI.updateLoan({ id, loanData });
      return response;
    } catch (err) {
      const message = err?.data?.message || err.message || 'Failed to update loan';
      return rejectWithValue(message);
    }
  }
);

export const deleteLoan = createAsyncThunk(
  'loans/delete',
  async (id, { rejectWithValue }) => {
    try {
      await loanAPI.deleteLoan(id);
      return id;
    } catch (err) {
      const message = err?.data?.message || err.message || 'Failed to delete loan';
      return rejectWithValue(message);
    }
  }
);

const loanSlice = createSlice({
  name: 'loans',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedLoan: (state) => {
      state.selectedLoan = null;

  }
},
  extraReducers: (builder) => {
    builder
      // Fetch all loans
      .addCase(fetchLoans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLoans.fulfilled, (state, action) => {
        state.loading = false;
        state.loans = action.payload.loans || action.payload;
      })
      .addCase(fetchLoans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch loan by ID
      .addCase(fetchLoanById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLoanById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedLoan = action.payload;
      })
      .addCase(fetchLoanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create loan
      .addCase(createLoan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLoan.fulfilled, (state, action) => {
        state.loading = false;
        state.loans.unshift(action.payload);
      })
      .addCase(createLoan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update loan
      .addCase(updateLoan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLoan.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.loans.findIndex(loan => loan._id === action.payload._id);
        if (index !== -1) {
          state.loans[index] = action.payload;
        }
        if (state.selectedLoan && state.selectedLoan._id === action.payload._id) {
          state.selectedLoan = action.payload;
        }
      })
      .addCase(updateLoan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete loan
      .addCase(deleteLoan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLoan.fulfilled, (state, action) => {
        state.loading = false;
        state.loans = state.loans.filter(loan => loan._id !== action.payload);
        if (state.selectedLoan && state.selectedLoan._id === action.payload) {
          state.selectedLoan = null;
        }
      })
      .addCase(deleteLoan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearSelectedLoan } = loanSlice.actions;

export default loanSlice.reducer;

// Selectors
export const selectLoans = (state) => state.loans.loans;
export const selectLoansLoading = (state) => state.loans.loading;
export const selectLoansError = (state) => state.loans.error;
export const selectSelectedLoan = (state) => state.loans.selectedLoan;