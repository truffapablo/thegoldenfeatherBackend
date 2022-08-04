const { transporter } = require("../mailer/config");
const { response } = require("express");

const { types } = require("../types/types");
const Reservation = require("../models/Reservation");
const { eventReservationMail, customReservationMail, transferReservationMail } = require("../mailer/reservation");
const CustomReservation = require("../models/CustomReservation");
const TransferReservation = require("../models/TransferReservation");



const infoMail = async (req, res = response) => {
    try {

        const {email} = req.body;
        let emailBody = `
        <h2>Interesado en proyecto.</h2>
        <br/>
        <p>El correo ${email} se contactó para recibir más información sobre The Golden Feather.</p>
        `
        receiveMailAction(emailBody, email).then(rta=>{
            console.log('Envio de mail: ', rta);
        })
        return res.status(200).json({
            ok: true,
            message: 'Email enviado',
            email
        });

        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error, algo salió mal. Intentá de nuevo a la brevedad.',
        });
    }
}

const mailToClient = async (req, res = response) => {
    

    try {
        const {pattern, id} = req.body;

    switch (pattern) {
        case 'EVENT_RESERVATION':
            
        const reservation = await Reservation.findById(id);
        if(!reservation) {
            return res.status(400).json({
                ok: false,
                message: 'No se encontró la reserva',
            });
        }
        
        let emailBody = eventReservationMail(reservation);
        sendMailAction(emailBody, reservation.email).then(rta=>{
            console.log('Envio de mail: ', rta);
        })
        return res.status(200).json({
            ok: true,
            message: 'Email enviado',
            pattern,
            email:reservation.email
        });
        
        case 'CUSTOM_RESERVATION':
        const customreservation = await CustomReservation.findById(id);
        if(!customreservation) {
            return res.status(400).json({
                ok: false,
                message: 'No se encontró la reserva',
            });
        }
        
        let customemailBody = customReservationMail(customreservation);
        sendMailAction(customemailBody, customreservation.email)
        return res.status(200).json({
            ok: true,
            message: 'Email enviado',
            pattern,
            email:customreservation.email
        });
        
        
        case 'TRANSFER_RESERVATION':
        const transferreservation = await TransferReservation.findById(id);
        if(!transferreservation) {
            return res.status(400).json({
                ok: false,
                message: 'No se encontró la reserva',
            });
        }
        
        let transferemailBody = transferReservationMail(transferreservation);
        sendMailAction(transferemailBody, transferreservation.email);
        return res.status(200).json({
            ok: true,
            message: 'Email enviado',
            pattern,
            email:transferreservation.email
        });

        default:
            return res.status(400).json({
                ok: true,
                message: 'NOT FOUND',
                pattern
            });
        }
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error, contacte a su administrador',
        });
    }
    
}


const sendMailAction = async (emailBody, email) => {
    let sendmail = await transporter.sendMail({
        from: '"The Golden Feather" <thegoldenfeatherdev@gmail.com>', // sender address
        to: `"${email}"`, // list of receivers
        subject: "Info Reserva", // Subject line
        html: emailBody, // html body
      });
    return sendmail;
}

const receiveMailAction = async (emailBody, email) => {
    let sendmail = await transporter.sendMail({
        from: `"${email}"`, // list of receivers
        to: '"The Golden Feather" <thegoldenfeatherdev@gmail.com>', // receiver address
        subject: "Info Proyecto", // Subject line
        html: emailBody, // html body
      });
    return sendmail;
}


module.exports = {
    mailToClient,
    infoMail,
    receiveMailAction
}