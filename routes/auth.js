const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const { createUser, loginUser, reValidateToken, changeUserPassword, grantAccess, denyAccess, forceToChangePassword, setTemporaryPassword } = require('../controllers/auth');
const { getUsers } = require('../controllers/user');
const { isAdmin } = require('../middlewares/isAdmin');
const { userAccess } = require('../middlewares/userAccess');
const { validateFields } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJwt');

router.post('/', [
    //Middleware
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria y debe tener minimamente 6 caracteres').isLength({ min: 6 }),
    validateFields
], loginUser);

router.put('/reset-password', [
    check('oldPassword','Debe ingresar la contraseña actual con un mínimo de 6 caracteres').isLength({ min: 6 }),
    check('newPassword','Debe ingresar la contraseña nueva con un mínimo de 6 caracteres').isLength({ min: 6 }),
    
    validateFields,
    validateJWT,
    userAccess
] ,changeUserPassword);

router.post('/new',[
    //Middleware
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria y debe tener minimamente 6 caracteres').isLength({ min: 6 }),
    
    validateFields,
    validateJWT,
    isAdmin

], createUser);

router.get('/renew', validateJWT, reValidateToken);

router.get('/users', [
    validateJWT,
    isAdmin
], getUsers)

router.patch('/grant-access/:id',[
    validateJWT,
    isAdmin
],grantAccess);

router.patch('/deny-access/:id',[
    validateJWT,
    isAdmin
],denyAccess);

router.patch('/force-change-password/:id',[
    validateJWT,
    isAdmin
],forceToChangePassword);

router.put('/temporary-password/:id',[

    check('password', 'La contraseña es obligatoria y debe tener minimamente 6 caracteres').isLength({ min: 6 }),

    validateFields,
    validateJWT,
    isAdmin
],setTemporaryPassword);


module.exports = router;