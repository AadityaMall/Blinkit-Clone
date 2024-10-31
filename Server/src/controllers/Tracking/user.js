import { Customer, DeliveryPartner } from "../../models/ModelCombined.js";

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.user;
    const updateData = req.body;

    let user =
      (await Customer.findById(userId)) ||
      (await DeliveryPartner.findById(userId));

    if (!user) {
      return res.status(404).send({ message: "User Not Found" });
    }

    let userModel;

    if (user.role === "Customer") {
      userModel = Customer;
    } else if (user.role === "DeliveryPartner") {
      userModel = DeliveryPartner;
    } else {
      return res.status(401).send({ message: "Invalid Role" });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).send({ message: "User Not Found" });
    }
    return res.status(200).send({ message: "User Updated", updatedUser });
  } catch (error) {
    return res.status(500).send({ message: "Error Updating User" });
  }
};
