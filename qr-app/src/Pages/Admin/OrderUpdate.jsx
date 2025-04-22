import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import publicAxios from '../../Services/PublicAxios'
import { IoIosClose, IoIosDoneAll } from "react-icons/io";

export const OrderUpdate = () => {
    const [orders, setOrders] = useState([]);
    useEffect(() => {
        const controller = new AbortController();
        const fetched = async () => {
            const res = await publicAxios.get('/orders/orders', { signal: controller.signal });
            if (res.status !== 200) {
                throw new Error({ message: 'Responce Failed' })
            };
            setOrders(res.data.content);
        };
        fetched();

        return () => {
            controller.abort();
        }
    }, []);
    console.log()

    const filterdPendingOrders = orders.filter((item) => item.status === 'pending' || item.status === 'processing');
    console.log(filterdPendingOrders)

    async function handleDelevery(orderId) {
        console.log(orderId)
        const responce = await publicAxios.patch(`/orders/${orderId}`, { status: 'delivered' });
        if (responce !== 200) {
            throw new Error({ message: 'Something error try after some time' })
        };
        alert('order updated')
    }
    async function handleCancel(orderId) {
        const responce = await publicAxios.patch(`/orders/${orderId}`, { status: 'cancelled' });
        if (responce !== 200) {
            throw new Error({ message: 'Something error try after some time' })
        };
        alert('order updated')
    }
    async function handleProcessing(orderId) {
        console.log(orderId)
        const responce = await publicAxios.patch(`/orders/${orderId}`, { status: 'processing' });
        if (responce !== 200) {
            throw new Error({ message: 'Something error try after some time' })
        };
        alert('order updated')
    }
    return (
        <div className='w-[375px]'>
            <div className='flex text-left p-4'>
                <img src="/assets/back.png" alt="back" className='shadow-sm rounded-full' />
                <Link to="/admin" className='ml-2 font-semibold'>Admin</Link>
            </div>
            {filterdPendingOrders.length > 0 ? (<div className="overflow-x-auto w-full">
                <table className="min-w-full text-sm text-left border ">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 border">Sr. No.</th>
                            <th className="px-4 py-2 border">Products</th>
                            <th className="px-4 py-2 border">Quantity</th>
                            <th className="px-4 py-2 border">Food Processing</th>
                            <th className="px-4 py-2 border">Status</th>
                            <th className="px-4 py-2 border">Username</th>
                            <th className="px-4 py-2 border">Payment Method</th>
                            <th className="px-4 py-2 border">Order Amount</th>
                            <th className="px-4 py-2 border">Action</th>
                        </tr>
                    </thead>
                    <tbody className='text-xl font-semibold'>
                        {filterdPendingOrders.map((order, index) => (
                            <tr key={order._id} className="border-t m-auto in-hover::bg-gray-500">
                                <td className="px-4 py-2 border">{index + 1}</td>
                                <td className="px-4 py-2 border">
                                    <ul className="list-disc ml-4 space-y-1 max-h-24 overflow-y-auto">
                                        {order.items?.map((item, idx) => (
                                            <li key={idx}>{item.productId?.name || 'N/A'}</li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="px-4 py-2 border">
                                    <ul className="list-disc ml-4 space-y-1 max-h-24 overflow-y-auto">
                                        {order.items?.map((item, idx) => (
                                            <li key={idx}>{item.quantity || 'N/A'}</li>
                                        ))}
                                    </ul>
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleProcessing(order._id)}
                                        className={`flex justify-center w-24 h-10 m-1 rounded-md hover:bg-violet-600
      ${order.status === 'processing' ? 'bg-green-400' : 'bg-yellow-400'}`}
                                    >
                                        {order.status}
                                    </button>
                                </td>
                                < td className="px-4 py-2 border capitalize">
                                    <select name={order.status} id="">
                                        <option value="">{order.status}</option>
                                        <option value="processing">Processing</option>
                                        <option value="">Ready</option>
                                    </select>
                                </td>
                                <td className="px-4 py-2 border">{order.userId?.name}</td>
                                <td className="px-4 py-2 border">{order.paymentMethod}</td>
                                <td className="px-4 py-2 border">₹{order.totalAmount}</td>
                                <td className="px-4 py-2 border gap-6 flex justify-center items-center mt-auto">
                                    <button className='w-9 h-9 bg-green-400 rounded-full' onClick={() => handleDelevery(order._id)}><IoIosDoneAll size={35} /></button>
                                    <button className='w-9 h-9 bg-red-400 rounded-full ' onClick={() => handleCancel(order._id)}><IoIosClose size={35} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            ) : (<div className='flex justify-center items-center text-center bg-green-300 mt-12 h-24'>
                <h1 className='text-2xl font-semibold'>There is not pending orders </h1>
            </div>)
            }
        </div >
    )
}
