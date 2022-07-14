const Reservation = require("../models/Reservation");
const { types } = require("../types/types");


const validateConfirmation = async (req, res, next) => {
    
    const reservation = await Reservation.findById(req.params.id);
    if(!reservation){
        return res.status(404).json({
            ok: false,
            message: `No existe la reservacion con id ${req.params.id}`,
        });
    }

    if(reservation.status !== types.reservationPending){
        return res.status(400).json({
            ok: false,
            message: `El estado debe ser (${types.reservationPending}) para poder confirmar.`,
        });
    }

    next();
}

module.exports = {
    validateConfirmation
}