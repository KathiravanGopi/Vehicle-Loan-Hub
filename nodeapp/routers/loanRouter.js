const express = require('express');
const { getAllLoans, getLoanById, addLoan, updateLoan, deleteLoan } = require('../controllers/loanController');
const { validateToken, authorizeRoles } = require('../authUtils');
const router = express.Router();


router.get('/',validateToken,authorizeRoles('admin','user') ,getAllLoans);
router.get('/:id',validateToken,authorizeRoles('admin','user'), getLoanById);
router.post('/',validateToken,authorizeRoles('admin'), addLoan);
router.put('/:id',validateToken,authorizeRoles('admin'), updateLoan);
router.delete('/:id',validateToken,authorizeRoles('admin'), deleteLoan);

module.exports = router;