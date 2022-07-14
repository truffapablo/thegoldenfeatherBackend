const {response} = require('express');
const User = require("../models/User");
const role = require('../types/role');

const isAdmin = async (req, res = response, next) => {

        try {
            const user = await User.findOne({_id:req.uid});
            if(!user){
                return res.status(404).json({
                    ok: false,
                    msg: 'Error, contacte a su administrador',
                    user
                });
            }else{
                if(user.role !== role.admin){
                    return res.status(401).json({
                        ok:false,
                        message:'No tienes los permisos suficientes para acceder.'
                    });
                }
                next();
            }
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                ok: false,
                msg: 'Error, contacte a su administrador',
            });
        }
}

module.exports = { isAdmin }