import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import publicAxios from "../../Services/PublicAxios";
import { IoIosClose, IoIosDoneAll } from "react-icons/io";
import { CiNoWaitingSign } from "react-icons/ci";
import { socket } from "../../Services/Socket";
import { ReverseButton } from "../../components/Client/ReverseButton";
import PrivateAxios from "../../Services/PrivateAxios";

export const OrderUpdate = () => {
  const [filterdPendingOrders, setFilterOrder] = useState([]);

  const fetched = async () => {
    const res = await PrivateAxios.get("/orders/active-orders");
    if (res.status !== 200) {
      throw new Error({ message: "Responce Failed" });
    }
    setFilterOrder(res.data.content);
  };

  console.log(filterdPendingOrders);

  useEffect(() => {
    // Initially fetch pending orders
    fetched();

    socket.emit("join-admin"); // Join admin room immediately after connecting

    const handleOrderUpdate = (data) => {
      fetched();
    };

    socket.on("order-updated-status", handleOrderUpdate);

    return () => {
      socket.off("order-updated-status");
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetched();
    return () => {
      controller.abort();
    };
  }, []);

  // const filterdPendingOrders = orders.filter((item) => item.status === 'pending' || item.status === 'processing');
  // console.log(filterdPendingOrders)

  // async function handleDelevery(orderId) {
  //     try {
  //         const response = await publicAxios.patch(`/orders/${orderId}`, { status: 'delivered' });

  //         if (response.status !== 200) {
  //             throw new Error('Something went wrong, please try again later.');
  //         }
  //         socket.emit('order-updated', orderId)
  //         alert('Product deleverd successfully')
  //     } catch (error) {
  //         alert(error.message || 'Something went wrong.');
  //     }
  // };

  // async function handleCancel(orderId) {
  //     const responce = await publicAxios.patch(`/orders/${orderId}`, { status: 'cancelled' });
  //     if (responce.status !== 200) {
  //         throw new Error({ message: 'Something error try after some time' })
  //     };
  //     socket.emit('order-updated', orderId)
  //     alert('order updated');
  // }
  async function handleProcessing(status, orderId, order) {
    console.log(order);
    const productIds = order.items?.map((ele) => ele);

    try {
      console.log("Updating Order ID:", orderId, "to status:", status);

      const response = await publicAxios.patch(`/orders/${orderId}`, {
        status,
        productIds,
      });

      if (response.status !== 200) {
        throw new Error("Something went wrong, try again later.");
      }

      socket.emit("order-updated", orderId);
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <div className="w-full h-screen ">
      <div className="flex text-left p-4">
        <ReverseButton routeName={"Admin"} route={"/admin"} />
      </div>
      {filterdPendingOrders.length > 0 ? (
        <div className="overflow-x-auto w-[98%] mx-auto rounded-md">
          <table className="w-[100%] mx-auto border-collapse border border-gray-300 ">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Sr. No.</th>
                <th className="px-4 py-2 border">Products</th>
                <th className="px-4 py-2 border">Quantity</th>
                <th className="px-4 py-2 border">Table</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Username</th>
                <th className="px-4 py-2 border">Payment Method</th>
                <th className="px-4 py-2 border">Order Amount</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody className="text-xl font-semibold">
              {filterdPendingOrders.map((order, index) => (
                <tr key={order._id} className="">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border  flex-col">
                    <ul className="tracking-wide flex flex-col items-start capitalize text-blue-400 pl-3">
                      {order.items?.map((item, idx) => (
                        <li className="w-50 list-decimal " key={idx}>
                          {item.productId?.name || "N/A"}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-1 py-2 border">
                    <ul className="list-none space-y-1 flex flex-col items-start">
                      {order.items?.map((item, idx) => (
                        <li key={idx}>
                          {item.quantity && item.price
                            ? `${item.quantity} * ${item.price}`
                            : "N/A"}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-2 border">
                    <p className=" text-center">
                      {order.userId ? order.userId?.table : 0}
                    </p>
                  </td>
                  <td className="px-4 py-2 border capitalize">
                    <select
                      name={order.status}
                      value={order.status}
                      onChange={(e) =>
                        handleProcessing(e.target.value, order._id, order)
                      }
                      className="capitalize"
                    >
                      <option value="">{order.status}</option>
                      <option value="processing">Processing</option>
                      <option value="delivered">Ready</option>
                    </select>
                  </td>

                  <td className="px-4 py-2 border uppercase">
                    {order.userId?.name}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {order.paymentMethod}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    ₹{order.totalAmount}
                  </td>
                  <td className="px-4 py-2 border">
                    <div className="px-4 py-2 gap-5 flex  my-auto items-center justify-center">
                      <button
                        className="w-9 h-9 bg-green-400 rounded-full"
                        onClick={() =>
                          handleProcessing("delivered", order._id, order)
                        }
                      >
                        <IoIosDoneAll size={35} />
                      </button>
                      <button
                        className="w-9 h-9 bg-red-400 rounded-full "
                        onClick={() =>
                          handleProcessing("cancelled", order._id, order)
                        }
                      >
                        <IoIosClose size={35} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center text-center mt-12 ">
          <CiNoWaitingSign size={100} />
          <h2 className="text-2xl">I am wating of orders</h2>
        </div>
      )}
    </div>
  );
};
