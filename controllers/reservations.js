const { response } = require("express");
const Reservation = require("../models/Reservation");
const { types } = require("../types/types");
const Log = require("../models/Log");
const Event = require("../models/Event");
const { iniDay, endDay, today } = require("../helpers/today");

const moment = require('moment-timezone');
const tz = moment().tz("America/Argentina/Buenos_Aires");


const getReservations = async (req, res = response) => {
    try {
        console.log('SERVER-DATE', moment());
        console.log('SERVER-DATE-TZ', today());
        
        const reservations = await Reservation.find({date: {$gte: iniDay(today()), $lte: endDay(today())}})
        .populate('user', 'name')
        .populate('event',['title','price','currency','start','end','location','address','city']);
        
        if (reservations.length === 0) {
            return res.status(201).json({
                ok: false,
                message: 'No hay reservaciones',
            });
        }
        res.status(200).json({
            ok: true,
            length:reservations.length? reservations.length:null,
            primeraReserva:moment.utc(reservations[0].date).format('YYYY-MM-DD'),
            filter : [iniDay(today()), endDay(today())],
            reservations,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error, contacte a su administrador',
        });
        
    }
}

const createReservation = async (req, res = response) => {
    
    try {
        
        const event = await Event.findById(req.body.event);

        if (!event) {
            return res.status(404).json({
                ok: false,
                message: `No existe el evento con id ${req.body.event}`,
            });
        }

        req.body.event = event;

        const reservation = new Reservation(req.body);
        reservation.user = req.uid;
        reservation.status = types.reservationPending;
        reservation.confirmation = new Date().getTime();
        const createdReservation = await reservation.save();

        const log = new Log({
            user: req.uid,
            action: types.reservationPending,
            reservation: reservation._id,
            date: new Date().toLocaleString(),
        });
        await log.save();

        return res.status(200).json({
            ok: true,
            message: 'Reservacion creada',
            reservation: createdReservation,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error, contacte a su administrador',
        });
    }
    
}



const updateReservation = async (req, res = response) => {
    
    try {
        const event = await Event.findById(req.body.event);

        if (!event) {
            return res.status(404).json({
                ok: false,
                message: `No existe el evento con id ${req.body.event}`,
            });
        }

        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({
                ok: false,
                message: `No existe la reservacion con id ${req.params.id}`,
            });
        }

        req.body.event = event;
        const newReservation = {
            ...req.body,
            user: req.uid,
        }

        const updatedReservation = await Reservation.findByIdAndUpdate(req.params.id, newReservation, { new: true })
        .populate('user', 'name');

        const log = new Log({
            user: req.uid,
            action: types.reservationUpdated,
            reservation: reservation._id,
            date: new Date().toLocaleString(),
        });
        await log.save();

        res.status(200).json({
            ok: true,
            message: 'Reservacion actualizada',
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

const deleteReservation = async (req, res = response) => {
    return res.status(200).json({ok: true,message: 'DELETE Reservaciones',});
    
}

const confirmReservation = async (req, res = response) => {
        
        try {
            const newReservation = {
                ...req.body,
                user: req.uid,
                status: types.reservationConfirmed,
            }
    
            const updatedReservation = await Reservation.findByIdAndUpdate(req.params.id, newReservation, { new: true })
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

const cancelReservation = async (req, res = response) => {
    
    try {
        const cancelledReservation = await Reservation.findByIdAndUpdate(req.params.id, { status: types.reservationCancelled }, { new: true })
        .populate('user', 'name')
        .populate('event',['title','price','currency']);

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
                message: 'Reservacion cancelada',
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


const completeReservation = async (req, res = response) => {
    try {
        const completedReservation = await Reservation.findByIdAndUpdate(req.params.id, { status: types.reservationCompleted }, { new: true })
        .populate('user', 'name')
        .populate('event',['title','price','currency']);

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
            message: 'Reservacion completada',
            reservation: completedReservation,
        });

        
    }catch (error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                message: 'Error, contacte a su administrador',
            });
        }
}





module.exports = {
    getReservations,
    createReservation,
    updateReservation,
    deleteReservation,
    cancelReservation,
    confirmReservation,
    completeReservation,
}