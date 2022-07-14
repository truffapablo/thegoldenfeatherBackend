const express = require('express');
const { getLog } = require('../controllers/logs');
const router = express.Router();

const { validateJWT } = require('../middlewares/validateJwt');


router.use(validateJWT);

router.get('/:id', [], getLog);




module.exports = router;