const moment = require('moment-timezone');
const tz = moment().tz("America/Argentina/Buenos_Aires");

const today     = moment().format('YYYY-MM-DD');

const tomorrow  = moment().add(1,'days').format('YYYY-MM-DD');

const yesterday = moment().add(-1, 'days').format('YYYY-MM-DD');

const nextWeek  = moment().add(1,'week').format('YYYY-MM-DD');




const transferReservationSeeder = (transfers, id) => {
    
    return [
        {
            confirmation:       new Date().getTime(),
            origin:             transfers[0].origin,
            destination:        transfers[0].destination,
            transfer:           transfers[0].id,
            date:               nextWeek,
            time:               '22:00',
            price:              transfers[0].price,
            commission:         transfers[0].commission,
            information:        'Lleva 1 equipaje de mano',
            firstName:          'Pablo',
            lastName:           'Truffa',
            email:              'pablo.truffa@davinci.edu.ar',
            phone:              '1199996666',
            peopleQuantity:     1,
            roomNumber:         100,
            user:               id,
        },
        {
            confirmation:       new Date().getTime(),
            origin:             transfers[1].origin,
            destination:        transfers[1].destination,
            transfer:           transfers[1].id,
            date:               nextWeek,
            time:               '23:00',
            price:              transfers[1].price,
            commission:         transfers[1].commission,
            information:        null,
            firstName:          'Micaela',
            lastName:           'Vega',
            email:              'mvega@gmail.com',
            phone:              null,
            peopleQuantity:     2,
            roomNumber:         300,
            user:               id,
        },
        {
            confirmation:       new Date().getTime(),
            origin:             'Hotel',
            destination:        'Tigre',
            transfer:           null,
            date:               tomorrow,
            time:               '12:00',
            price:              3500,
            commission:         500,
            information:        null,
            firstName:          'Lucia',
            lastName:           'Lareo',
            email:              'lucialareo@gmail.com',
            phone:              null,
            peopleQuantity:     3,
            roomNumber:         1204,
            user:               id,
        },
    ];
}

module.exports = {
    transferReservationSeeder
}