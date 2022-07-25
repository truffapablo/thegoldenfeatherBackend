const moment = require('moment');
const { response } = require("express");
const { types } = require("../types/types");
const CustomReservation = require("../models/CustomReservation");
const TransferReservation = require("../models/TransferReservation");
const Reservation = require("../models/Reservation");
const { iniDay, endDay, today } = require("../helpers/today");


const getTodayReservations = async (req, res = response) => {
    

    try {
        const eventReservations = await Reservation.find({date: {$eq:today()}})
        const customReservations = await CustomReservation.find({date: {$eq:today()}})
        const transferReservations = await TransferReservation.find({date: {$eq:today()}})
        return res.status(200).json({
            ok:true,
            message:'Reportes de reservas',
            reservation_quantity : {
                event: eventReservations.length,
                custom: customReservations.length,
                transfer: transferReservations.length,
            },

            reservation_status: getReservationStatus([...eventReservations,...customReservations,...transferReservations]),

            revenue: generateEconomicCalc([...eventReservations,...customReservations,...transferReservations])  
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            error
        })
    }
    
    
}


const generateEconomicCalc = (reservations) => {
    
    let profit = {
        event   : 0,
        custom  : 0,
        transfer: 0,
    }
    
    let economic_loss = {
        event   : 0,
        custom  : 0,
        transfer: 0,
    }

    reservations.map(reservation => {
        switch (reservation.pattern) {
            case 'EVENT_RESERVATION':
                profit.event += calculateEventReservationProfit(reservation);
                economic_loss.event += calculateEventReservationLoss(reservation);
                break;
            
            case 'CUSTOM_RESERVATION':
                profit.custom += calculateCustomReservationProfit(reservation);
                economic_loss.custom += calculateCustomReservationLoss(reservation);
                break;
                
            case 'TRANSFER_RESERVATION':
                profit.transfer += calculateTransferReservationProfit(reservation);
                economic_loss.transfer += calculateTransferReservationLoss(reservation);
                break;
            default:
                break;
        }
    })

    return {
        profit,
        economic_loss
    }
}


const getReservationStatus = (reservations) => {
    
    let reservation_status = {
        pending:0,
        confirmed:0,
        completed:0,
        cancelled:0,
    }
    reservations.map(reservation => {

        switch (reservation.status) {
            case types.reservationPending:
                reservation_status.pending += 1;
                break;
            case types.reservationConfirmed:
                reservation_status.confirmed += 1;
                break;
            case types.reservationCompleted:
                reservation_status.completed += 1;
                break;
            case types.reservationCancelled:
                reservation_status.cancelled += 1;
                break;
        
            default:
                break;
        }
    })

    return reservation_status;
}

const calculateEventReservationProfit = (reservation) => {
    const {status, peopleQuantity} = reservation;
    const {commission} = reservation.event;
    
    if (status === types.reservationCompleted){
        return commission * peopleQuantity;

    }   
    return 0;
}

const calculateEventReservationLoss = (reservation) => {
    const {status, peopleQuantity} = reservation;
    const {commission} = reservation.event;
    
    if (status === types.reservationCancelled){
        return commission * peopleQuantity;

    }   
    return 0;
}

const calculateCustomReservationProfit = (reservation) => {
    const {status, commission} = reservation;
    
    if (status === types.reservationCompleted){
        return  commission;
    }

    return 0;
} 

const calculateCustomReservationLoss = (reservation) => {
    const {status, commission} = reservation;
    
    if (status === types.reservationCancelled){
        return  commission;
    }

    return 0;
} 

const calculateTransferReservationProfit = (reservation) => {
    
    const {status, commission} = reservation;
    if (status === types.reservationCompleted){
        return commission;
    }

    return 0;
} 

const calculateTransferReservationLoss = (reservation) => {
    
    const {status, commission} = reservation;
    if (status === types.reservationCancelled){
        return commission;
    }

    return 0;
} 

/**
 * 

Reportes
=========================================

[Input Fecha]

Pantalla inicial
+ Reporte del dia
    +Ganancias
    +Perdidas
    +Ganancias pendientes

+ Detalles

    Reservas de Eventos
    ===================
    +Ganancias
    +Perdidas
    +Ganancias pendientes
        +Estados:
        =========
        +Pendientes
        +Confirmadas
        +Completadas
        +Canceladas

    
    Reservas personalizadas
    ===================
    +Ganancias
    +Perdidas
    +Ganancias pendientes
        +Estados:
        =========
        +Pendientes
        +Confirmadas
        +Completadas
        +Canceladas
    
    Reservas de transfer
    ===================
    +Ganancias
    +Perdidas
    +Ganancias pendientes
        +Estados:
        =========
        +Pendientes
        +Confirmadas
        +Completadas
        +Canceladas

+ Usuarios registrados
+ Usuarios sin acceso

[Boton para imprimir las reservas del dia seleccionado]

Reporte Mensual
Reporte Anual

Usuario con mayor cantidad de ventas
    +Diaria
    +Mensual
    +Anual

 */



module.exports = {
    getTodayReservations
}