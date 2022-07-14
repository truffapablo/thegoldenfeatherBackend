
const {Schema, model} = require('mongoose');
const { types } = require('../types/types');

const CustomReservationSchema = new Schema({
    confirmation:{
        type: String,
        required: true,
        unique: true,
    },

    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true
    },
    event: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,
        default: null,
        unique: false
    },
    date:{
        type: Date,
        required: true
    },
    time:{
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false,
        default: null,
    },
    peopleQuantity: {
        type: Number,
        required: true,
        default: 1,
    },
    roomNumber:{
        type: Number,
        required: true
    },
    price:{
        type: Number,
        required: false
    },
    commission:{
        type: Number,
        required: true
    },
    user : {
        //Que usuario creo la reserva
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        default: types.reservationPending,
        required: true
    },
    pattern:{
        type: String,
        required: true,
        default: 'CUSTOM_RESERVATION',
    }
    
});

/**
 * Cuando la API imprima un json, se imprimirá el objeto que se le pase con sus modificaciones
 * Esto no modifica el objeto original, sino que crea una copia del mismo
 */
 CustomReservationSchema.method('toJSON', function() {
    const {_id, __v, ...object} = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model('CustomReservation', CustomReservationSchema);