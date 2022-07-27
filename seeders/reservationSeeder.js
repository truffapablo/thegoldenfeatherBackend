const moment = require('moment-timezone');
const tz = moment().tz("America/Argentina/Buenos_Aires");

const today     = moment().format('YYYY-MM-DD');

const tomorrow  = moment().add(1,'days').format('YYYY-MM-DD');

const yesterday = moment().add(-1, 'days').format('YYYY-MM-DD');

const nextWeek  = moment().add(1,'week').format('YYYY-MM-DD');

const reservationSeeder = (events, id) => {
    return [
        {
            confirmation:   moment().unix()+1,
            firstName:      'Pablo',
            lastName:       'Truffa',
            event:           events[0],
            email:          'pablo.truffa@davinci.edu.ar',
            date:            today,
            phone:          '1199996666',
            peopleQuantity: 1,
            roomNumber:     100,
            user:           id,
        },
        {
            confirmation:   moment().unix()+2,
            firstName:      'Ricardo',
            lastName:       'Perez',
            event:           events[1],
            email:          'rperez@gmail.com',
            date:            today,
            phone:           null,
            peopleQuantity: 2,
            roomNumber:     200,
            user:           id,
        },
        {
            confirmation:   moment().unix()+3,
            firstName:      'Micaela',
            lastName:       'Vega',
            event:           events[2],
            email:          'mvega@gmail.com',
            date:            tomorrow,
            phone:           null,
            peopleQuantity: 2,
            roomNumber:     300,
            user:           id,
        },
        {
            confirmation:   moment().unix()+4,
            firstName:      'Fernanda',
            lastName:       'Salazar',
            event:           events[0],
            email:          'fsalazar@gmail.com',
            date:            nextWeek,
            phone:           null,
            peopleQuantity: 4,
            roomNumber:     105,
            user:           id,
        },
        {
            confirmation:   moment().unix()+5,
            firstName:      'Federico',
            lastName:       'Notox',
            event:           events[0],
            email:          'fnotox@gmail.com',
            date:            nextWeek,
            phone:           null,
            peopleQuantity: 2,
            roomNumber:     712,
            user:           id,
        },
    ];
}

module.exports = {
    reservationSeeder
}