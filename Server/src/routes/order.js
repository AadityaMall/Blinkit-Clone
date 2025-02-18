import { confirmOrder, createOrder, getOrderById, getOrders, updateOrder } from "../controllers/order/order.js"
import { verifyToken } from "../middleware/auth.js"

export const orderRoutes =  async(fastify,options)=>{
    fastify.addHook("preHandler",async(req,res)=>{
        const isAuthenticated =  await verifyToken(req,res)
        if(!isAuthenticated){
            return res.status(401).send({message:"Not Authenticated"})
        }
    })
    fastify.post('/order',createOrder);
    fastify.get('/order',getOrders);
    fastify.patch('/order/:orderId/status',updateOrder);
    fastify.post('/order/:orderId/confirm',confirmOrder);
    fastify.get('/order/:orderId',getOrderById);
}