"use strict";
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'thegoldenfeatherdev@gmail.com', // generated ethereal user
      pass: 'eqgtzyjvocxllvlq', // generated ethereal password
    },
  });


  module.exports = {
    transporter
  }


