const {Schema, model} = require('mongoose');
const { types } = require('../types/types');

const TransferReservationSchema = new Schema({
    confirmation:{
        type: String,
        required: true,
        unique: true,
    },
    origin:{
        type: String,
        required: true,
        default: 'Hotel',
    },
    destination: {
        type: String,
        required: true,
    },
    transfer:{
        type: Schema.Types.ObjectId,
        ref: 'Transfer',
        required: false,
    },
    date:{
        type: Date,
        required: true
    },
    time:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    commission : {
        type: Number,
        required: true
    },
    information:{
        type: String,
        required: false,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        required: false,
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
    status:{
        type: String,
        required: true,
        default: types.reservationPending,
    },
    user : {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    pattern:{
        type: String,
        required: true,
        default: 'TRANSFER_RESERVATION',
    }
});

TransferReservationSchema.method('toJSON', function() {
    const {_id, __v, ...object} = this.toObject();
    object.id = _id;
    return object;
})

module.exports = model('TransferReservation', TransferReservationSchema);