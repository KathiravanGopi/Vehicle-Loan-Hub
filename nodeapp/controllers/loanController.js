const { formatMongooseError } = require('../authUtils');
const Loan = require('../models/loanModel');

const getAllLoans = async (req, res) => {
    try {
        const loans = await Loan.find({});
        res.status(200).json(loans);
    } catch (error) {
        if (error.name === 'CastError' || error.name === 'ValidationError') {
            const formattedMessage = formatMongooseError(error);
            res.status(400).json({ message: formattedMessage });
        } else {
            res.status(500).json({ message: error.message});
        }
    }
};

const getLoanById = async (req, res) => {
    try {
        const { id } = req.params;
        const loan = await Loan.findById(id);
        
        if (loan) {
            res.status(200).json(loan);
        } else {
            res.status(404).json({ message: "Loan not found" });
        }
    } catch (error) {
        if (error.name === 'CastError' || error.name === 'ValidationError') {
            const formattedMessage = formatMongooseError(error);
            res.status(400).json({ message: formattedMessage });
        } else {
            res.status(500).json({ message: error.message});
        }
    }
};

const addLoan = async (req, res) => {
    try {
        await Loan.create(req.body);
        res.status(200).json({ message: "Loan added successfully" });
    } catch (error) {
        if (error.name === 'CastError' || error.name === 'ValidationError') {
            const formattedMessage = formatMongooseError(error);
            res.status(400).json({ message: formattedMessage });
        } else {
            res.status(500).json({ message: error.message});
        }
    }
};

const updateLoan = async (req, res) => {
    try {
        const { id } = req.params;
        const loan = await Loan.findByIdAndUpdate(id, req.body);
        
        if (loan) {
            res.status(200).json({ message: "Loan updated successfully" });
        } else {
            res.status(404).json({ message: "Loan not found" });
        }
    } catch (error) {
        if (error.name === 'CastError' || error.name === 'ValidationError') {
            const formattedMessage = formatMongooseError(error);
            res.status(400).json({ message: formattedMessage });
        } else {
            res.status(500).json({ message: error.message});
        }
    }
};

const deleteLoan = async (req, res) => {
    try {
        const { id } = req.params;
        const loan = await Loan.findByIdAndDelete(id);
        
        if (loan) {
            res.status(200).json({ message: "Loan deleted successfully" });
        } else {
            res.status(404).json({ message: "Loan not found" });
        }
    } catch (error) {
        if (error.name === 'CastError' || error.name === 'ValidationError') {
            const formattedMessage = formatMongooseError(error);
            res.status(400).json({ message: formattedMessage });
        } else {
            res.status(500).json({ message: error.message});
        }
    }
};

module.exports = {
    getAllLoans,
    getLoanById,
    addLoan,
    updateLoan,
    deleteLoan
};