
import Cart from "../Model/Cart.model.js";
import Order from "../Model/Order.model.js";
import Product from "../Model/Product.model.js";
import Sales from "../Model/Sales.model.js";

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('userId').populate('items.productId');
        if (!orders.length === 0) {
            return res.status(400).json({ data: null })
        }
        res.status(200).json({ content: orders });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error })
    }
};

export const postOrder = async (req, res) => {
    const { items, totalAmount, tax, deliveryCharge, userId, paymentMethod } = req.body;
    // const { _id, } = req.user;
    console.log(req.body)
    if (!items || !totalAmount) {
        return res.status(400).json({ message: 'Items not found' })
    };
    try {
        const newOrder = new Order({
            userId: userId,
            items,
            totalAmount: totalAmount,
            paymentMethod: paymentMethod,
        });
        await newOrder.save();

        await Cart.deleteOne({ userId: userId });

        // const order = await Order.findByIdAndUpdate(newOrder._id, { $set: { status: '' } });

        res.status(201).json({ massage: 'Order successfully placed', order: newOrder })
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateOrder = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const { productIds } = req.body;
    console.log(typeof productIds)
    console.log('productsQuqntity', productIds)
    if (!id) {
        return res.status(400).json({ message: 'OrderId is not found' })
    };
    try {
        const order = await Order.findByIdAndUpdate(id, { $set: { status: status } });
        if (status === 'delivered') {
            const newSale = new Sales({
                totelOrders: +1,
                totelRevenue: +order.totalAmount,
            });
            await newSale.save();
            try {
                await Promise.all(
                    productIds.map(async (item) => {
                        const prodId = item.productId._id;
                        const orderedQty = item.quantity;

                        if (prodId && typeof orderedQty === 'number') {
                            await Product.findByIdAndUpdate(
                                prodId,
                                { $inc: { quantity: -orderedQty } },
                                { new: true }
                            );
                        } else {
                            console.warn('Invalid product or quantity:', item);
                        }
                    })
                );
                console.log('All quantities updated successfully');
            } catch (error) {
                console.error('Error updating stock:', error);
            }

        };
        res.status(200).json({ message: 'Order updated' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error })
    }
};

export const getOrder = async (req, res) => {
    const userId = req.params.id;
    try {
        const order = await Order.find({ userId: userId }).populate('userId').populate('items.productId');
        console.log(order)
        if (!order) {
            return res.status(400).json(null);
        }
        res.status(200).json({ content: order });
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