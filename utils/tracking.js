import { Server } from "socket.io";

let emitOrderStatus = () => {};

export function setupOrderTracking(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", 
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("subscribeOrder", (orderId) => {
      socket.join(orderId); 
    });
  });

  emitOrderStatus = function(orderId, status) {
    io.to(orderId).emit("orderStatusUpdate", { orderId, status });
  };
}

export { emitOrderStatus };