const express = require('express');
const router = express.Router();

const { resetDB } = require('../controllers/db');
const { isAdmin } = require('../middlewares/isAdmin');
const { validateJWT } = require('../middlewares/validateJwt');

//router.use(validateJWT);

router.get('/reset', [
    //isAdmin
],resetDB);

module.exports = router;