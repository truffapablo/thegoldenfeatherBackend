const express = require('express');
const { check } = require('express-validator');
const { getReservationStatus, createReservationStatus } = require('../controllers/reservationStatus');
const { isAdmin } = require('../middlewares/isAdmin');
const { validateFields } = require('../middlewares/validateFields');
const router = express.Router();

const { validateJWT } = require('../middlewares/validateJwt');


router.use(validateJWT);

router.get('/', getReservationStatus);

router.post('/',[
    check('name', 'El nombre del estado es obligatorio').not().isEmpty(),
    validateFields,
    isAdmin
], createReservationStatus);

module.exports = router;