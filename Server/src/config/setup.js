import AdminJS from "adminjs";
import * as AdminJSMongoose from "@adminjs/mongoose";
import AdminJSFastify from "@adminjs/fastify";
import * as Models from "../models/ModelCombined.js";
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
        listProperties: ["phone", "role", "isActivated"],
        filterProperties: ["phone", "role"],
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
  ],
  branding:{
    companyName:"Blinkit",
    withMadeWithLove:false
  },
  rootPath:"/admin",
});

export const buildAdminRouter = async(app) => {
    await AdminJSFastify.buildAuthenticatedRouter(
        admin,{}, app,{store:sessionStorage}
    )
}
