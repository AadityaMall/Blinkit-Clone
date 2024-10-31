import {
  Order,
  Branch,
  Customer,
  DeliveryPartner,
} from "../../models/ModelCombined.js";

export const createOrder = async (req, res) => {
  try {
    const { userId } = req.user;
    const { items, branch, totalPrice } = req.body;
    const customerData = await Customer.findById(userId);
    const branchData = await Branch.find(branch);
    if (!customerData) {
      return res.status(404).send({ message: "Customer Not Found" });
    }
    if (!branchData) {
      return res.status(404).send({ message: "Branch Not Found" });
    }
    const newOrder = new Order({
      customer: userId,
      items: items.map((item) => ({
        id: item.id,
        item: item.item,
        count: item.count,
      })),
      branch,
      totalPrice,
      deliveryLocation: {
        latitude: customerData.liveLocation.latitude,
        longitude: customerData.liveLocation.longitude,
        address: customerData.address || "No Address Available",
      },
      pickupLocation: {
        latitude: branchData.liveLocation.latitude,
        longitude: branchData.liveLocation.longitude,
        address: branchData.address || "No Address Available",
      },
    });
    const savedOrder = await newOrder.save();
    return res.status(201).send({ message: "Order Created" });
  } catch (error) {
    return res.status(500).send({ message: "Error Creating Order" });
  }
};

export const confirmOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.user;
    const { deliveryPersonLocation } = req.body;

    const deliveryPerson = await DeliveryPartner.findById(userId);

    if (!deliveryPerson) {
      return res.status(404).send({ message: "Delivery Person Not Found" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).send({ message: "Order Not Found" });
    }
    if (order.status !== "available") {
      return res.status(400).send({ message: "Order not available" });
    }
    order.status = "confirmed";
    order.deliveryPartner = userId;
    order.deliveryPersonLocation = {
      latitude: deliveryPersonLocation?.latitude,
      longitude: deliveryPersonLocation?.longitude,
      address: deliveryPersonLocation.address || "No Address Available",
    };
    await order.save();
    return res.send(order);
  } catch (error) {
    return res.status(500).send({ message: "Error in COnfirming Order" });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, deliveryPersonLocation } = req.body;
    const { userId } = req.user;
    const deliveryPerson = await DeliveryPartner.findById(userId);
    if (!deliveryPerson) {
      return res.status(404).send({ message: "Delivery Person Not Found" });
    }
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).send({ message: "Order Not Found" });
    }
    if (["cancelled", "delivered"].includes(order.status)) {
      return res.status(400).send({ message: "Order cannot be updated" });
    }
    if (order.deliveryPartner.toString() !== userId) {
      return res.status(403).send({ message: "Unauthorized" });
    }
    order.status = status;
    order.deliveryPersonLocation = deliveryPersonLocation;
    await order.save();
    return res.send(order);
  } catch (error) {
    return res.status(500).send({ message: "Error in updating order status" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { status, customerId, deliveryPartnerId, branchId } = req.query;
    let query = {};
    if (status) {
      query.status = status;
    }
    if (customerId) {
      query.customer = customerId;
    }
    if (deliveryPartnerId) {
      query.deliveryPartner = deliveryPartnerId;
    }
    if (branchId) {
      query.branchId = branchId;
    }
    const orders = await Order.find(query).populate(
      "customer items.item branch deliveryPartner"
    );
    return res.send(orders);
  } catch (error) {
    return res.status(500).send({ message: "Failed to fetch orders" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.find(orderId).populate(
      "customer items.item branch deliveryPartner"
    );
    if (!order) {
      return res.status(404).send({ message: "Order Not Found" });
    }
    return res.send(orders);
  } catch (error) {
    return res.status(500).send({ message: "Failed to fetch orders" });
  }
};
