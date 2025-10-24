const { formatMongooseError } = require('../authUtils');
const LoanApplication = require('../models/loanApplicationModel');
const fs = require('fs');
const path = require('path');

const getAllLoanApplications = async (req, res) => {
    try {
        const loanApplications = await LoanApplication.find({})            
        res.status(200).json(loanApplications);
    } catch (error) {   
        if (error.name === 'CastError' || error.name === 'ValidationError') {
            const formattedMessage = formatMongooseError(error);
            res.status(400).json({ message: formattedMessage });
        } else {
            res.status(500).json({ message: error.message});
        }
    }
};

const getLoanApplicationsByUserId = async (req, res) => {
    try {
        const {userId} = req.user || req.params
        const loanApplications = await LoanApplication.find({ userId });
        res.status(200).json(loanApplications);
    } catch (error) {
        if (error.name === 'CastError' || error.name === 'ValidationError') {
            const formattedMessage = formatMongooseError(error);
            res.status(400).json({ message: formattedMessage });
        } else {
            res.status(500).json({ message: error.message});
        }
    }
};

const getLoanApplicationById = async (req, res) => {
    try {
        const { id } = req.params;
        const loanApplication = await LoanApplication.findById(id);
        
        if (loanApplication) {
            res.status(200).json(loanApplication);
        } else {
            res.status(404).json({ message: "Cannot find any loan" });
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

const addLoanApplication = async (req, res) => {
    try {
        const applicationData = {
            ...req.body,
        };

        if (req.file && typeof req.file.filename === 'string') {
            applicationData.file = req.file.filename;
        } else if (typeof req.body.file === 'string') {
            applicationData.file = req.body.file;
        }

        console.log('Multer file:', req.file);
        
        await LoanApplication.create(applicationData);
        res.status(200).json({ message: "Added Successfully" });
    } catch (error) {
        if (error.name === 'CastError' || error.name === 'ValidationError') {
            const formattedMessage = formatMongooseError(error);
            console.log(error);
            res.status(400).json({ message: formattedMessage });
        } else {
            res.status(500).json({ message: error.message});
        }
    }
};

const updateLoanApplication = async (req, res) => {
    try {
        const { id } = req.params;
        
        // If a new file is uploaded, delete the old file
        if (req.file) {
            const existingApplication = await LoanApplication.findById(id);
            if (existingApplication && existingApplication.file) {
                const oldFilePath = path.join(__dirname, '../uploads', existingApplication.file);
                if (fs.existsSync(oldFilePath)) {
                    try {
                        fs.unlinkSync(oldFilePath);
                        console.log(`Old file ${existingApplication.file} deleted successfully`);
                    } catch (fileError) {
                        console.error(`Error deleting old file ${existingApplication.file}:`, fileError);
                    }
                }
            }
        }
        
        const updateData = {
            ...req.body,
            ...(req.file && { file: req.file.filename })
        };
        const loanApplication = await LoanApplication.findByIdAndUpdate(id, updateData);
        
        if (loanApplication) {
            res.status(200).json({ message: "Loan application updated successfully" });
        } else {
            res.status(404).json({ message: "Loan application not found" });
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

const deleteLoanApplication = async (req, res) => {
    try {
        const { id } = req.params;
        
        // First find the loan application to get the file name
        const loanApplication = await LoanApplication.findById(id);
        
        if (!loanApplication) {
            return res.status(404).json({ message: "Loan application not found" });
        }

        // Delete the file from the server if it exists
        if (loanApplication.file) {
            const filePath = path.join(__dirname, '../uploads', loanApplication.file);
            
            // Check if file exists before trying to delete
            if (fs.existsSync(filePath)) {
                try {
                    fs.unlinkSync(filePath);
                    console.log(`File ${loanApplication.file} deleted successfully`);
                } catch (fileError) {
                    console.error(`Error deleting file ${loanApplication.file}:`, fileError);
                    // Continue with deletion even if file deletion fails
                }
            }
        }

        // Delete the loan application from database
        await LoanApplication.findByIdAndDelete(id);
        res.status(200).json({ message: "Loan application and associated file deleted successfully" });
        
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
    getAllLoanApplications,
    getLoanApplicationsByUserId,
    getLoanApplicationById,
    addLoanApplication,
    updateLoanApplication,
    deleteLoanApplication
};
