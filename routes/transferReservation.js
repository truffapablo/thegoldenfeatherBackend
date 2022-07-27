const express = require('express');
const router = express.Router();
const { validateFields } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJwt');
const { check } = require('express-validator');
const { getTransferReservations, createTransferReservation, updateTransferReservation, confirmTransferReservation, cancelTransferReservation, completeTransferReservation } = require('../controllers/transferReservation');
const { validateTransferConfirmation } = require('../middlewares/validateTransferConfirmation');
const { validateTransferEdition } = require('../middlewares/validateTransferEdition');
const { validateTransferCancelation } = require('../middlewares/validateTransferCancelation');
const { userAccess } = require('../middlewares/userAccess');
const { validateDate } = require('../middlewares/validateDate');

router.use(validateJWT);
router.use(userAccess);

router.get('/', getTransferReservations);

router.post('/', [
    check('origin').not().isEmpty().withMessage('El origen es obligatorio'),
    check('destination').not().isEmpty().withMessage('El destino es obligatorio'),
    check('date', 'La fecha es obligatoria').isDate(),
    check('time', 'El horario es obligatorio').matches(/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/),
    check('price').isNumeric().withMessage('El precio es obligatorio'),
    check('commission').isNumeric().withMessage('La comisión es obligatoria'),
    check('firstName').not().isEmpty().withMessage('El nombre es obligatorio'),
    check('lastName').not().isEmpty().withMessage('El apellido es obligatorio'),
    //check('email', 'Debe ser un email válido').isEmail().optional({ checkFalsy: true, nullable:true }),
    check('email', 'Debe ser un email válido').isEmail(),
    check('phone', 'Debe ser un número de telefono').isNumeric().optional({ checkFalsy: true, nullable:true }),
    check('peopleQuantity').not().isEmpty().withMessage('La cantidad de personas es requerida').isNumeric(),
    check('roomNumber').not().isEmpty().withMessage('El numero de habitación es obligatorio').isNumeric(),
    check('information', 'La información debe tener un mínimo de 10 caracteres y máximo de 500').isLength({ min:10, max:500 }).optional({ checkFalsy: true, nullable:true }),
    
    validateFields,
    validateDate

], createTransferReservation);

router.put('/:id', [

    check('origin').not().isEmpty().withMessage('El origen es obligatorio'),
    check('destination').not().isEmpty().withMessage('El destino es obligatorio'),
    check('date', 'La fecha es obligatoria').isDate(),
    check('time', 'El horario es obligatorio').matches(/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/),
    check('price').isNumeric().withMessage('El precio es obligatorio'),
    check('commission').isNumeric().withMessage('La comisión es obligatoria'),
    check('firstName').not().isEmpty().withMessage('El nombre es obligatorio'),
    check('lastName').not().isEmpty().withMessage('El apellido es obligatorio'),
    //check('email', 'Debe ser un email válido').isEmail().optional({ checkFalsy: true, nullable:true }),
    check('email', 'Debe ser un email válido').isEmail(),
    check('phone', 'Debe ser un número de telefono').isNumeric().optional({ checkFalsy: true, nullable:true }),
    check('peopleQuantity').not().isEmpty().withMessage('La cantidad de personas es requerida').isNumeric(),
    check('roomNumber').not().isEmpty().withMessage('El numero de habitación es obligatorio').isNumeric(),
    check('information', 'La información debe tener un mínimo de 10 caracteres y máximo de 500').isLength({ min:10, max:500 }).optional({ checkFalsy: true, nullable:true }),
    
    validateFields,
    validateDate

], updateTransferReservation);

router.patch('/:id/confirm',[
    validateTransferConfirmation,
] ,confirmTransferReservation);
router.patch('/:id/complete', [
    validateTransferEdition,
],completeTransferReservation);

router.delete('/:id',[
    validateTransferCancelation,
], cancelTransferReservation);


module.exports = router;


