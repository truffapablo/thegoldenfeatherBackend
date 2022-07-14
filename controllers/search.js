const { response } = require('express');
const { iniDay, endDay} = require('../helpers/today');
const CustomReservation = require('../models/CustomReservation');
const Reservation = require('../models/Reservation');
const TransferReservation = require('../models/TransferReservation');


const searchDataById = async (req, res = response) => {
    const { id } = req.params;
    try {
        const data = 
        await Reservation.findOne({ confirmation:id }).populate('user', 'name') || 
        await CustomReservation.findOne({ confirmation:id }).populate('user', 'name') ||
        await TransferReservation.findOne({ confirmation:id }).populate('user', 'name');
   
        if (!data) {
            return res.status(404).json({
                ok: false,
                message: 'Data no encontrada',
            });
        }
        return res.status(200).json({
            ok: true,
            data,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error, contacte a su administrador',
        });
    }
}


const advancedSearch = async (req, res = response) => {
    const { confirmation, date, event, lastName } = req.body;

    if(confirmation === null && date === null && event === null && lastName === null){
        return res.status(201).json({
            ok: false,
            message: 'Data no encontrada',
            request: ['Parametros de busqueda', { confirmation, date, event, lastName }],
        });
    }

    const data = [];

    try {
        if( confirmation ){
            
            const data1 = await Reservation.findOne({ confirmation }).populate('user', 'name');
            const data2 = await CustomReservation.findOne({ confirmation }).populate('user', 'name');
            const data3 = await TransferReservation.findOne({ confirmation }).populate('user', 'name');
            data1 && data.push(data1);
            data2 && data.push(data2);
            data3 && data.push(data3);


            if( data.length > 0 ){
                return res.status(200).json({
                    ok: true,
                    data: clearDuplicatedData(data),
                    filters: [confirmation],
                });
            }

            return res.status(201).json({
                ok: false,
                message: `Data no encontrada bajo la confirmación ${confirmation}`,
                request: ['Parametros de busqueda', { confirmation, date, event, lastName }],
            });


        }

        const objToSearch = {  }
        
        if(date){
            objToSearch.date = {
                $gte: iniDay(date),
                $lte: endDay(date),
            }
        }

        if(lastName){
            objToSearch.lastName = {
                    $regex: lastName || '',
                    $options: 'i'
                }
        }

        const data1 = await Reservation.find({
            ...objToSearch,
            "event.title": {
                $regex: event || '',
                $options: 'i'
            }
        }).populate('user', 'name');
        data.push(...data1);
        
        const data2 = await CustomReservation.find({
            
            ...objToSearch,
            "event": {
                $regex: event || '',
                $options: 'i'
            }
        }).populate('user', 'name');
        data.push(...data2);
        
        if(Object.keys(objToSearch).length > 0){
            
            const data3 = await TransferReservation.find({
                ...objToSearch
            }).populate('user', 'name');
            data.push(...data3);
        }
        
        

        if( data.length === 0 ){
            return res.status(201).json({
                ok: false,
                message: 'Data no encontrada',
                request: ['Parametros de busqueda', { confirmation, date, event, lastName }],
            });
        }else if( data.length > 0 ){
            
            const filters = [];
            const params = [confirmation, date, event, lastName];
            params.map(filter => {
                if( filter !== null){
                    filters.push(filter);
                }    
            });

            /**
             * Eliminar datos duplicados
             */

            const dataUnique = clearDuplicatedData(data);

            return res.status(200).json({
                ok: true,
                length: dataUnique.length,
                filters,
                request: ['Parametros de busqueda', { confirmation, date, event, lastName }],
                data: dataUnique,
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error, contacte a su administrador',
            error: error.message,
        });
        
    }

}

const clearDuplicatedData = (data) => {
    const uniqueData = [];
    data.map((item, index) => {
        if( !uniqueData.find(itemUnique => itemUnique.confirmation === item.confirmation) ){
            uniqueData.push(item);
        }

    });
    return uniqueData;
}




module.exports = {
    searchDataById,
    advancedSearch,
}