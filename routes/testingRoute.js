const express = require('express');
const { response } = require("express");
const { check } = require('express-validator');
const Event = require('../models/Event');
const Reservation = require('../models/Reservation');

const router = express.Router();


router.get('/:id', async (req, res = response) => {

    const event = await Event.findById(req.params.id);
    
    if (!event) {
        return res.status(404).json({
            ok: false,
            message: 'No existe el evento',
        });
    }

    /**
     * Buscar las reservas que tengan asociado el evento
     */

    const reservations = await Reservation.find({ 'event._id': event._id });
    await Reservation.deleteMany({ 'event._id': event._id });
    await event.remove();
    res.status(200).json({
        ok: true,
        event:event.title,
        reservations
    });
          

})


module.exports = router;