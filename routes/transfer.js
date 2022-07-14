const express = require('express');
const router = express.Router();

const { validateFields } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJwt');

const { check } = require('express-validator');
const { getTransfers, createTransfer, updateTransfer, deleteTransfer } = require('../controllers/transfer');
const { isAdmin } = require('../middlewares/isAdmin');
const { userAccess } = require('../middlewares/userAccess');


router.use(validateJWT);
router.use(userAccess);

router.get('/', getTransfers);

router.post('/', [
    check('origin').not().isEmpty().withMessage('El origen es requerido').isLength({min: 3, max: 300}),
    check('destination').not().isEmpty().withMessage('El destino es requerido').isLength({min: 3, max: 300}),
    check('price').not().isEmpty().withMessage('El precio es requerido').isNumeric(),
    check('commission').not().isEmpty().withMessage('La comisión es requerida').isNumeric(),
    
    validateFields,
    isAdmin
],createTransfer);

router.put('/:id', [
    check('origin').not().isEmpty().withMessage('El origen es requerido').isLength({min: 3, max: 300}),
    check('destination').not().isEmpty().withMessage('El destino es requerido').isLength({min: 3, max: 300}),
    check('price').not().isEmpty().withMessage('El precio es requerido').isNumeric(),
    check('commission').not().isEmpty().withMessage('La comisión es requerida').isNumeric(),
    
    validateFields,
    isAdmin

],updateTransfer);

router.delete('/:id',[
    isAdmin
] ,deleteTransfer);


module.exports = router;