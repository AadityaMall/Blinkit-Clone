import { getAllCategories } from "../controllers/products/categegory.js"
import { getProductsByCategoryId } from "../controllers/products/product.js"

export const productRoutes = async (fastify,options) => {
    fastify.get('/products/:categoryId',getProductsByCategoryId)
}
export const categoryRoutes = async (fastify,options) => {
    fastify.get('/categories',getAllCategories)
}