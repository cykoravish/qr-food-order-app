import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import db from "./Db/MongoDb.js";
import AuthRoutes from "./Router/User.Router.js";
import ProductsRoute from "./Router/Products.Router.js";
import CartRoutes from "./Router/Cart.router.js";
import OrderRoutes from "./Router/Order.route.js";
import SalesRouter from "./Router/Sales.router.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import "./Services/Cron/Resetqty.js";
import { createServer } from "node:http";
import { Server } from "socket.io";
import socketIo from "./Socket/Socket.js";
import helmet from "helmet";
import compression from "compression";
import ProtectedRoute from "./Service/ProtectedRoute.js";
import "./Services/Cron/Resetqty.js";
dotenv.config();
const __Filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__Filename);

const app = express();
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
    xDownloadOptions: false,
  })
);

app.use(compression({ filter: shouldCompress }));

function shouldCompress(req, res) {
  if (req.headers["x-no-compression"]) {
    return false;
  }

  return compression.filter(req, res);
}

const allowedOrigins = [
  "http://localhost:5173",
  "https://hilarious-mermaid-cc36ae.netlify.app/",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// socketIo(io);
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Admin joins admin room
  socket.on("join-admin", () => {
    socket.join("admin-room");
    console.log(`Socket ${socket.id} joined admin-room`);
  });

  // Notify admins about a new order
  socket.on("order-placed", () => {
    io.to("admin-room").emit("placed-order", () => {
      console.log("admin in the room");
    });
    console.log(`Order placed`);
  });

  // Notify admins about order status update
  socket.on("order-updated", () => {
    io.to("admin-room").emit("order-updated-status");
    console.log(`Order updated:`);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "/uploads")));

db();
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/products", ProductsRoute);
app.use("/api/v1/carts", CartRoutes);
app.use("/api/v1/orders", OrderRoutes);
app.use("/api/v1/sales", ProtectedRoute, SalesRouter);

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err); // Pass to default handler if response already sent
  }

  console.error("❌ Error caught by middleware:", err);

  res.status(500).json({
    message: "Internal Server Error",
    error: err.message || "Unexpected error",
  });
});

server.listen(5000, () => console.log("server connected 5000"));
