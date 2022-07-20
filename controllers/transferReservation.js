const { response } = require('express');
const { iniDay, endDay, today } = require("../helpers/today");
const { transporter } = require('../mailer/config');
const { transferReservationMail } = require('../mailer/reservation');
const TransferReservation = require('../models/TransferReservation');
const { types } = require('../types/types');

const getTransferReservations = async (req, res = response) => {
    try{
        const transferR = await TransferReservation.find({date: {$eq:today()}}).populate('user', 'name');
        return res.status(200).json({
            ok: true,
            transferR
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error, contacte a su administrador',
        });
    }
}

const createTransferReservation = async (req, res = response) => {
        
        try {
            req.body.user = req.uid;
            const transferR = new TransferReservation(req.body);
            transferR.status = types.reservationPending;
            transferR.confirmation = new Date().getTime();
            await transferR.save();
            return res.status(201).json({
                ok: true,
                transferR
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                ok: false,
                message: 'Error, contacte a su administrador',
            });
        }
        
}

const updateTransferReservation = async (req, res = response) => {

        try {
            const transferR = await TransferReservation.findByIdAndUpdate(req.params.id, req.body, { new: true}).populate('user', 'name');
            if(!transferR){
                return res.status(404).json({
                    ok: false,
                    message: 'Transfer no encontrado',
                });
            }
            return res.status(200).json({
                ok: true,
                message: 'Transfer actualizado',
                transferR
            });
    
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                ok: false,
                message: 'Error, contacte a su administrador',
            });
        }
            
}

const confirmTransferReservation = async (req, res = response) => {
                
        try {
            const transferR = await TransferReservation.findByIdAndUpdate(req.params.id, { status: types.reservationConfirmed}, { new: true}).populate('user', 'name');
            if(!transferR){
                return res.status(404).json({
                    ok: false,
                    message: 'Transfer no encontrado',
                });
            }

            if(transferR.email) {
                
                let emailBody = transferReservationMail(transferR);
                await transporter.sendMail({
                    from: '"The Golden Feather" <thegoldenfeatherdev@gmail.com>', // sender address
                    to: `"${transferR.email}"`, // list of receivers
                    subject: "Confirmación de reserva", // Subject line
                    html: emailBody, // html body
                  });            
            }
            
            return res.status(200).json({
                ok: true,
                message: 'Transfer confirmado',
                transferR
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                ok: false,
                message: 'Error, contacte a su administrador',
            });
        }
                
}

const completeTransferReservation = async (req, res = response) => {
                            
        try {
            const transferR = await TransferReservation.findByIdAndUpdate(req.params.id, { status: types.reservationCompleted}, { new: true}).populate('user', 'name');
            if(!transferR){
                return res.status(404).json({
                    ok: false,
                    message: 'Transfer no encontrado',
                });
            }
            return res.status(200).json({
                ok: true,
                message: 'Transfer completado',
                transferR
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                ok: false,
                message: 'Error, contacte a su administrador',
            });
        }
            
}

const cancelTransferReservation = async (req, res = response) => {
                    
        try {
            const transferR = await TransferReservation.findByIdAndUpdate(req.params.id, { status: types.reservationCancelled}, { new: true}).populate('user', 'name');
            if(!transferR){
                return res.status(404).json({
                    ok: false,
                    message: 'Transfer no encontrado',
                });
            }

            if(transferR.email) {
                
                let emailBody = transferReservationMail(transferR);
                await transporter.sendMail({
                    from: '"The Golden Feather" <thegoldenfeatherdev@gmail.com>', // sender address
                    to: `"${transferR.email}"`, // list of receivers
                    subject: "Cancelación de reserva", // Subject line
                    html: emailBody, // html body
                  });            
            }

            return res.status(200).json({
                ok: true,
                message: 'Transfer cancelado',
                transferR
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                ok: false,
                message: 'Error, contacte a su administrador',
            });
        }

}


module.exports = {
    getTransferReservations,
    createTransferReservation,
    updateTransferReservation,
    confirmTransferReservation,
    cancelTransferReservation,
    completeTransferReservation
}