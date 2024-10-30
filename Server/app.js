import fastify from "fastify";
import { connectDb } from "./src/config/connect.js";
import "dotenv/config";
import { admin, buildAdminRouter } from "./src/config/setup.js";
import { registerRoutes } from "./src/routes/CombinedRoutes.js";

const start = async () => {
  await connectDb(process.env.DB_URI);
  const app = fastify();
  const PORT = process.env.PORT || 3000;
  await registerRoutes(app);
  await buildAdminRouter(app);

  app.listen({ port: PORT, host: "0.0.0.0" }, (err, addr) => {
    if (err) {
      console.log(err);
    } else {
      console.log(
        `Blinkit Started on http://localhost:${PORT}${admin.options.rootPath}`
      );
    }
  });
};

start();
