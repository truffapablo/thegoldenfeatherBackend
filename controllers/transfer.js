const { response } = require('express');
const Transfer = require('../models/Transfer');
const TransferReservation = require('../models/TransferReservation');
const { types } = require('../types/types');

const getTransfers = async (req, res = response) => {
    try{
        const transfers = await Transfer.find().populate('user', 'name');
        return res.status(200).json({
            ok: true,
            transfers
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error, contacte a su administrador',
        });
    }
}

const createTransfer = async (req, res = response) => {
    
    try {
        req.body.user = req.uid;
        const transfer = new Transfer(req.body);
        await transfer.save();
        return res.status(201).json({
            ok: true,
            transfer
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error, contacte a su administrador',
        });
    }
    
}

const updateTransfer = async (req, res = response) => {
    
    try {
        const transfer = await Transfer.findByIdAndUpdate(req.params.id, req.body, { new: true}).populate('user', 'name');
        if(!transfer){
            return res.status(404).json({
                ok: false,
                message: 'Transfer no encontrado',
            });
        }
        return res.status(200).json({
            ok: true,
            message: 'Transfer actualizado',
            transfer
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error, contacte a su administrador',
        });
    }

}

const deleteTransfer = async (req, res = response) => {
        
        try {
            const transfer = await Transfer.findByIdAndDelete(req.params.id);
            if(!transfer){
                return res.status(404).json({
                    ok: false,
                    message: 'Transfer no encontrado',
                });
            }

            /**
             * Buscar las reservas de transfer que tengan asociado el transfer
             */
           
           await TransferReservation.updateMany({ 'transfer': transfer._id, status: types.reservationPending }, { status: types.reservationCancelled });
           const transferReservationsCanceled = await TransferReservation.find({ 'transfer': transfer._id, status: types.reservationCancelled });      
            return res.status(200).json({
                ok: true,
                message: 'Transfer eliminado',
                transferReservationsCanceled
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
    getTransfers,
    createTransfer,
    updateTransfer,
    deleteTransfer,
}