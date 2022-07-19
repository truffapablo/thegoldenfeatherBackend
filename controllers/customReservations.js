const { response } = require("express");
const { types } = require("../types/types");
const Log = require("../models/Log");
const CustomReservation = require("../models/CustomReservation");
const { trackChanges } = require("../helpers/trackChanges");
const { iniDay, endDay, today } = require("../helpers/today");




const getCustomReservations = async (req, res = response) => {


    try {
        const reservations = await CustomReservation.find({date: {$eq:today()}})
        .populate('user', 'name')
        
        if (reservations.length === 0) {
            return res.status(201).json({
                ok: false,
                message: 'No hay reservaciones',
            });
        }
        res.status(200).json({
            ok: true,
            reservations
        });

    }catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error, contacte a su administrador',
        });
        
    }
}


const createCustomReservation = async (req, res = response) => {
    try {
        
        const reservation = new CustomReservation(req.body);
        reservation.user = req.uid;
        reservation.status = types.reservationPending;
        reservation.confirmation = new Date().getTime();
        await reservation.save();
        
        const createdReservation = await CustomReservation.findById(reservation._id)
        .populate('user', 'name');
        
        const log = new Log({
            user: req.uid,
            action: types.reservationPending,
            reservation: reservation._id,
            date: new Date().toLocaleString(),
        });
        await log.save();
        
        res.status(201).json({
            ok: true,
            message: 'Reservacion personalizada creada',
            reservation: createdReservation,
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error, contacte a su administrador',
            err: error.message
        });
    }
    
}

const updateCustomReservation = async (req, res = response) => {
    
    try {

        const newReservation = {
            ...req.body,
            user: req.uid,
        }

        const updatedReservation = await CustomReservation.findByIdAndUpdate(req.params.id, newReservation, { new: true })
        .populate('user', 'name')

        if (!updatedReservation) {
            return res.status(404).json({
                ok: false,
                message: `No existe la reservacion con id ${req.params.id}`,
            });
        }
        

        const log = new Log({
            user: req.uid,
            action: types.reservationUpdated,
            reservation: updatedReservation._id,
            date: new Date().toLocaleString(),
        });
        await log.save();

        res.status(200).json({
            ok: true,
            message: 'Reservacion personalizada actualizada',
            reservation: updatedReservation,
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error, contacte a su administrador',
        });
    }
    
}

const confirmCustomReservation = async (req, res = response) => {
        
    try {
        

        const newReservation = {
            ...req.body,
            user: req.uid,
            status: types.reservationConfirmed,
        }

        const updatedReservation = await CustomReservation.findByIdAndUpdate(req.params.id, newReservation, { new: true })
        .populate('user', 'name')
        .populate('event',['title','price','currency']);

        if (!updatedReservation) {
            return res.status(404).json({
                ok: false,
                message: `No existe la reservacion con id ${req.params.id}`,
            });
        }

        const log = new Log({
            user: req.uid,
            action: types.reservationConfirmed,
            reservation: updatedReservation._id,
            date: new Date().toLocaleString(),
        });
        await log.save();

        return res.status(200).json({
                ok: true,
                message: types.reservationConfirmed,
                reservation: updatedReservation,
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error, contacte a su administrador',
        });
    }
}

const cancelCustomReservation = async (req, res = response) => {
    try {      
        const cancelledReservation = await CustomReservation.findByIdAndUpdate(req.params.id, { status: types.reservationCancelled }, { new: true })
        .populate('user', 'name')

        if (!cancelledReservation) {
            return res.status(404).json({
                ok: false,
                message: `No existe la reservacion con id ${req.params.id}`,
            });

        }

        const log = new Log({
            user: req.uid,
            action: types.reservationCancelled,
            reservation: cancelledReservation._id,
            date: new Date().toLocaleString(),
        });
        await log.save();

        return res.status(200).json({
                ok: true,
                message: 'Reservacion personalizada cancelada',
                reservation: cancelledReservation,
            });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error, contacte a su administrador',
        });
    }
}

const completeCustomReservation = async (req, res = response) => {
    try {

        const completedReservation = await CustomReservation.findByIdAndUpdate(req.params.id, { status: types.reservationCompleted }, { new: true })
        .populate('user', 'name')

        if (!completedReservation) {
            return res.status(404).json({
                ok: false,
                message: `No existe la reservacion con id ${req.params.id}`,
            });

        }

        const log = new Log({
            user: req.uid,
            action: types.reservationCompleted,
            reservation: completedReservation._id,
            date: new Date().toLocaleString(),
        });
        await log.save();

        return res.status(200).json({
                ok: true,
                message: 'Reservacion personalizada completada',
                reservation: completedReservation,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error, contacte a su administrador',
        });
    }
}


module.exports = {
    getCustomReservations,
    createCustomReservation,
    updateCustomReservation,
    cancelCustomReservation,
    confirmCustomReservation,
    completeCustomReservation,
}