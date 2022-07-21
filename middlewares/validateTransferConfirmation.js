
const TransferReservation = require("../models/TransferReservation");
const { types } = require("../types/types");


const validateTransferConfirmation = async (req, res, next) => {
    
    const reservation = await TransferReservation.findById(req.params.id);
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
    validateTransferConfirmation
}