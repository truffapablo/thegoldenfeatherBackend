const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { getTodayReport, getReportByDate, getReportsByMonth } = require('../controllers/reports');
const { userAccess } = require('../middlewares/userAccess');
const { validateFields } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJwt');

router.use(validateJWT);
router.use(userAccess);


router.get('/', [], getTodayReport);
router.post('/date', [], getReportByDate);
router.post('/month', [], getReportsByMonth);



module.exports = router;