const express = require('express');
const {createRequestQuotation, getAllRequestQuotations, deleteRequestQuotation} = require('../controllers/requestQuotationsController');

const router = express.Router();

router.post('/request-quotation', createRequestQuotation);
router.get('/request-quotation', getAllRequestQuotations);
router.delete('/request-quotation/:id', deleteRequestQuotation);

module.exports = router;