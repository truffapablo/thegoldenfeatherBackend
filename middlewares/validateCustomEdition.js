const CustomReservation = require("../models/CustomReservation");
const { types } = require("../types/types");

const validateCustomEdition = async (req, res, next) => {

    const reservation = await CustomReservation.findById(req.params.id);
    if(!reservation){
        return res.status(404).json({
            ok: false,
            message: `No existe la reservacion con id ${req.params.id}`,
        });
    }

    if(reservation.status === types.reservationCancelled){
        return res.status(400).json({
            ok: false,
            message: 'La reservacion fue cancelada y no puede ser editada',
        });
    }
    
    if(reservation.status === types.reservationCompleted){
        return res.status(400).json({
            ok: false,
            message: 'La reservacion fue completada y no puede ser editada',
        });
    }

    next();

}

module.exports = {
    validateCustomEdition
}
