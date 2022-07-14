const {Schema, model} = require('mongoose');

const LogSchema = new Schema({
    action: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reservation: {
        type: Schema.Types.ObjectId,
        ref: 'Reservation',
        required: true
    },
    date: {
        type: String,
        required: true
    },
    changes: {
        type: String,
        required: false
    }
});


module.exports = model('Log', LogSchema);