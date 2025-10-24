import axios from 'axios';
export const API_BASE_URL = "http://localhost:8080";

const apiClient = axios;

if (apiClient) {
    if (apiClient.defaults) {
        apiClient.defaults.baseURL = API_BASE_URL;
        apiClient.defaults.headers = apiClient.defaults.headers || {};
        apiClient.defaults.headers.common = apiClient.defaults.headers.common || {};
        // Do not force a global Content-Type; set it conditionally in interceptors
        apiClient.defaults.timeout = 10000; 
    } else {
        apiClient.defaults = {
            baseURL: API_BASE_URL,
            // Do not set a global Content-Type here; will be applied per-request
            headers: { common: {} },
            timeout: 10000
        };
    }
}

// Export the configured axios instance
export { apiClient };

// Request interceptor - adds token to every request
if (typeof apiClient?.interceptors?.request?.use === 'function') {
    apiClient.interceptors.request.use(
        (config) => {
            const token = sessionStorage.getItem('token');
            if (token) {
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${token}`;
            }

            // Handle FormData and JSON bodies correctly
            const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData;

            if (isFormData && config.headers['Content-Type']) {
                delete config.headers['Content-Type'];
            } else if (!isFormData && !config.headers['Content-Type']) {
                config.headers['Content-Type'] = 'application/json';
            }

            return config;
        },
        (error) => Promise.reject(error)
    );
} else if (!apiClient?.interceptors) {
    // Safe fallback if axios is mocked without interceptors
    apiClient.interceptors = { request: { use: () => {} } };
}

// Response interceptor - handles common errors
if (typeof apiClient?.interceptors?.response?.use === 'function') {
    apiClient.interceptors.response.use(
        (response) => response,
        (error) => {
            const { status } = error?.response || {};

            if (status === 401) {
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('user');
            } else if (status === 403) {
                console.error('Access forbidden');
                error.response.data = { ...(error.response.data || {}), message: 'Access forbidden' };
            } else if (status >= 500) {
                console.error('Server error occurred');
            }

            return Promise.reject(error.response || error);
        }
    );
} else if (!apiClient?.interceptors) {
    apiClient.interceptors = { response: { use: () => {} } };
}

// Auth API endpoints
export const authAPI = {
    // POST /login
    login: async (credentials) => {
        try {
            const response = await apiClient.post('/login', credentials);
            return response;
        } catch (error) {
            console.error('Error in login API:', error);
            if (error?.response) throw error.response;
            throw error;
        }
    },

    // POST /signup
    signup: async (userData) => {
        try {
            const response = await apiClient.post('/signup', userData);
            return response;
        } catch (error) {
            console.error('Error in signup API:', error);
            if (error?.response) throw error.response;
            throw error;
        }
    },

    // POST /forgot-password
    forgotPassword: async (email) => {
        try {
            const response = await apiClient.post('/forgot-password', { email });
            return response.data;
        } catch (error) {
            console.error('Error in forgot password API:', error);
            if (error?.response) throw error.response;
            throw error;
        }
    },

    // POST /reset-password
    resetPassword: async ({ email, newPassword }) => {
        try {
            const response = await apiClient.post('/reset-password', { email, newPassword });
            return response.data;
        } catch (error) {
            console.error('Error in reset password API:', error);
            if (error?.response) throw error.response;
            throw error;
        }
    }
};

// For backward compatibility
export const resetPasswordAPI = authAPI.resetPassword;

// Loan API endpoints
export const loanAPI = {
    // GET /loans
    getAllLoans: async () => {
        try {
            const response = await apiClient.get('/loans');
            return response.data;
        } catch (error) {
            console.error('Error fetching all loans:', error);
            throw error;
        }
    },

    // GET /loans/:id
    getLoanById: async (id) => {
        try {
            const response = await apiClient.get(`/loans/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching loan by ID:', error);
            throw error;
        }
    },

    // POST /loans
    addLoan: async (loanData) => {
        try {
            const response = await apiClient.post('/loans', loanData);
            return response.data;
        } catch (error) {
            console.error('Error adding loan:', error);
            throw error;
        }
    },

    // PUT /loans/:id
    updateLoan: async ({ id, loanData }) => {
        try {
            const response = await apiClient.put(`/loans/${id}`, loanData);
            return response.data;
        } catch (error) {
            console.error('Error updating loan:', error);
            throw error;
        }
    },

    // DELETE /loans/:id
    deleteLoan: async (id) => {
        try {
            const response = await apiClient.delete(`/loans/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting loan:', error);
            throw error;
        }
    }
};

// Loan Application API endpoints
export const loanApplicationAPI = {
    // GET /loanApplication
    getAllLoanApplications: async () => {
        try {            
            const response = await apiClient.get('/loanApplication');
            return response.data;
        } catch (error) {
            console.error('Error fetching loan applications:', error);
            throw error;
        }
    },

    // GET /loanApplication/user/:userId
    getLoanApplicationsByUserId: async (userId) => {
        try {
            const response = await apiClient.get(`/loanApplication/user`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user loan applications:', error);
            throw error;
        }
    },

    // GET /loanApplication/:id
    getLoanApplicationById: async (id) => {
        try {
            const response = await apiClient.get(`/loanApplication/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching loan application by ID:', error);
            throw error;
        }
    },

    // POST /loanApplication
    addLoanApplication: async (applicationData) => {
        try {
            const response = await apiClient.post('/loanApplication', applicationData);
            return response.data;
        } catch (error) {
            console.error('Error adding loan application:', error);
            throw error;
        }
    },

    // PUT /loanApplication/:id
    updateLoanApplication: async ({ id, applicationData }) => {
        try {
            const response = await apiClient.put(`/loanApplication/${id}`, applicationData);
            return response.data;
        } catch (error) {
            console.error('Error updating loan application:', error);
            throw error;
        }
    },

    // DELETE /loanApplication/:id
    deleteLoanApplication: async (id) => {
        try {
            const response = await apiClient.delete(`/loanApplication/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting loan application:', error);
            throw error;
        }
    },

    // Approve loan request (updates loanStatus)
    approveLoanRequest: async (id) => {
        try {
            const response = await apiClient.put(`/loanApplication/${id}`, { loanStatus: 1 });
            return response.data;
        } catch (error) {
            console.error('Error approving loan application:', error);
            throw error;
        }
    },

    // Reject loan request (updates loanStatus)
    rejectLoanRequest: async (id) => {
        try {
            const response = await apiClient.put(`/loanApplication/${id}`, { loanStatus: 2 });
            return response.data;
        } catch (error) {
            console.error('Error rejecting loan application:', error);
            throw error;
        }
    }
};

export default apiClient;
