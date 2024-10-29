import 'dotenv/config'
import fastifySession from '@fastify/session'
import ConnectMongoDBSession from "connect-mongodb-session"
import {Admin} from "../models"

const MongoDBStore =  ConnectMongoDBSession(fastifySession)

export const sessionStore = new MongoDBStore({
    uri:process.env.DB_URI,
    collection:'sessions'
})

sessionStore.on("error",(error)=>{
    console.log("Session Store Error ", error );
})