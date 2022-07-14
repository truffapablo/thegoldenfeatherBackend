const {Schema, model} = require('mongoose');
const ReservationStatusSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
});
/**
 * Cuando la API imprima un json, se imprimirá el objeto que se le pase con sus modificaciones
 * Esto no modifica el objeto original, sino que crea una copia del mismo
 */
 ReservationStatusSchema.method('toJSON', function() {
    const {_id, __v, ...object} = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model('ReservationStatus', ReservationStatusSchema);