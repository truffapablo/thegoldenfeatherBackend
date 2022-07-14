const moment = require("moment") ;
const {today}  = require("../helpers/today");
const CustomReservation = require("../models/CustomReservation");
const { types } = require("../types/types");
const validateCustomCompletion = async (req, res, next) => {

    const reservation = await CustomReservation.findById(req.params.id);
    if(!reservation){
        return res.status(404).json({
            ok: false,
            message: `No existe la reservacion con id ${req.params.id}`,
        });
    }

    if(reservation.status !== types.reservationConfirmed){
        return res.status(400).json({
            ok: false,
            message: `El estado debe ser (${types.reservationConfirmed}) para poder confirmar.`,
        });
    }

    /**
     * La fecha de la reserva debe ser <= a la fecha actual.
     * No se puede completar una reserva futuro.
     * Si se puede completar una reserva pasada.
     */

     if(moment(reservation.date).format('YYYY-MM-DD') >= today() ) {
        return res.status(400).json({
            ok: false,
            message: `No se puede completar una reserva con una fecha futura.`,
        });
    }

    next();
}

module.exports = {
    validateCustomCompletion
}