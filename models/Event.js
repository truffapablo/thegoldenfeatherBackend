const {Schema, model} = require('mongoose');

const EventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price : {
        type: Number,
        required: true
    },
    commission : {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true,
        default: 'USD'
    },
    schedule:{
        /**
         * Dias de la semana en que se realiza el evento
         * TODO: 
         * 1. Agregar opciones para que el usuario pueda elegir los dias de la semana
         * 2. Cambiar el tipo de dato para que levante un array de strings
         */
        type: String,
        required: true
     },
    start : {
        type: String,
        required: true
    },
    end : {
        type: String,
        required: true
    },
    location : {
        type: String,
        required: true
    },
    address : {
        type: String,
        required: true
    },
    city : {
        type: String,
        required: true
    },
    user : {
        //Quien creo el evento
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
});

/**
 * Cuando la API imprima un json, se imprimirá el objeto que se le pase con sus modificaciones
 * Esto no modifica el objeto original, sino que crea una copia del mismo
 */
EventSchema.method('toJSON', function() {
    const {_id, __v, ...object} = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model('Event', EventSchema);
