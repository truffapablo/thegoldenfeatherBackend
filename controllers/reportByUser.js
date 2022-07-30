const moment = require('moment');
const { response } = require("express");
const { types } = require("../types/types");
const CustomReservation = require("../models/CustomReservation");
const TransferReservation = require("../models/TransferReservation");
const Reservation = require("../models/Reservation");
const { iniDay, endDay, today } = require("../helpers/today");
const { aggregate } = require('../models/CustomReservation');