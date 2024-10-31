import mongoose from "mongoose";
import "dotenv/config.js"
import {Category, Product} from "./src/models/ModelCombined.js"
import { categories, products } from "./src/config/seedData.js";

async function seedDatabse(){
    try {
        await mongoose.connect(process.env.DB_URI);
        const categoryDocuments =  await Category.insertMany(categories);
        
        const categoryMap =  categoryDocuments.reduce((map,category)=>{
            map[category.name]=category._id;
            return map;
        },{})

        const productWithCategoryIds =  products.map((product)=>({
            ...product,
            category:categoryMap[product.category]
        }))

        await Product.insertMany(productWithCategoryIds);

        console.log(`Database Seeded`);

    } catch (error) {
        console.log(`Error Seeding Database : ${error}`);
    } finally {
        mongoose.connection.close()
    }
}

seedDatabse();