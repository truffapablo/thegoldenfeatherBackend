const express = require('express');
const { check } = require('express-validator');
const { searchDataById, advancedSearch } = require('../controllers/search');
const { userAccess } = require('../middlewares/userAccess');
const router = express.Router();
const { validateFields } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJwt');

router.use(validateJWT);
router.use(userAccess);

router.get('/:id', searchDataById);

router.post('/advanced',[
    check('confimation', 'La confirmación debe ser numérica').isNumeric().optional({ checkFalsy: true, nullable:true }),
    check('date', 'La fecha no cumple el formato').isDate().optional({ checkFalsy: true, nullable:true }),
    check('event', 'El evento debe ser de tipo texto').not().isEmpty().optional({ checkFalsy: true, nullable:true }),
    check('lastName','El apellido debe ser de tipo texto').isString().optional({ checkFalsy: true, nullable:true }),
    validateFields

] ,advancedSearch);


module.exports = router;