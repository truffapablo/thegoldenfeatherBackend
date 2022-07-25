const express = require('express');
const cors = require('cors');
const {dbConnection} = require('../database/config');
const { socketController } = require('../sockets/controllers');
const path = require('path');


class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT || 4001;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);

        this.connectDB();
        //Middlewares
        this.middlewares();


        //Rutas
        this.routes();

        this.sockets();

    }

    async connectDB() {
        await dbConnection();
    }

    middlewares() {

        /**
         * Check Pull from git
         */
        this.app.use(cors({
            origin:'*'
        }));
        this.app.use(express.json());
        this.app.use(express.static('public'));
        
    }

    sockets(){
        this.io.on("connection", socketController);
    }

    routes(){
        this.app.use('/api/testing', require('../routes/testingRoute'));
        this.app.use('/api/auth', require('../routes/auth'));
        this.app.use('/api/events', require('../routes/events'));
        this.app.use('/api/transfer', require('../routes/transfer'));
        this.app.use('/api/transfer-reservation', require('../routes/transferReservation'));
        this.app.use('/api/reservations', require('../routes/reservations'));
        this.app.use('/api/custom-reservations', require('../routes/customReservations'));
        this.app.use('/api/search-reservations', require('../routes/searchReservations'));
        this.app.use('/api/logs', require('../routes/logs'));
        this.app.use('/api/reservation-status', require('../routes/reservationStatus'));
        this.app.use('/api/mail-client', require('../routes/mailClient'));
        this.app.use('/api/reports', require('../routes/reports'));
        this.app.use('/api/seeder', require('../routes/seeder'));

        /**
         * Comodín de redirección
         */
        this.app.get('*', (req, res) =>{
            res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
        });
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto ', this.port);
        })
    }

}

module.exports = {
    Server
}