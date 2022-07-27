
const moment = require('moment');

const validateDate = async (req, res, next) => {

    const { date } = req.body;

    if(date < moment().format('YYYY-MM-DD')) {
        return res.status(400).json({
            ok: false,
            message: 'No se puede hacer una reserva con una fecha pasada.',
        });
    }

    next();
}



module.exports = {
    validateDate
}