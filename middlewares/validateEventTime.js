const moment = require('moment');
const Event = require("../models/Event");

const validateEventTime = async (req, res, next) => {

    const {event, time, date} = req.body;
    const dbEvent = await Event.findById(event);

    if(date < moment().format('YYYY-MM-DD')) {
        return res.status(400).json({
            ok: false,
            message: 'No se puede hacer una reserva con una fecha pasada.',
        });
    }
    

    if (!dbEvent) {
        return res.status(400).json({
            ok: false,
            message: 'El evento no existe',
        });
    }
    
    if(time !== dbEvent.start){
        console.log('Los horarios no coinciden', time, dbEvent.start);
        return res.status(400).json({
            ok: false,
            message: 'El evento no coincide con el horario',
        });
    }

    next();


}

module.exports = {
    validateEventTime
}