import { Customer, DeliveryPartner } from "../../models/ModelCombined.js";
import jwt from "jsonwebtoken";

const generateJWTToken = (user) => {
  const accessToken = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET_ACCESS,
    { expiresIn: "1d" }
  );
  const refreshToken = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET_REFRESH,
    { expiresIn: "1d" }
  );
  return { accessToken, refreshToken };
};

export const loginCustomer = async (req, res) => {
  try {
    const { phone } = req.body;
    let customer = await Customer.findOne({ phone });
    if(!customer.isActivated){
      return res.status(401).send({messae:"Not Activated Yet"})
    }
    if (!customer) {
      customer = new Customer({ phone, role: "Customer", isActivated: true });
      await customer.save();
    }
    const { accessToken, refreshToken } = generateJWTToken(customer);

    return res.status(200).send({
      message: customer
        ? "Logged In Successfully"
        : "User Created and Logged In!",
      accessToken,
      refreshToken,
      customer,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Error Occured in Login", error: error });
  }
};

export const loginDeliveryPartner = async (req, res) => {
  try {
    const { email, password } = req.body;
    let deliveryPartner = await DeliveryPartner.findOne({ email });

    if (!deliveryPartner) {
      return res.status(404).send({ message: "Partner Not Found" });
    }
    console.log(deliveryPartner);
    const passwordMatched = deliveryPartner.comparePassword(password);
    if (!passwordMatched) {
      return res.status(400).send({ message: "passwords dont match" });
    }
    const { accessToken, refreshToken } = generateJWTToken(deliveryPartner);
    
    return res.status(200).send({
      message: "Logged In Successfully",
      accessToken,
      refreshToken,
      deliveryPartner,
    });
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .send({ message: "Error Occured in Login", error: error });
  }
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).send({ message: "Refresh Token Required" });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
    let user;
    if (decoded.role === "Customer") {
      user = await Customer.findById(decoded.userId);
    } else if (decoded.role === "DeliveryPartner") {
      user = await DeliveryPartner.findById(decoded.userId);
    } else {
      return res.status(403).send({ message: "Invalid Role" });
    }
    if(!user){
      return res.status(403).send({ message: "Invalid Refresh Token" });
    }
    const {accessToken,refreshToken:newRefreshToken} =  generateJWTToken(user);
    res.status(200).send({
        message: "Token Refreshed",
        accessToken,
        newRefreshToken,
      });

  } catch (e) {
    return res.status(403).send({ message: "Invalid Refresh Token", error: e });
  }
};

export const fetchUser =  async (req,res) => {
    try {
        const {userId, role} =  req.user

        let user;
        if (role === "Customer") {
          user = await Customer.findById(userId);
        } else if (role === "DeliveryPartner") {
          user = await DeliveryPartner.findById(userId);
        } else {
          return res.status(403).send({ message: "Invalid Role" });
        }
        if(!user){
          return res.status(403).send({ message: "Invalid Refresh Token" });
        }
        return res.status(200).send({
            message: "User Fetched",
            user
          });
    } catch (error) {
      console.log(error);
        return res.status(500).send({message:"Error Fetching User", error})
    }
}