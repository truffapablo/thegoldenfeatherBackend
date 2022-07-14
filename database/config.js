
const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.URLDB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Base de datos ONLINE');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

const dbDisconnection = async () => {
    try {
        await mongoose.connection.close();
        console.log('Base de datos OFFLINE');
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    dbConnection,
    dbDisconnection
}