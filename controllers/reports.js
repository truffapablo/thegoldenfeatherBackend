const moment = require('moment');
const { response } = require("express");
const { types } = require("../types/types");
const CustomReservation = require("../models/CustomReservation");
const TransferReservation = require("../models/TransferReservation");
const Reservation = require("../models/Reservation");
const { iniDay, endDay, today } = require("../helpers/today");
const { aggregate } = require('../models/CustomReservation');
const mongoose = require('mongoose');


const getTodayReport = async (req, res = response) => {

    try {

        let searchFilter;
        if(req.query.uid){
            searchFilter = {
                date: {$eq:today()},
                user:req.query.uid
            }
    
        }else{
            searchFilter = {date: {$eq:today()}}
        }
        
        const eventReservations = await Reservation.find(searchFilter)
        const customReservations = await CustomReservation.find(searchFilter)
        const transferReservations = await TransferReservation.find(searchFilter)
        return res.status(200).json({
            ok:true,
            message:'Reportes de reservas diario',
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

    let searchFilter;
        if(req.query.uid){
            searchFilter = {
                date: {$gte:from, $lte:to},
                user:req.query.uid
            }
    
        }else{
            searchFilter = {date: {$gte:from, $lte:to}}
        }

    try {
        const eventReservations = await Reservation.find(searchFilter)
        const customReservations = await CustomReservation.find(searchFilter)
        const transferReservations = await TransferReservation.find(searchFilter)
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
    const year = parseInt(req.body.year);

    let searchFilter;
    let transferFilter;
        if(req.query.uid){

            const paramId = mongoose.Types.ObjectId(req.query.uid);

            searchFilter = [{
                $project: {
                    day: {$dayOfMonth: '$date'} ,
                    month: {$month: '$date'} , 
                    year: {$year:'$date'},
                    date:'$date',
                    status:'$status',
                    peopleQuantity:'$peopleQuantity',
                    commission:'$commission',
                    pattern:'$pattern',
                    event:'$event',
                    email:'$email',
                    user:'$user'
                    }
                },{$match: {month,year,user:paramId}}
            ]

            transferFilter =[{
                $project: {
                    day: {$dayOfMonth: '$date'} ,
                    month: {$month: '$date'} , 
                    year: {$year:'$date'},
                    date:'$date',
                    status:'$status',
                    peopleQuantity:'$peopleQuantity',
                    commission:'$commission',
                    pattern:'$pattern',
                    user:'$user'
                    
                }
            },
            {$match: {month,year,user:paramId}}
        ];
    
        }else{
            searchFilter = [{
                $project: {
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
            {$match: {month,year}},]

            transferFilter =[{
                $project: {
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
            {$match: {month,year}}
        ];

            
        }

    try {
        const eventReservations = await Reservation.aggregate(searchFilter);

        const customReservations = await CustomReservation.aggregate(searchFilter);

        const transferReservations = await TransferReservation.aggregate(transferFilter);

        return res.status(200).json({
            ok:true,
            message:'Reportes de reservas mensual',
            month,
            length:{
                event:eventReservations.length,
                custom:customReservations.length,
                transfer:transferReservations.length,
            },
            revenue_detail: {
                event: generateEconomicCalcByDayInMonth(eventReservations),
                custom: generateEconomicCalcByDayInMonth(customReservations),
                transfer: generateEconomicCalcByDayInMonth(transferReservations),
            },
            revenue_overview: generateEconomicCalc([...eventReservations,...customReservations,...transferReservations])
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
    let revenue = {
        profit:[],
        loss:[],
        estimated:[],
    }
    
    if(reservations.length === 0){
        return revenue;
    }
    reservations.map(reservation =>{
        eventDays = addCommisionToDay(revenue, reservation, reservation.pattern)
    });

    return eventDays;

}


const addCommisionToDay = (revenue, data, pattern) => {

        switch (data.status) {
            case types.reservationCompleted:
                
                let comp_day = revenue.profit.find((d) => d.day === data.day);
                if (!comp_day) {

                    if(pattern == 'EVENT_RESERVATION'){
                        revenue.profit.push({
                            day:data.day,
                            total: data.event.commission * data.peopleQuantity
                        });
                    }else{
                        revenue.profit.push({
                            day:data.day,
                            total: data.commission
                        });
                    }

                } else {
                    
                    let dayIndex = revenue.profit.indexOf(comp_day);
                    if(pattern == 'EVENT_RESERVATION'){
                        revenue.profit.splice(dayIndex, 1, {
                            day:data.day,
                            total: comp_day.total + data.event.commission * data.peopleQuantity
                        });
                        
                    }else{
                        revenue.profit.splice(dayIndex, 1, {
                            day:data.day,
                            total: comp_day.total + data.commission
                        });

                    }
                }
                break;

            case types.reservationCancelled:
                
                let cxl_day = revenue.loss.find((d) => d.day === data.day);
                if (!cxl_day) {
                    if(pattern == 'EVENT_RESERVATION'){
                        revenue.loss.push({
                            day:data.day,
                            total: data.event.commission * data.peopleQuantity
                        });
                        
                    }else{
                        revenue.loss.push({
                            day:data.day,
                            total: data.commission
                        });
                    }
                } else {
                    
                    let dayIndex = revenue.loss.indexOf(cxl_day);
                    if(pattern == 'EVENT_RESERVATION'){
                        revenue.loss.splice(dayIndex, 1, {
                            day:data.day,
                            total: cxl_day.total + data.event.commission * data.peopleQuantity
                        });
                        
                    }else{
                        revenue.loss.splice(dayIndex, 1, {
                            day:data.day,
                            total: cxl_day.total + data.commission
                        });
                    }
                }
                break;
                
            case types.reservationPending:
                    
                let pp_day = revenue.estimated.find((d) => d.day === data.day);
                if (!pp_day) {
                    if(pattern == 'EVENT_RESERVATION'){
                        revenue.estimated.push({
                            day:data.day,
                            total: data.event.commission * data.peopleQuantity
                        });

                    }
                    else{
                        revenue.estimated.push({
                            day:data.day,
                            total: data.commission
                        });
                    }
                } else {
                    
                    let dayIndex = revenue.estimated.indexOf(pp_day);
                    if(pattern == 'EVENT_RESERVATION'){
                        revenue.estimated.splice(dayIndex, 1, {
                            day:data.day,
                            total: pp_day.total + data.event.commission * data.peopleQuantity
                        });
                    }
                    else{
                        revenue.estimated.splice(dayIndex, 1, {
                            day:data.day,
                            total: pp_day.total + data.commission
                        });

                    }
                }
                break;
            case types.reservationConfirmed:
                    
                    let cc_day = revenue.estimated.find((d) => d.day === data.day);
                    if (!cc_day) {
                        if(pattern == 'EVENT_RESERVATION'){
                            revenue.estimated.push({
                                day:data.day,
                                total: data.event.commission * data.peopleQuantity
                            });
                            
                        }
                        else{
                            revenue.estimated.push({
                                day:data.day,
                                total: data.commission
                            });
                        }
                    } else {
                        let dayIndex = revenue.estimated.indexOf(cc_day);
                        if(pattern == 'EVENT_RESERVATION'){
                            revenue.estimated.splice(dayIndex, 1, {
                                day:data.day,
                                total: cc_day.total + data.event.commission * data.peopleQuantity
                            });
                            
                        }
                        else{
                            revenue.estimated.splice(dayIndex, 1, {
                                day:data.day,
                                total: cc_day.total + data.commission
                            });
                        }
                    }
                break;
        
            default:
                break;
        }
    return revenue;
}

const addCommisionToCustomDay = (days = [], data) => {
    
    let day = days.find((d) => d.day === data.day);

    if (!day) {
        days.push({
            day:data.day,
            total: data.commission
        });
    } else {
        day.total += data.commission;
    }

    return days;
}
const addCommisionToTransferDay = (days = [], data) => {
    
    let day = days.find((d) => d.day === data.day);

    if (!day) {
        days.push({
            day:data.day,
            total: data.commission
        });
    } else {
        day.total += data.commission;
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