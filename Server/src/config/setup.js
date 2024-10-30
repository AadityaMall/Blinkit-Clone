import AdminJS from "adminjs";
import * as AdminJSMongoose from "@adminjs/mongoose";
import AdminJSFastify from "@adminjs/fastify";
import * as Models from "../models/ModelCombined.js";
import { authenticate, sessionStore } from "./config.js";
import { dark, light, noSidebar } from "@adminjs/themes";
AdminJS.registerAdapter(AdminJSMongoose);

export const admin = new AdminJS({
  resources: [
    {
      resource: Models.Customer,
      options: {
        listProperties: ["phone", "role", "isActivated"],
        filterProperties: ["phone", "role"],
      },
    },
    {
      resource: Models.Admin,
      options: {
        listProperties: ["name", "email", "role", "isActivated"],
        filterProperties: ["name", "role"],
      },
    },
    {
      resource: Models.DeliveryPartner,
      options: {
        listProperties: ["phone", "role", "isActivated"],
        filterProperties: ["phone", "role"],
      },
    },
    {
      resource: Models.Branch,
    },
    {
      resource: Models.Product,
      options: {
        listProperties: ["name", "price", "category"], // Make sure these fields exist in the schema
        filterProperties: ["name", "category"],
      },
    },
    {
      resource: Models.Category,
    },
    {
      resource: Models.Order,
    },
    {
      resource: Models.Counter,
    },
  ],
  branding: {
    companyName: "Blinkit",
    withMadeWithLove: false,
    favicon:
      "https://res.cloudinary.com/dqjeist4k/image/upload/v1730192478/Blinkit/blinkit-logo_j6jfbr.png",
    logo: "https://res.cloudinary.com/dqjeist4k/image/upload/v1730192478/Blinkit/blinkit-logo_j6jfbr.png",
  },
  availableThemes: [dark, light, noSidebar],
  rootPath: "/admin",
});

export const buildAdminRouter = async (app) => {
  await AdminJSFastify.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookiePassword: process.env.COOKIE_PASSWORD,
      cookieName: "adminJS",
    },
    app,
    {
      store: sessionStore,
      saveUnintialized: true,
      secret: process.env.COOKIE_PASSWORD,
      cookie: {
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      },
    }
  );
};
