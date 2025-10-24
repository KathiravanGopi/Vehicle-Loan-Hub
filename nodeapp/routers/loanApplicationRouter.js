const express = require('express');
const router = express.Router();
const upload = require('../multerConfig');
const { getAllLoanApplications, getLoanApplicationsByUserId, getLoanApplicationById, addLoanApplication, updateLoanApplication, deleteLoanApplication } = require('../controllers/loanApplicationController');
const { validateToken } = require('../authUtils');

router.get('/', validateToken,getAllLoanApplications);
router.get('/user', validateToken,getLoanApplicationsByUserId);
router.get('/:id', validateToken,getLoanApplicationById);
router.post('/', validateToken,upload.single('file'), addLoanApplication);
router.put('/:id', validateToken,upload.single('file'), updateLoanApplication);
router.delete('/:id', validateToken,deleteLoanApplication);

module.exports = router;
