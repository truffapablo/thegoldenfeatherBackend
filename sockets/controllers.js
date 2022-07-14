
const socketController = (socket) => {
    
    
    console.log('Client connected', `SOCKET_ID=${socket.id}`);


    /**
     * TRANSFER SOCKETS
     */
    socket.on('new-transfer', (payload, callback) => {
        
        callback({
            ok:true,
            payload,
            msg:'Compartiendo a todos los usuarios conectados.'
        });

        socket.broadcast.emit('transfer-created', payload);

    });
    
    socket.on('delete-transfer', (payload, callback) => {
        
        callback({
            ok:true,
            payload,
            msg:'Compartiendo a todos los usuarios conectados.'
        });

        socket.broadcast.emit('transfer-deleted', payload);

    });

    socket.on('update-transfer', (payload, callback) => {
        
        callback({
            ok:true,
            payload,
            msg:'Compartiendo a todos los usuarios conectados.'
        });

        socket.broadcast.emit('transfer-updated', payload);

    });
    
    socket.on('update-many-transfer-reservations', (payload, callback) => {
        
        callback({
            ok:true,
            payload,
            msg:'Compartiendo a todos los usuarios conectados.'
        });
        socket.broadcast.emit('many-transfer-reservations-updated', payload);

    });

    /**
     * TRANSFER RESERVATION SOCKETS
     */

    socket.on('new-transfer-reservation', (payload, callback) => {
        
        callback({
            ok:true,
            payload,
            msg:'Compartiendo a todos los usuarios conectados.'
        });
        socket.broadcast.emit('transfer-reservation-created', payload);

    });

    socket.on('update-transfer-reservation', (payload, callback) => {
        
        callback({
            ok:true,
            payload,
            msg:'Compartiendo a todos los usuarios conectados.'
        });
        socket.broadcast.emit('transfer-reservation-updated', payload);

    });

    socket.on('cancel-transfer-reservation', (payload, callback) => {
        
        callback({
            ok:true,
            payload,
            msg:'Compartiendo a todos los usuarios conectados.'
        });
        socket.broadcast.emit('transfer-reservation-canceled', payload);

    });

    socket.on('confirm-transfer-reservation', (payload, callback) => {
        
        callback({
            ok:true,
            payload,
            msg:'Compartiendo a todos los usuarios conectados.'
        });
        socket.broadcast.emit('transfer-reservation-confirmed', payload);

    });

    socket.on('complete-transfer-reservation', (payload, callback) => {
        
        callback({
            ok:true,
            payload,
            msg:'Compartiendo a todos los usuarios conectados.'
        });
        socket.broadcast.emit('transfer-reservation-completed', payload);

    });
    
    socket.on('remove-transfer-reservation', (payload, callback) => {
        
        callback({
            ok:true,
            payload,
            msg:'Compartiendo a todos los usuarios conectados.'
        });
        socket.broadcast.emit('transfer-reservation-removed', payload);

    });

    


    /**
     * EVENT SOCKET
     */
     socket.on('new-event', (payload, callback) => {
        
        callback({
            ok:true,
            payload,
            msg:'Compartiendo a todos los usuarios conectados.'
        });

        socket.broadcast.emit('event-created', payload);

    });
    
    socket.on('delete-event', (payload, callback) => {
        
        callback({
            ok:true,
            payload,
            msg:'Compartiendo a todos los usuarios conectados.'
        });

        socket.broadcast.emit('event-deleted', payload);

    });

    socket.on('update-event', (payload, callback) => {
        
        callback({
            ok:true,
            payload,
            msg:'Compartiendo a todos los usuarios conectados.'
        });

        socket.broadcast.emit('event-updated', payload);

    });
    
    socket.on('update-many-event-reservations', (payload, callback) => {
        
        callback({
            ok:true,
            payload,
            msg:'Compartiendo a todos los usuarios conectados.'
        });
        socket.broadcast.emit('many-event-reservations-updated', payload);

    });

    /**
     * EVENT RESERVATION SOCKETS
     */

     socket.on('new-event-reservation', (payload, callback) => {
        
        callback({
            ok:true,
            payload,
            msg:'Compartiendo a todos los usuarios conectados.'
        });
        socket.broadcast.emit('event-reservation-created', payload);

    });

    socket.on('update-event-reservation', (payload, callback) => {
        
        callback({
            ok:true,
            payload,
            msg:'Compartiendo a todos los usuarios conectados.'
        });
        socket.broadcast.emit('event-reservation-updated', payload);

    });

    socket.on('cancel-event-reservation', (payload, callback) => {
        
        callback({
            ok:true,
            payload,
            msg:'Compartiendo a todos los usuarios conectados.'
        });
        socket.broadcast.emit('event-reservation-canceled', payload);

    });

    socket.on('confirm-event-reservation', (payload, callback) => {
        
        callback({
            ok:true,
            payload,
            msg:'Compartiendo a todos los usuarios conectados.'
        });
        socket.broadcast.emit('event-reservation-confirmed', payload);

    });

    socket.on('complete-event-reservation', (payload, callback) => {
        
        callback({
            ok:true,
            payload,
            msg:'Compartiendo a todos los usuarios conectados.'
        });
        socket.broadcast.emit('event-reservation-completed', payload);

    });

    socket.on('remove-event-reservation', (payload, callback) => {
        
        callback({
            ok:true,
            payload,
            msg:'Compartiendo a todos los usuarios conectados.'
        });
        socket.broadcast.emit('event-reservation-removed', payload);

    });


    /**
     * CUSTOM RESERVATION SOCKETS
     */

     socket.on('new-custom-reservation', (payload, callback) => {
        
        callback({
            ok:true,
            payload,
            msg:'Compartiendo a todos los usuarios conectados.'
        });
        socket.broadcast.emit('custom-reservation-created', payload);

    });

    socket.on('update-custom-reservation', (payload, callback) => {
        
        callback({
            ok:true,
            payload,
            msg:'Compartiendo a todos los usuarios conectados.'
        });
        socket.broadcast.emit('custom-reservation-updated', payload);

    });

    socket.on('cancel-custom-reservation', (payload, callback) => {
        
        callback({
            ok:true,
            payload,
            msg:'Compartiendo a todos los usuarios conectados.'
        });
        socket.broadcast.emit('custom-reservation-canceled', payload);

    });

    socket.on('confirm-custom-reservation', (payload, callback) => {
        
        callback({
            ok:true,
            payload,
            msg:'Compartiendo a todos los usuarios conectados.'
        });
        socket.broadcast.emit('custom-reservation-confirmed', payload);

    });

    socket.on('complete-custom-reservation', (payload, callback) => {
        
        callback({
            ok:true,
            payload,
            msg:'Compartiendo a todos los usuarios conectados.'
        });
        socket.broadcast.emit('custom-reservation-completed', payload);

    });

    socket.on('remove-custom-reservation', (payload, callback) => {
        
        callback({
            ok:true,
            payload,
            msg:'Compartiendo a todos los usuarios conectados.'
        });
        socket.broadcast.emit('custom-reservation-removed', payload);

    });




   

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });


  };


module.exports = {
    socketController
}

