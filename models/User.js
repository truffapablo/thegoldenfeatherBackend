
const {Schema, model} = require('mongoose');
const role = require('../types/role');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        default: role.employee,
        required: true
    },
    changePassword:{
        type:Boolean,
        default:true
    },
    password: {
        type: String,
        required: true,
    },
    access:{
        type:Boolean,
        default:true,
        required:true
    }
});


UserSchema.method('toJson', function(){
    const {_id, __v, ...object} = this.toObject();
    object.id = _id;
    object.password = '*********';
    return object;
});

module.exports = model('User', UserSchema);