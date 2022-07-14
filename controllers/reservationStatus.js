const { response } = require("express");
const ReservationStatus = require("../models/ReservationStatus");


const createReservationStatus = async (req, res = response) => {
    try {
        const status = new ReservationStatus(req.body);
        await status.save();
        res.status(201).json({
            ok: true,
            message: 'Estado de reservacion creado',
            status,
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error, contacte a su administrador',
        });
    }
}

const getReservationStatus = async (req, res = response) => {
    try {
        const status = await ReservationStatus.find();
        res.status(200).json({
            ok: true,
            status,
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error, contacte a su administrador',
        });
    }
}


module.exports = {
    createReservationStatus,
    getReservationStatus,
}
