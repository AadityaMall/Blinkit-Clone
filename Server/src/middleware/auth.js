import jwt from "jsonwebtoken";

export const verifyToken = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(500).send({ message: "Access Token Required" });
    }
    const token =  authHeader.split(" ")[1];
    const decoded =  jwt.verify(token,process.env.JWT_SECRET_ACCESS)
    req.user =  decoded;
    return true;
  } catch (error) {
    return res.status(403).send({ message: "Invalid or Expired Token" });
  }
};
