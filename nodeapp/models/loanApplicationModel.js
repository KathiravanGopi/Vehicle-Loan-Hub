const mongoose = require('mongoose');

const LoanApplicationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'User ID is required'],
    },
    userName: {
        type: String,
        required: [true, 'User name is required'],
    },
    loanType: {
        type: String,
        required: [true, 'Loan type is required'],
    },
    submissionDate: {
        type: Date,
        required: [true, 'Submission date is required'],
    },
    income: {
        type: Number,
        required: [true, 'Income is required'],
        min: [1000, 'Income must be at least 1000']
    },
    model: {
        type: Date,
        required: [true, 'Model date is required'],
    },
    purchasePrice: {
        type: Number,
        required: [true, 'Purchase price is required'],
        min: [1000, 'Purchase price must be at least 1000']
    },
    loanStatus: {
        type: Number,
        required: [true, 'Loan status is required'],
        enum: {
            values: [0, 1, 2], 
            message: 'Loan status must be 0 (Pending), 1 (Approved), or 2 (Rejected)'
        }
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        minlength: [10, 'Address must be at least 10 characters long'],
        maxlength: [200, 'Address must be at most 200 characters long']
    },
    file: {
        type: String,
        required: [true, 'File path or name is required'],
        match: [/^[\w,/.\s-]+\.[A-Za-z]{2,4}$/, 'Invalid file format']
    }
});

module.exports = mongoose.model('LoanApplication', LoanApplicationSchema);