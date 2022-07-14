const mongoose = require('mongoose');
const { response } = require("express");
const bcrypt = require("bcryptjs/dist/bcrypt");
const Reservation = require("../models/Reservation");

const User = require('../models/User');

const { dbConnection, dbDisconnection } = require('../database/config');
const { userSeeder } = require('../seeders/userSeeder');
const { eventSeeder } = require('../seeders/eventSeeder');
const Event = require('../models/Event');
const { transferSeeder } = require('../seeders/transferSeeder');
const Transfer = require('../models/Transfer');
const { reservationSeeder } = require('../seeders/reservationSeeder');
const CustomReservation = require('../models/CustomReservation');
const { customReservationSeeder } = require('../seeders/customReservationSeeder');
const { transferReservationSeeder } = require('../seeders/transferReservationSeeder');
const TransferReservation = require('../models/TransferReservation');
const Log = require('../models/Log');

const resetDB = async( req, res = response) => {
    
    try {
        await dbDisconnection();
        await dbConnection();
        /**
         * Borra todas las colecciones
         */
        await dropCollection();

        /**
         * Crea los usuarios
         */
        await resetUsers();
        
        /**
         * Carga de eventos
         */
        await resetEvents();
        
        /**
         * Carga de transfers
         */
        await resetTransfers();

        /**
         * Carga de reservas
         */
        await resetReservations();

        /**
         * Carga de reservas personalizadas
         */
        await resetCustomReservations();

        /**
         * Carga de reservas de transfer
         */
        await resetTransferReservations();


        return res.status(500).json({
            ok:true,            
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            message:error.message
        })
    }

}


const dropCollection = async () => {

    try {
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
    
        if(collections.length > 0 ){
            
            collections
            .map((collection) => collection.name)
            .forEach(async (collectionName) => {
                db.dropCollection(collectionName);
            });
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            message:error.message
            
        });
    }


     
}
const getUser = async() => {
    try {
        const userList = await userSeeder();
        const user = await User.findOne({email:userList[0].email});
        return user;
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            message:error.message
        });
    }
}

const getEvents = async() => {
    try {
        return await Event.find();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            message:error.message
        });
    }
}

const getTransfers = async () => {
    try {
        return await Transfer.find();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            message:'Error, contacte a su administrador',
            error
        });
    }
}

const resetUsers = async () => {
    try {
        const userList = await userSeeder();
        await User.insertMany(userList );
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            message:'Error, contacte a su administrador',
            error
        });
    }
}

const resetEvents = async () => {
    try {
        const {id} = await getUser();
        const eventList = eventSeeder(id);
        await Event.insertMany(eventList);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            message:error.message
        });
    }
}

const resetTransfers = async() => {
    try {
        const {id} = await getUser();
        const transferList = transferSeeder(id);
        await Transfer.insertMany(transferList);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            message:error.message
        });
    }
}

const resetReservations = async() => {
    try {
        const {id} = await getUser();
        const events = await getEvents();
        const reservationList = reservationSeeder(events,id);
        const data = await Reservation.insertMany(reservationList);
        await createLogs(data);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            message:error.message
        });
    }
}

const resetCustomReservations = async() =>{
    try {
        const {id} = await getUser();
        const customReservationList = customReservationSeeder(id);
        const data = await CustomReservation.insertMany(customReservationList);
        await createLogs(data);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            message:error.message
        });
    }
}

const resetTransferReservations = async() => {
    try {
        const {id} = await getUser();
        const transfers = await getTransfers();
        const transferReservationList = transferReservationSeeder(transfers, id);
        const data = await TransferReservation.insertMany(transferReservationList);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            message:error.message
        });
    }
    
    //await createLogs(data);
}

const createLogs = async (reservations) => {
    try {
        reservations.map( reservation =>{
            const log = new Log({
                user:           reservation.user,
                action:         reservation.status,
                reservation:    reservation._id,
                date:           new Date().toLocaleString(),
            });
    
            log.save();
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            message:error.message
        });
    }
}






module.exports = {
    resetDB,
    getUser
}