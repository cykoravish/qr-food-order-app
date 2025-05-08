export default function socketIo(io) {
  
io.on('connection', (socket) => {

    socket.on('join-admin', () => {
        socket.join('admin-room');
    });

    socket.on('order-placed', (orderId) => {
        io.to('admin-room').emit('placed-order', orderId); // Only send to Admins
    });

    socket.on('order-updated', (data) => {
        io.to('admin-room').emit('order-updated-status', data); // Only send to Admins
    });

    socket.on('disconnect', () => {
        // console.log('user disconnect', socket.id);
    });
});
}
