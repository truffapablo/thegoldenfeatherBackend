const jwt = require('jsonwebtoken');
const generateJWT = (uid, name) => {
    
    return new Promise((resolve, reject) => {
        const payload = {uid, name};
        jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: 60 * 60 * 24 * 30
            //expiresIn: '1h'
        }, (err, token) => {
            if(err) {
                reject('No se pudo generar el token');
            }
            resolve(token);
        });
    });
    
   
}


module.exports = {
    generateJWT,
}