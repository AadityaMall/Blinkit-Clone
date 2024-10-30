import "dotenv/config";
import fastifySession from "@fastify/session";
import ConnectMongoDBSession from "connect-mongodb-session";
import { Admin } from "../models/ModelCombined.js";

const MongoDBStore = ConnectMongoDBSession(fastifySession);

export const sessionStore = new MongoDBStore({
  uri: process.env.DB_URI,
  collection: "sessions",
});

sessionStore.on("error", (error) => {
  console.log("Session Store Error ", error);
});

export const authenticate = async (email, password) => {
  if (email && password) {
    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) {
      return null;
    }
    const isPasswordMatched = await admin.comparePassword(password);
    if (isPasswordMatched) {
      return Promise.resolve({ email: email, password: password });
    } else {
      return null;
    }
  }
};
