const moment = require('moment-timezone');
const tz = moment().tz("America/Argentina/Buenos_Aires");

const customReservationSeeder = (id) =>{
    return [
        {
            confirmation:   moment().unix()+20,
            firstName:      'Pablo',
            lastName:       'Truffa',
            event:          'Sushi Club Palermo',
            email:          'pablo.truffa@davinci.edu.ar',
            date:           tz.format('YYYY-MM-DD'),
            time:           '21:30',
            phone:          '1199996666',
            peopleQuantity: 2,
            roomNumber:     100,
            price:          0,
            commission:     1000,
            user:           id,
        },
        {
            confirmation:   moment().unix()+21,
            firstName:      'Micaela',
            lastName:       'Vega',
            event:          'Kika Club',
            email:          'mvega@gmail.com',
            date:           tz.format('YYYY-MM-DD'),
            time:           '21:30',
            phone:          '1199996666',
            peopleQuantity: 4,
            roomNumber:     300,
            price:          0,
            commission:     2000,
            user:           id,
        },
        {
            confirmation:   moment().unix()+22,
            firstName:      'Ricargo',
            lastName:       'Gomez',
            event:          'Jardin Japones',
            email:          'ricargogomez@hotmail.com',
            date:           tz.format('YYYY-MM-DD'),
            time:           '16:30',
            phone:          null,
            peopleQuantity: 2,
            roomNumber:     1005,
            price:          0,
            commission:     0,
            user:           id,
        },
        {
            confirmation:   moment().unix()+23,
            firstName:      'Lucia Jazmin',
            lastName:       'Lareo',
            event:          'Fiesta Bresh',
            email:          'ljlareo@hotmail.com',
            date:           tz.format('YYYY-MM-DD'),
            time:           '23:30',
            phone:          null,
            peopleQuantity: 2,
            roomNumber:     802,
            price:          0,
            commission:     2000,
            user:           id,
        },
    ];
}

module.exports = {
    customReservationSeeder
}