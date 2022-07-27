const moment = require('moment');
const { response } = require("express");
const { types } = require("../types/types");
const CustomReservation = require("../models/CustomReservation");
const TransferReservation = require("../models/TransferReservation");
const Reservation = require("../models/Reservation");
const { iniDay, endDay, today } = require("../helpers/today");
const { aggregate } = require('../models/CustomReservation');


const getTodayReport = async (req, res = response) => {
    

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


const getReportByDate = async (req, res = response) => {
    const {from, to} = req.body;

    try {
        const eventReservations = await Reservation.find({date: {$gte:from, $lte:to}})
        const customReservations = await CustomReservation.find({date: {$gte:from, $lte:to}})
        const transferReservations = await TransferReservation.find({date: {$gte:from, $lte:to}})
        return res.status(200).json({
            ok:true,
            message:'Reportes de reservas por fecha',
            from,
            to,
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

const getReportsByYear = async (req, res = response) => {
    /**
     * {$group: {
                _id: {$month: "$date"}, 
                numberofbookings: {$sum: 1},
                //commission: {$sum}
                
            }}
     */
}


const getReportsByMonth = async (req, res = response) => {
    
    const month = parseInt(req.body.month);

    try {
        const eventReservations = await Reservation.aggregate([
            {
                $project: {
                    //commission: {$multiply:["$event.commission", "$peopleQuantity"]},
                    day: {$dayOfMonth: '$date'} ,
                    month: {$month: '$date'} , 
                    year: {$year:'$date'},
                    date:'$date',
                    status:'$status',
                    peopleQuantity:'$peopleQuantity',
                    commission:'$commission',
                    pattern:'$pattern',
                    event:'$event',
                    
                }
            },
            {$match: {month}},
        ]);

        const customReservations = await CustomReservation.aggregate([
            
            {
                $project: {
                    //commission: {$multiply:["$event.commission", "$peopleQuantity"]},
                    day: {$dayOfMonth: '$date'} ,
                    month: {$month: '$date'} , 
                    year: {$year:'$date'},
                    date:'$date',
                    status:'$status',
                    peopleQuantity:'$peopleQuantity',
                    commission:'$commission',
                    pattern:'$pattern',
                    event:'$event',
                    
                }
            },
            {$match: {month}},
        ]);

        const transferReservations = await TransferReservation.aggregate([
            
            {
                $project: {
                    //commission: {$multiply:["$event.commission", "$peopleQuantity"]},
                    day: {$dayOfMonth: '$date'} ,
                    month: {$month: '$date'} , 
                    year: {$year:'$date'},
                    date:'$date',
                    status:'$status',
                    peopleQuantity:'$peopleQuantity',
                    commission:'$commission',
                    pattern:'$pattern',
                    
                }
            },
            {$match: {month}},
        ]);

        return res.status(200).json({
            ok:true,
            length:{
                event:eventReservations.length,
                custom:customReservations.length,
                transfer:transferReservations.length,
            },
            profit: {
                event: generateEconomicCalcByDayInMonth(eventReservations)
            },
            month,
            //transferReservations,
            eventReservations,
            //revenue: generateEconomicCalc([...eventReservations,...customReservations,...transferReservations])
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            error
        })
    }
}



const generateEconomicCalcByDayInMonth = (reservations) => {
    let eventDays = [];

    reservations.map(reservation =>{
        switch (reservation.pattern) {
            case 'EVENT_RESERVATION':
                eventDays = addCommisionToDay(eventDays, reservation)
                break;

            default:
                break;
        }
    });

    return eventDays;

}

const addCommisionToDay = (days = [], data) => {
    
    let day = days.find((d) => d.day === data.day);

    if (!day) {
        days.push({
            day:data.day,
            total: data.event.commission * data.peopleQuantity
        });
    } else {
        day.total += data.event.commission * data.peopleQuantity;
    }

    return days;
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
    
    let estimated_profit = {
        event   : 0,
        custom  : 0,
        transfer: 0,
    }

    reservations.map(reservation => {
        switch (reservation.pattern) {
            case 'EVENT_RESERVATION':
                profit.event                += calculateEventReservationProfit(reservation);
                economic_loss.event         += calculateEventReservationLoss(reservation);
                estimated_profit.event      += calculateEventReservationEstimatedProfit(reservation);
                break;
                
            case 'CUSTOM_RESERVATION':
                profit.custom               += calculateCustomReservationProfit(reservation);
                economic_loss.custom        += calculateCustomReservationLoss(reservation);
                estimated_profit.custom     += calculateCustomReservationEstimatedProfit(reservation);
                break;
                
            case 'TRANSFER_RESERVATION':
                profit.transfer             += calculateTransferReservationProfit(reservation);
                economic_loss.transfer      += calculateTransferReservationLoss(reservation);
                estimated_profit.transfer   += calculateTransferReservationEstimatedProfit(reservation);
            break;
            default:
                break;
        }
    })

    return {
        profit,
        economic_loss,
        estimated_profit
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

const calculateEventReservationEstimatedProfit = (reservation) => {
    const {status, peopleQuantity} = reservation;
    const {commission} = reservation.event;
    
    if (status !== types.reservationCancelled){
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

const calculateCustomReservationEstimatedProfit = (reservation) => {
    const {status, commission} = reservation;
    
    if (status !== types.reservationCancelled){
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

const calculateTransferReservationEstimatedProfit = (reservation) => {
    
    const {status, commission} = reservation;
    if (status !== types.reservationCancelled){
        return commission;
    }

    return 0;
} 

module.exports = {
    getTodayReport,
    getReportByDate,
    getReportsByMonth
}