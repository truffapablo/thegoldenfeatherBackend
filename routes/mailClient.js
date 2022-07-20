const express = require('express');
const { check } = require('express-validator');
const { mailToClient } = require('../controllers/mailClient');
const { userAccess } = require('../middlewares/userAccess');
const { validateFields } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJwt');
const router = express.Router();

router.use(validateJWT);
router.use(userAccess);

router.post('/', [
    check('pattern', 'El patron de reserva es obligatorio').not().isEmpty(),
    check('id', 'El id es obligatorio').not().isEmpty(),
    validateFields,
], mailToClient);




module.exports = router;