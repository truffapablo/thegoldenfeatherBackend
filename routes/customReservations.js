const express = require('express');
const router = express.Router();



const { validateFields } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJwt');

const { check } = require('express-validator');
const { createCustomReservation, getCustomReservations, cancelCustomReservation, updateCustomReservation, confirmCustomReservation, completeCustomReservation } = require('../controllers/customReservations');
const { validateCustomConfirmation } = require('../middlewares/validateCustomConfirmation');
const { validateCustomCompletion } = require('../middlewares/validateCustomCompletion');
const { validateCustomEdition } = require('../middlewares/validateCustomEdition');
const { validateCustomCancelation } = require('../middlewares/validateCustomCancelation');
const { userAccess } = require('../middlewares/userAccess');

router.use(validateJWT);
router.use(userAccess);

router.get('/', getCustomReservations);

router.post('/',[
    check('firstName', 'El nombre es obligatorio').not().isEmpty(),
    check('lastName', 'El nombre es obligatorio').not().isEmpty(),
    check('event', 'El evento es obligatorio').not().isEmpty(),
    check('price', 'El precio debe ser numérico ').isNumeric().optional({ checkFalsy: true, nullable:true }),
    check('commission', 'La comisión debe ser numérica').isNumeric(),
    check('date', 'La fecha es obligatoria').isDate(),
    check('time', 'El horario es obligatorio').matches(/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/),
    check('phone', 'Debe ser un número de telefono').isNumeric().optional({ checkFalsy: true, nullable:true }),
    check('email', 'Debe ser un email válido').isEmail().optional({ checkFalsy: true, nullable:true }),
    check('peopleQuantity', 'La cantidad de personas es obligatoria').isNumeric(),
    check('roomNumber', 'El numero de habitación es obligatorio').isNumeric(),
    validateFields,
], createCustomReservation);

router.put('/:id',[
    check('firstName', 'El nombre es obligatorio').not().isEmpty(),
    check('lastName', 'El nombre es obligatorio').not().isEmpty(),
    check('event', 'El evento es obligatorio').not().isEmpty(),
    check('price', 'El precio debe ser numérico').isNumeric().optional({ checkFalsy: true, nullable:true }),
    check('commission', 'La comisión debe ser numérica').isNumeric(),
    check('date', 'La fecha es obligatoria').isDate(),
    check('time', 'El horario es obligatorio').matches(/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/),
    check('phone', 'Debe ser un número de telefono').isNumeric().optional({ checkFalsy: true, nullable:true }),
    check('email', 'Debe ser un email válido').isEmail().optional({ checkFalsy: true, nullable:true }),
    check('peopleQuantity', 'La cantidad de personas es obligatoria').isNumeric(),
    check('roomNumber', 'El numero de habitación es obligatorio').isNumeric(),
    validateFields,
    validateCustomEdition
], updateCustomReservation);

router.patch('/:id/confirm', [
    validateCustomConfirmation
], confirmCustomReservation );

router.patch('/:id/complete', [
    validateCustomCompletion
], completeCustomReservation );

router.delete('/:id', [
    validateCustomCancelation,
],cancelCustomReservation);

module.exports = router;