export default function socketIo(io) {
    // Connect io or socket
    io.on('connection', (socket) => {
        socket.emit('order-updated', 'hello world');  // Send an initial message

        // Handle 'order-placed' event
        socket.on('order-placed', (data) => {
            socket.emit('updated-order', data);  // Emit updated order to the same socket
        });

        // Handle 'order-status-updated' event
        socket.on('order-status-updated', (data) => {
            io.emit('order-status-updated');  // Emit to all connected clients
        });

        // Handle disconnection
        socket.on('disconnect');

        // Error handling (optional, but good practice)
        socket.on('error', (error) => {
            console.error('Socket Error:', error);
        });
    });
}
