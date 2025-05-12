export default function socketIo(io) {
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Admin joins admin room
    socket.on("join-admin", () => {
      socket.join("admin-room");
      console.log(`Socket ${socket.id} joined admin-room`);
    });

    // Notify admins about a new order
    socket.on("order-placed", (orderId) => {
      io.to("admin-room").emit("placed-order", orderId);
      console.log(`Order placed: ${orderId}`);
    });

    // Notify admins about order status update
    socket.on("order-updated", (data) => {
      io.to("admin-room").emit("order-updated-status", data);
      console.log(`Order updated:`, data);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
}
