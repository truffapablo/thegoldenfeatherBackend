const moment = require('moment');

const fecha = '2022-07-19T00:00:00.000+00:00';

const parse = moment.utc(fecha).format('DD-MM-YYYY')

const parse2 = moment(fecha.split('T')[0]).format('DD-MM-YYYY');

console.log(parse2);