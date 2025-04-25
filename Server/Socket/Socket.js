export default function socketIo(io) {
    // Connect io or socket
    io.on('connection', (socket) => {
        console.log(`⚡: ${socket.id} user just connected!`);
        socket.emit('order-updated', 'hello world');  // Send an initial message

        // Handle 'order-placed' event
        socket.on('order-placed', (data) => {
            console.log('Order placed:', (data));
            socket.emit('updated-order', data);  // Emit updated order to the same socket
        });

        // Handle 'order-status-updated' event
        socket.on('order-status-updated', (data) => {
            console.log('Order status updated', JSON.stringify(data));
            io.emit('order-status-updated');  // Emit to all connected clients
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`🔥: User ${socket.id} disconnected`);
        });

        // Error handling (optional, but good practice)
        socket.on('error', (error) => {
            console.error('Socket Error:', error);
        });
    });
}
