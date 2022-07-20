const express = require('express');
const { response } = require("express");
const { check } = require('express-validator');
const Event = require('../models/Event');
const Reservation = require('../models/Reservation');

const moment = require('moment');
const { today } = require('../helpers/today');
const CustomReservation = require('../models/CustomReservation');

const router = express.Router();


router.get('/reservations', async (req, res = response) => {

  const customReservation = await CustomReservation.find();
  const first = customReservation[0];
  return res.status(200).json({
    ok:true,
    precioFinal:first.price,
    precioComision:first.commission,
    total:first.commission+first.price,
    customReservation,
  })


})


module.exports = router;