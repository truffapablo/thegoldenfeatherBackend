const {Schema, model} = require('mongoose');

const TransferSchema = new Schema({
    origin:{
        type: String,
        required: true,
        default: 'Hotel',
    },
    destination: {
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true
    },
    commission : {
        type: Number,
        required: true
    },
    user : {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

});

TransferSchema.method('toJSON', function() {
    const {_id, __v, ...object} = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model("Transfer", TransferSchema);