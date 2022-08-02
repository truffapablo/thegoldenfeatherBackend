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
            firstName:      'Lucas',
            lastName:       'Adorno',
            event:           events[0],
            email:          'lucasadorno@email.com',
            date:            today,
            phone:          '1199996777',
            peopleQuantity: 1,
            roomNumber:     100,
            user:           id,
        },
        {
            confirmation:   moment().unix()+3,
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
            confirmation:   moment().unix()+4,
            firstName:      'Susana',
            lastName:       'Velez',
            event:           events[2],
            email:          'susanavelez@email.com',
            date:            today,
            phone:           null,
            peopleQuantity: 3,
            roomNumber:     200,
            user:           id,
        },
        {
            confirmation:   moment().unix()+5,
            firstName:      'Agostina',
            lastName:       'Acirdiácono',
            event:           events[0],
            email:          'agostina20445@email.com',
            date:            today,
            phone:           null,
            peopleQuantity: 1,
            roomNumber:     200,
            user:           id,
        },
        {
            confirmation:   moment().unix()+6,
            firstName:      'Micaela',
            lastName:       'Vega',
            event:           events[2],
            email:          'mvega@email.com',
            date:            tomorrow,
            phone:           null,
            peopleQuantity: 2,
            roomNumber:     300,
            user:           id,
        },
        {
            confirmation:   moment().unix()+7,
            firstName:      'Fernanda',
            lastName:       'Salazar',
            event:           events[0],
            email:          'fsalazar@email.com',
            date:            nextWeek,
            phone:           null,
            peopleQuantity: 4,
            roomNumber:     105,
            user:           id,
        },
        {
            confirmation:   moment().unix()+8,
            firstName:      'Federico',
            lastName:       'Ramirez',
            event:           events[0],
            email:          'framirez@email.com',
            date:            nextWeek,
            phone:           null,
            peopleQuantity: 2,
            roomNumber:     712,
            user:           id,
        },
        {
            confirmation:   moment().unix()+9,
            firstName:      'Federico',
            lastName:       'Almirante',
            event:           events[0],
            email:          'falmirante@email.com',
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