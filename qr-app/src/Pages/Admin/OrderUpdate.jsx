import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import publicAxios from '../../Services/PublicAxios'
import { IoIosClose, IoIosDoneAll } from "react-icons/io";
import { CiNoWaitingSign } from "react-icons/ci";
import { socket } from '../../Services/Socket';



export const OrderUpdate = () => {
    const [orders, setOrders] = useState([]);
    const [someChanges, setSomeChanges] = useState(false);
    const navigate = useNavigate();

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
        socket.on('order-status-updated', () => fetched());
        return () => {
            controller.abort();
            socket.disconnect()
        }
    }, [navigate, orders.length, someChanges]);
    console.log()

    const filterdPendingOrders = orders.filter((item) => item.status === 'pending' || item.status === 'processing');
    console.log(filterdPendingOrders)

    async function handleDelevery(orderId) {
        try {
            const response = await publicAxios.patch(`/orders/${orderId}`, { status: 'delivered' });

            if (response.status !== 200) {
                throw new Error('Something went wrong, please try again later.');
            }

            socket.emit('order-status-updated');

            socket.off('order-status-updated')

            navigate('/admin/pending-orders');

        } catch (error) {
            console.error(error);
            // Optionally show an error message to the user
            alert(error.message || 'Something went wrong.');
        } finally {
            setSomeChanges(false);
        }
    };

    async function handleCancel(orderId) {
        const responce = await publicAxios.patch(`/orders/${orderId}`, { status: 'cancelled' });
        if (responce.status !== 200) {
            throw new Error({ message: 'Something error try after some time' })
        };
        alert('order updated')
        socket.emit('order-status-updated');

        // Disconnect socket
        socket.off('order-status-updated')
    }
    async function handleProcessing(orderId) {
        console.log(orderId)
        setSomeChanges(true)
        const responce = await publicAxios.patch(`/orders/${orderId}`, { status: 'processing' });
        if (responce.status !== 200) {
            throw new Error({ message: 'Something error try after some time' })
        };
        console.log(orderId)
        socket.emit('order-status-updated');

        // Disconnect socket
        socket.off('order-status-updated')
        navigate('/admin/pending-orders');
        alert('order updated')
        setSomeChanges(false)
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
                            <th className="px-4 py-2 border">Food Processing Action</th>
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
                                        className={`flex justify-center w-24 h-10 m-1 rounded cursor-pointer hover:bg-violet-600
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
            ) : (
                <div className='flex flex-col justify-center items-center text-center mt-12 '>
                    <CiNoWaitingSign size={100} />
                    <h2 className='text-2xl'>I am wating of orders</h2>
                </div>)
            }
        </div >
    )
}
