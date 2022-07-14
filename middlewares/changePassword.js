
const {response} = require('express');
const User = require('../models/User');

const changePassword = async ( req , res = response, next) =>{
    
    const user = await User.findOne({_id:req.uid});
    if(!user){
        return res.status(500).json({
            ok: false,
            msg: 'Error, contacte a su administrador'
        });
    }

    if(user.changePassword){
        return res.status(201).json({
            ok: true,
            msg: 'Por favor, tiene que cambiar su clave de ingreso para continuar.'
        });
    }
    
    next();
}

module.exports = {changePassword}