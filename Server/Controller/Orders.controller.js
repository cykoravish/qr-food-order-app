
import Cart from "../Model/Cart.model.js";
import Order from "../Model/Order.model.js";
import Sales from "../Model/Sales.model.js";

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

        await Sales.

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
};

// export const postPaymentOrder = async (req, res) => {
//     const { amount, currency } = req.body;
//     const razorPay = new Razorpay({
//         key_id: process.env.RAZORPAY_KEY_ID,
//         key_secret: process.env.RAZORPAY_KEY_SECRET
//     });

//     const option = {
//         amount: amount,
//         currency: currency,
//         receipt: "recipt1",
//         payment_capture: 1
//     };

//     try {
//         const responce = await razorPay.orders.create(option);
//         if (!responce) {
//             res.status(400).json({ message: 'Something issue in payment' })
//         };
//         res.status(200).json({
//             order__id: responce._id,
//             currency: responce.currency,
//             amount: responce.amount,
//             status: responce.status
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Internal server error', error })
//     }
// };

// export const getRazorpayPayment = async (req, res) => {
//     const { paymentId } = req.params;
//     const razorPay = new Razorpay({
//         key_id: process.env.RAZORPAY_KEY_ID,
//         key_secret: process.env.RAZORPAY_KEY_SECRET
//     });
//     try {
//         const payment = await razorPay.payments.fetch(paymentId);
//         if (!payment) {
//             return res.status(400).json({ message: 'Payment does not fetch', error })
//         };

//         res.status(200).json({
//             status: payment.status,
//             method: payment.method,
//             amount: payment.amount,
//             currency: payment.currency,
//             // customerId: payment.customer_id
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Internal server error', error })
//     }
// }

// backend/controllers/paymentController.js
import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});

// Create Order
export const createOrder = async (req, res) => {
    const { amount } = req.body;

    const options = {
        amount: amount * 100, // Razorpay uses paise
        currency: "INR",
        receipt: `receipt_order_${Math.random() * 1000}`,
    };

    try {
        const order = await razorpayInstance.orders.create(options);
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ message: "Razorpay order failed", error: err });
    }
};

// Verify Signature (after payment)
export const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const generatedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

    if (generatedSignature === razorpay_signature) {
        res.status(200).json({ message: "Payment verified successfully" });
    } else {
        res.status(400).json({ message: "Invalid signature" });
    }
};
