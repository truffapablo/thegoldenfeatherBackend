const express = require('express');
const { response } = require("express");
const { check } = require('express-validator');
const Event = require('../models/Event');
const Reservation = require('../models/Reservation');

const moment = require('moment');
const { today } = require('../helpers/today');

const router = express.Router();


router.get('/reservations', async (req, res = response) => {

    /**
     * Establecer la fecha en la que llega la peticion
     * Esto debe venir de la hora y fecha del usuario que hace la peticion y no de la del server.
     */

    const manana = moment().add(1,'day').format('YYYY-MM-DD')
    //const reservations = await Reservation.find({date:{$eq:today()}});
    const reservations = await Reservation.find({date:{$eq:manana}});


    return res.status(200).json({
        ok:true,
        fecha:moment().format('YYYY-MM-DD hh:mm A'),
        length:reservations.length?reservations.length:[],
        reservations,
        /* today: moment(dateuser),
        now:moment(),
        tommorrow: moment(dateuser).add(1, 'day'),
        yesterday: moment(dateuser).subtract(1, 'day') */
    })


})


module.exports = router;