const { response } = require("express");
const Event = require('../models/Event');
const bcrypt = require("bcryptjs/dist/bcrypt");
const { types } = require("../types/types");
const Reservation = require("../models/Reservation");



const getEvents = async (req, res = response) => {

    try {
        const events = await Event.find().populate('user', 'name');
        if (events.length === 0) {
            return res.status(200).json({
                ok: false,
                message: 'No hay eventos',
            });
        }else{
            res.status(200).json({
                ok: true,
                events
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error, contacte a su administrador',
        });
    }

    
        
}


const createEvent = async (req, res = response) => {

    const event = new Event(req.body);

    try {
        event.user = req.uid;
        await event.save();

        const createdEvent = await Event.findById(event._id)
        .populate('user', 'name');

        res.status(201).json({
            ok: true,
            message: 'Evento creado',
            event: createdEvent
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error, contacte a su administrador',
        });
    } 
}

const updateEvent = async (req, res = response) => {
    
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({
                ok: false,
                message: 'No existe el evento',
            });
        }

        const newEvent = {
            ...req.body,
            user: req.uid
        }

        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, newEvent, { new: true });

        res.status(201).json({
            ok: true,
            message: 'Evento actualizado',
            event: updatedEvent
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error, contacte a su administrador',
        });
    }

}

const deleteEvent = async (req, res = response) => {


    try {
        
        const event = await Event.findById(req.params.id);

        if(!event){
            return res.status(404).json({
                ok: false,
                message: 'No existe el evento',
            });
        }
        /**
         * Buscar las reservas que tengan asociado el evento
         */

        await Reservation.updateMany({ 'event._id': event._id, status: types.reservationPending }, { status: types.reservationCancelled });
            
        await event.remove();
        const reservationsCanceled = await Reservation.find({ 'event._id': event._id, status: types.reservationCancelled });
    
        res.status(200).json({
            ok: true,
            message: 'Evento eliminado',
            reservationsCanceled
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
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}