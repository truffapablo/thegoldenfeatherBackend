const express = require('express');
const { response } = require("express");
const { check } = require('express-validator');
const Event = require('../models/Event');
const Reservation = require('../models/Reservation');

const moment = require('moment');

const router = express.Router();


router.get('/reservations', async (req, res = response) => {

    /**
     * Establecer la fecha en la que llega la peticion
     * Esto debe venir de la hora y fecha del usuario que hace la peticion y no de la del server.
     */

    const data = req.body;
    
    const {dateuser} = data;
    
    const reservations = await Reservation.find({date:dateuser});


    return res.status(200).json({
        ok:true,
        reservations,
        /* today: moment(dateuser),
        now:moment(),
        tommorrow: moment(dateuser).add(1, 'day'),
        yesterday: moment(dateuser).subtract(1, 'day') */
    })


})


module.exports = router;