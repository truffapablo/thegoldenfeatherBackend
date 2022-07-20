
const moment = require('moment-timezone');
const { types } = require('../types/types');
const eventReservationMail = (reservation) => {
    return emailBody = `
                <h1>${reservation.firstName} ${reservation.lastName}, el estado de tu reserva es: <b>${reservation.status}.</b></h1>
                <p>Confirmación: ${reservation.confirmation}.</p>
                <p>Fecha: ${moment.utc(reservation.date).format('DD-MM-YYYY')}.</p>
                <p>Evento: ${reservation.event.title}.</p>
                <p>Cantidad de personas: ${reservation.peopleQuantity}.</p>
                <p>Precio final por persona: ${reservation.event.currency} ${reservation.peopleQuantity * (reservation.event.price + reservation.event.commission)}.</p>
                <hr/>
                <h2>Datos importantes del evento al que vas a asistir:</h2>
                <ul>
                    <li>Dirección: ${reservation.event.address}.</li>
                    <li>Localidad: ${reservation.event.location}.</li>
                    <li>Ciudad: ${reservation.event.city}.</li>
                    <li>Empieza: ${reservation.event.start}hs.</li>
                    <li>Finaliza: ${reservation.event.end}hs.</li>
                    
                </ul>
                <br/>
                ${reservation.status !== types.reservationCancelled? ' <h3>Que disfrutes del paseo!</h3>':''}
               
                `;
    
}


const customReservationMail = (reservation) => {
    return emailBody = `
                <h1>${reservation.firstName} ${reservation.lastName}, el estado de tu reserva es: <b>${reservation.status}.</b></h1>
                <p>Confirmación: ${reservation.confirmation}.</p>
                <p>Fecha: ${moment.utc(reservation.date).format('DD-MM-YYYY')}.</p>
                <p>Evento: ${reservation.event}.</p>
                <p>Cantidad de personas: ${reservation.peopleQuantity}.</p>
                <p>Precio total: ${reservation.price > 0 ? 'ARS' + (reservation.price + reservation.commission):'no definido'}.</p>
                <br/>
                ${reservation.status !== types.reservationCancelled? ' <h3>Que disfrutes del paseo!</h3>':''}
                `;
}
const transferReservationMail = (reservation) => {
    return emailBody = `
                <h1>${reservation.firstName} ${reservation.lastName}, el estado de tu reserva es: <b>${reservation.status}.</b></h1>
                <p>Confirmación: ${reservation.confirmation}.</p>
                <p>Fecha: ${moment.utc(reservation.date).format('DD-MM-YYYY')}.</p>
                <p>Evento: Reserva de transfer.</p>
                <p>Cantidad de personas: ${reservation.peopleQuantity}.</p>
                <p>Precio total: ARS ${reservation.price + reservation.commission}.</p>
                <hr/>
                <h2>Datos importantes de tu reserva:</h2>
                <ul>
                   <li>Origen: ${reservation.origin}</li>
                   <li>Destino: ${reservation.destination}</li>
                   <li>Horario: ${reservation.time}hs</li>
                   ${reservation.information? `<li>Información adicional: ${reservation.information}</li>`:''} 
                </ul>
                <br/>
                ${reservation.status !== types.reservationCancelled? ' <h3>Que disfrutes del paseo!</h3>':''}
                `;
}


module.exports = {
    eventReservationMail,
    customReservationMail,
    transferReservationMail
}