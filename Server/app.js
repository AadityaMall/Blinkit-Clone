import fastify from "fastify";
import { connectDb } from "./src/config/connect.js";
import "dotenv/config";
import { admin, buildAdminRouter } from "./src/config/setup.js";
import { registerRoutes } from "./src/routes/CombinedRoutes.js";
import fastifySocketIO from "fastify-socket.io";
const PORT = process.env.PORT || 3000;

const start = async () => {
  await connectDb(process.env.DB_URI);
  const app = fastify();
  app.register(fastifySocketIO, {
    cors: {
      origin: "*",
    },
    pingInterval: 10000,
    pingTimeout: 5000,
    transports: ["websocket"],
  });
  await registerRoutes(app);
  await buildAdminRouter(app);

  app.listen({ port: PORT}, (err, addr) => {
    if (err) {
      console.log(err);
    } else {
      console.log(
        `Blinkit Started on http://localhost:${PORT}${admin.options.rootPath}`
      );
    }
  });
  app.ready().then(() => {
    app.io.on("connection", (socket) => {
      console.log("A User Connected");
      socket.on("joinRoom", (orderId) => {
        socket.join(orderId);
        console.log("User Joined Room ", orderId);
      });
      socket.on("disconnect", () => {
        console.log("User Disconnected");
      });
    });
  });
};

start();
