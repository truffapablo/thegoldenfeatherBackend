const TransferReservation = require("../models/TransferReservation");
const { types } = require("../types/types");

const validateTransferCancelation = async (req, res, next) => {
    const reservation = await TransferReservation.findById(req.params.id);
    if (!reservation) {
        return res.status(404).json({
            ok: false,
            message: `No existe la reservacion con id ${req.params.id}`,
        });
    }

    if (reservation.status === types.reservationCompleted) {
        return res.status(400).json({
            ok: false,
            message: 'La reservacion fue completada y no puede ser cancelada',
        });
    }

    next();
}

module.exports = { validateTransferCancelation }