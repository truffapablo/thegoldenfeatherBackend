const {response} = require("express");
const bcrypt = require("bcryptjs/dist/bcrypt");
const User = require("../models/User");
const { generateJWT } = require("../helpers/jwt");
const role = require("../types/role");



const createUser = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        /**
         * Antes de grabar un usuario verificar si ya existe
         */
        let dbUser = await User.findOne({ email });
        if(dbUser){
            return res.status(400).json({
                ok: false,
                msg: "El usuario ya existe",
            });
        }
        const user = new User(req.body);
        //user.role = role.admin;
        
        /**
         * Encriptar el password
         */
        const salt = await bcrypt.genSaltSync(10);
        user.password = await bcrypt.hashSync(password, salt);

        await user.save();

        user.password = '*******';
        return res.status(201).json({
            ok: true,
            message: 'usuario creado',
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error, contacte a su administrador',
        });
    }
};

const loginUser = async (req, res = response) => {
    const { email, password } = req.body;

    try {
        let dbUser = await User.findOne({ email });
        if(!dbUser){
            return res.status(400).json({
                ok: false,
                msg: "El usuario y/o contraseña son incorrectos",
            });
        }

        if(dbUser.access === false) {
            return res.status(401).json({
                ok: false,
                msg:'No tienes los permisos suficientes para acceder.'
            });
        }

        const validPassword = await bcrypt.compareSync(password, dbUser.password);
        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: "El usuario y/o contraseña son incorrectos",
            });
        }
        
        /**
         * Generar token JWT
         */
        const token = await generateJWT(dbUser.id, dbUser.name);
        return res.status(201).json({
            ok: true,
            message: 'usuario logueado',
            uid: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            changePassword: dbUser.changePassword,
            role: dbUser.role,
            access:dbUser.access,
            token,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error, contacte a su administrador',
        });
    }
};

const changeUserPassword = async (req, res = response) => {
    try {
        const user = await User.findOne({_id:req.uid});
        if(!user){
            return res.status(500).json({
                ok: false,
                msg: 'Error, contacte a su administrador'
            });
        }

        const {oldPassword, newPassword} = req.body;
        const validPassword = await bcrypt.compareSync(oldPassword, user.password);
        
        if(!validPassword){
            return res.status(500).json({
                ok: false,
                message: 'Error, contacte a su administrador',
            });
        }
        
        /**
         * Encriptar el password
         */
         const salt = await bcrypt.genSaltSync(10);
         user.password = await bcrypt.hashSync(newPassword, salt);
         user.changePassword = false;
         await user.save();

         return res.status(201).json({
            ok: true,
            message: 'Contraseña actualizada',
            changeUserPassword: false
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error, contacte a su administrador',
        });
    }
}

const logout = async (req, res = response) => {
    try {
        res.status(201).json({
            ok: true,
            message: 'usuario deslogueado',
        });
    } catch (error) {
        console.log(error);
    }
}

const reValidateToken = async (req, res = response) => {

    const uid = req.uid;
    const name = req.name;

    /**
     * Generar un nuevo token JWT
     */

    try {
        const token = await generateJWT(uid, name);
        const user = await User.findOne({_id:req.uid});
        if(!user){
            return res.status(500).json({
                ok: false,
                msg: 'Error, contacte a su administrador'
            });
        }

        if(user.access === false) {
            return res.status(401).json({
                ok: false,
                msg:'No tienes los permisos suficientes para acceder.'
            });
        }
        
        res.status(201).json({
            ok: true,
            uid,
            name,
            email:user.email,
            changePassword:user.changePassword,
            role:user.role,
            access:user.access,
            token,
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error, contacte a su administrador',
        });
    }


}

const grantAccess = async (req, res = response) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user){
            return res.status(404).json({
                ok: false,
                message: 'Error, contacte a su administrador'
            });
        }

        user.access = true;
        await user.save();
        
        return res.status(201).json({
            ok:true,
            message:'Acceso concedido',
            user
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error, contacte a su administrador',
        });
    }
}

const denyAccess = async (req, res = response) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user){
            return res.status(404).json({
                ok: false,
                message: 'Error, contacte a su administrador'
            });
        }

        user.access = false;
        await user.save();
        
        return res.status(201).json({
            ok:true,
            message:`Acceso denegado al usuario: ${user.email}`
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error, contacte a su administrador',
        });
    }
}

const forceToChangePassword = async (req, res = response) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user){
            return res.status(404).json({
                ok: false,
                message: 'Error, contacte a su administrador'
            });
        }

        user.changePassword = true;
        await user.save();
        return res.status(201).json({
            ok:true,
            message:`El usuario: ${user.email} deberá actualizar su contraseña en su proximo inicio de sesión.`
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error, contacte a su administrador',
        }); 
    }
}

const setTemporaryPassword = async (req, res = response) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user){
            return res.status(404).json({
                ok: false,
                message: 'Error, contacte a su administrador'
            });
        }
        const {password} = req.body;

        const salt      = await bcrypt.genSaltSync(10);
        user.password   = await bcrypt.hashSync(password, salt);
        
        user.changePassword = true;

        await user.save();
        return res.status(201).json({
            ok:true,
            message:`El usuario: ${user.email} deberá autenticarse con la clave temporal.`
        });



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error, contacte a su administrador',
        }); 
    }
}

module.exports = {
    createUser,
    loginUser,
    reValidateToken,
    changeUserPassword,
    logout,
    grantAccess,
    denyAccess,
    forceToChangePassword,
    setTemporaryPassword
}