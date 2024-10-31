import Product from "../../models/products.js";

export const getProductsByCategoryId = async (req, res) => {
  try {
    console.log("control here")
    const { categoryId } = req.params;
    const products = await Product.find({category:categoryId});
    return res.send(products);
  } catch (error) {
    return res.status(500).send({ message: "An error occured", error });
  }
};
