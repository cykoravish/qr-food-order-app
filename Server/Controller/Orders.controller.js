import Cart from "../Model/Cart.model.js";
import Order from "../Model/Order.model.js";

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        if (!orders.length === 0) {
            return res.status(400).json({ data: null })
        }
        res.status(200).json({ data: orders });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error })
    }
};

export const postOrder = async (req, res) => {
    const { items, totalAmount, tax, deliveryCharge, userId } = req.body;
    // const { _id, } = req.user;
    if (!items || !totalAmount) {
        return res.status(400).json({ message: 'Items not found' })
    };
    try {
        const newOrder = new Order({
            userId: userId,
            items,
            totalAmount: totalAmount,
        });
        await newOrder.save();

        await Cart.deleteOne({ userId: _id });

        const order = await Order.findByIdAndUpdate(newOrder._id, { $set: { status: 'delivered' } });


        res.status(201).json({ massage: 'Order successfully placed', order: order })
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateOrder = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!orderId) {
        return res.status(400).json({ message: 'OrderId is not found' })
    };
    try {
        const updatedOrder = await Orders.findByIdAndUpdate(orderId, { $set: { status: status } });
        res.status(200).json({ message: '' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error })
    }
};

export const getOrder = async (req, res) => {
    const { _id } = req.params._id;
    try {
        const order = Order.findById(_id);
        if (order) {
            res.status(200).json({ content: data })
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error })
    }
}
