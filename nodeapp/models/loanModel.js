const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
    loanType: {
        type: String,
        required: [true, 'Loan type is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    interestRate: {
        type: Number,
        required: [true, 'Interest rate is required'],
        min: [0, 'Interest rate must be a positive number'],
        max: [100, 'Interest rate cannot exceed 100%']
    },
    maximumAmount: {
        type: Number,
        required: [true, 'Maximum amount is required'],
        min: [1000,"Maximum amount should be at least 1000"]
    }
});

module.exports = mongoose.model('Loan', LoanSchema);