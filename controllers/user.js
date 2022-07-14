const { response } = require('express');
const User = require('../models/User');
const role = require('../types/role');

const getUsers = async (req, res = response) => {
    try {
        const users = await User.find({role:role.employee});
        users.map(user => {
            user.password = '*********';
        });
        return res.status(201).json({
            ok:true,
            users
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            message:'Error, contacte a su administrador'
        });
    }
}

module.exports = {
    getUsers
}