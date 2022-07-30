const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { isDate } = require('moment');
const { getTodayReport, getReportByDate, getReportsByMonth } = require('../controllers/reports');
const { userAccess } = require('../middlewares/userAccess');
const { validateFields } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJwt');

router.use(validateJWT);
router.use(userAccess);


router.get('/', [], getTodayReport);

router.get('/:uid', [], getTodayReport);


router.post('/date', [
    check('from', 'La fecha es obligatoria').isDate(),
    check('to', 'La fecha es obligatoria').isDate(),
    validateFields
], getReportByDate);



router.post('/month', [

    check('month', 'El número del mes es obligatorio y debe ser entre 1 y 12').isInt({min:1, max:12}),
    validateFields

], getReportsByMonth);



module.exports = router;