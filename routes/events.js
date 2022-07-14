const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const {getEvents, createEvent, updateEvent, deleteEvent} = require('../controllers/events');
const { isAdmin } = require('../middlewares/isAdmin');
const { userAccess } = require('../middlewares/userAccess');
const { validateFields } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJwt');


/**
 * Validar todas las rutas con JWT
 * IMPORTANTE, si una ruta esta por encima del middleware no solicitara JWT.
 * router.get('/', getEvents); -> No solicita JWT
 * router.use(validateJWT);
 * router.get('/', getEvents); -> Solicita JWT
 */
router.use(validateJWT);
router.use(userAccess);

router.get('/', getEvents);

router.post('/',[
    check('title', 'El titulo es obligatorio').not().isEmpty().isLength({min: 2, max: 500}),
    check('description', 'La descripción es obligatoria').not().isEmpty(),
    check('price', 'El precio es obligatorio').isNumeric().not().isEmpty(),
    check('commission', 'La comisión debe ser numérica').isNumeric(),
    check('currency', 'La moneda es obligatoria').not().isEmpty().isLength({ min: 3, max:5 }),
    check('schedule', 'El cronograma es obligatorio').not().isEmpty(),
    check('start', 'El horario es obligatorio').matches(/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/),
    check('end', 'El horario es obligatorio').matches(/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/),
    check('location','La ubicación es obligatoria').not().isEmpty(),
    check('address', 'La dirección es obligatoria').not().isEmpty(),
    check('city', 'La ciudad es obligatoria').not().isEmpty(),
    validateFields,
    isAdmin
], createEvent);

router.put('/:id',[
    check('title', 'El nombre es obligatorio').not().isEmpty().isLength({ min: 2, max:500 }),
    check('description', 'La descripción es obligatoria').not().isEmpty(),
    check('price', 'El precio es obligatorio').isNumeric().not().isEmpty(),
    check('commission', 'La comisión debe ser numérica').isNumeric(),
    check('currency', 'La moneda es obligatoria').not().isEmpty().isLength({ min: 3, max:5 }),
    check('schedule', 'El cronograma es obligatorio').not().isEmpty(),
    check('start', 'El horario es obligatorio').matches(/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/),
    check('end', 'El horario es obligatorio').matches(/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/),
    check('location','La ubicación es obligatoria').not().isEmpty(),
    check('address', 'La dirección es obligatoria').not().isEmpty(),
    check('city', 'La ciudad es obligatoria').not().isEmpty(),
    validateFields,
    isAdmin
], updateEvent);

router.delete('/:id', [
    isAdmin
],deleteEvent); 

module.exports = router;
