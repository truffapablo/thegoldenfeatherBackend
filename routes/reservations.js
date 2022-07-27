const express = require('express');
const router = express.Router();

const {getReservations, createReservation, updateReservation, cancelReservation, confirmReservation, completeReservation } = require('../controllers/reservations');

const { validateFields } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJwt');

const { check } = require('express-validator');
const { validateEventTime } = require('../middlewares/validateEventTime');
const { validateEdition } = require('../middlewares/validateEdition');
const { validateConfirmation } = require('../middlewares/validateConfirmation');
const { validateCompletion } = require('../middlewares/validateCompletion');
const { validateCancelation } = require('../middlewares/validateCancelation');
const { isAdmin } = require('../middlewares/isAdmin');
const { changePassword } = require('../middlewares/changePassword');
const { userAccess } = require('../middlewares/userAccess');
const { validateDate } = require('../middlewares/validateDate');


/**
 * Validar todas las rutas con JWT
 * IMPORTANTE, si una ruta esta por encima del middleware no solicitara JWT.
 * router.get('/', getReservations); -> No solicitara JWT
 * router.use(validateJWT);
 * router.get('/', getReservations); -> Solicitara JWT
 */
router.use(validateJWT);
router.use(userAccess);

router.get('/', getReservations);

router.post('/',[
    check('firstName', 'El nombre es obligatorio').not().isEmpty(),
    check('lastName', 'El nombre es obligatorio').not().isEmpty(),
    check('event', 'El evento es obligatorio').not().isEmpty(),
    check('date', 'La fecha es obligatoria').isDate(),
    check('phone', 'Debe ser un número de telefono').isNumeric().optional({ checkFalsy: true, nullable:true }),
    check('email', 'Debe ser un email válido').isEmail(),
    check('peopleQuantity', 'La cantidad de personas es obligatoria').isNumeric(),
    check('roomNumber', 'El numero de habitación es obligatorio').isNumeric(),
    
    validateFields,
    validateEventTime,
    validateDate
], createReservation);


router.put('/:id',[
    check('firstName', 'El nombre es obligatorio').not().isEmpty(),
    check('lastName', 'El nombre es obligatorio').not().isEmpty(),
    check('event', 'El evento es obligatorio').not().isEmpty(),
    check('date', 'La fecha es obligatoria').isDate(),
    check('phone', 'Debe ser un número de telefono').isNumeric().optional({ checkFalsy: true, nullable:true }),
    check('email', 'Debe ser un email válido').isEmail(),
    check('roomNumber', 'El numero de habitación es obligatorio').isNumeric(),
    validateFields,
    validateEventTime,
    validateEdition,
    validateDate
    
], updateReservation);

router.patch('/:id/confirm', [
    validateConfirmation
],confirmReservation );

router.patch('/:id/complete',[
    validateCompletion
],completeReservation );

router.delete('/:id', [
    validateCancelation,
], cancelReservation); 



module.exports = router;



