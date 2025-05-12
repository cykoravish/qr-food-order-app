import { CheckCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import publicAxios from "../../Services/PublicAxios";
import { Bounce } from "react-toastify";
import { socket } from "../../Services/Socket";
import PrivateAxios from "../../Services/PrivateAxios";
import { MdExpandCircleDown } from "react-icons/md";
// import { socket } from '../../Services/Socket';

export const OrderSuccess = () => {
  const [orders, setOrder] = useState(null);
  const [user, setUser] = useState([]);
  // const [orders, setorders] = useState([]);
  // const [render, setRender] = useState(false);
  // const navigate = useNavigate();
  console.log(orders);

  async function fetched(userId) {
    console.log(userId);
    try {
      const res = user && (await publicAxios(`/orders/${userId}`));
      if (res.status !== 200) {
        throw new Error("Response failed");
      }
      const orders = res.data.content;
      setOrder(orders);
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const existingUser = storedUser ? JSON.parse(storedUser) : null;

    if (existingUser) {
      setUser(existingUser);
      fetched(existingUser._id); // Initial fetch
    }

    socket.emit("join-admin");

    const handleOrderUpdate = (data) => {
      console.log("Admin received order update:", data);
      if (existingUser) {
        fetched(existingUser._id); // Use stored user directly
      }
    };

    socket.on("order-updated-status", handleOrderUpdate);

    return () => {
      socket.off("order-updated-status", handleOrderUpdate); // ✅ Use named function for proper cleanup
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      const allDelivered =
        orders && orders.every((order) => order.status === "delivered");

      console.log(allDelivered);
      if (allDelivered) {
        const delay = 50 * 60 * 1000;

        setTimeout(() => {
          localStorage.removeItem("user");
          setUser(null);
          console.log("User removed after 5 minutes.");
        }, delay);
      }
    }
  }, [orders]);

  console.log(orders);

  console.log(user);

  return (
    <div className="w-[98%] mx-auto flex flex-col items-center justify-center bg-green-50 p-4">
      <>
        <CheckCircle className="text-green-500 w-15 h-15 mb-4" />
        <h1 className="text-xl font-bold text-green-700 mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          Thank you for your order. Here are your order details:
        </p>
      </>
      {user && Array.isArray(orders) ? (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <details
              key={order._id}
              className={`${
                order.status === "delivered" ? "hidden" : null
              } border border-gray-300 rounded-xl p-4 gap-4 shadow-md bg-white transition-all`}
            >
              <summary className=" min-w-[280px] cursor-pointer font-semibold text-md text-blue-600 flex flex-col gap-4 justify-between items-center">
                <span className="flex ">
                  {index + 1}-OrderId: {order._id.slice(-5)}
                  <span className="ml-5 mx-auto rounded-md ">
                    <MdExpandCircleDown size={25} />
                  </span>
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(order.placedAt).toLocaleString()}
                </span>
              </summary>

              <div className="mt-4 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <p>
                    <span className="font-medium">Customer:</span>{" "}
                    {order.userId?.name}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {order.userId?.phone}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span> {order.status}
                  </p>
                  <p>
                    <span className="font-medium">Payment:</span>{" "}
                    {order.paymentMethod}
                  </p>
                  <p>
                    <span className="font-medium">Total:</span> ₹
                    {order.totalAmount}
                  </p>
                  <p>
                    <span className="font-medium">Tax:</span> ₹{order.tax}
                  </p>
                  <p>
                    <span className="font-medium">Delivery Charge:</span> ₹
                    {order.deliveryCharge}
                  </p>
                </div>

                <div className="mt-4">
                  <p className="font-medium mb-2">Items:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    {order.items?.map((item, idx) => (
                      <li key={idx}>
                        {item.productId.name} — ₹{item.price} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                  <button
                    className="ml-2 text-blue-500"
                    onClick={() => window.print()}
                  >
                    Print
                  </button>
                </div>
              </div>
            </details>
          ))}
        </div>
      ) : (
        orders && (
          <div
            key={orders._id}
            className={`${
              orders.status === "delevered" ? "blur-2xl" : "visible"
            } border rounded-lg p-4 mb-4 shadow-md`}
          >
            <h2 className="font-medium   mb-2">Order ID: {orders._id}</h2>
            <p>
              <span className="font-medium">Customer:</span>{" "}
              {orders.userId?.name}
            </p>
            <p>
              <span className="font-medium">Phone:</span> {orders.userId?.phone}
            </p>
            <p>
              <span className="font-medium">Status:</span> {orders.status}
            </p>
            <p>
              <span className="font-medium">Payment:</span>{" "}
              {orders.paymentMethod}
            </p>
            <p>
              <span className="font-medium">Total:</span> ₹{orders.totalAmount}
            </p>
            <p>
              <span className="font-medium">Tax:</span> ₹{orders.tax}
            </p>
            <p>
              <span className="font-medium">Delivery Charge:</span> ₹
              {orders.deliveryCharge}
            </p>
            <p>
              <span className="font-medium">Placed At:</span>{" "}
              {new Date(orders.placedAt).toLocaleString()}
            </p>

            <div className="mt-2">
              <p className="font-medium">Items:</p>
              <ul className="list-disc pl-6">
                {orders.items?.map((item, index) => (
                  <li key={index}>
                    {item.productId.name} — ₹{item.price} x {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      )}
      <div className="flex gap-5 text-center">
        <Link
          to="/"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 mt-3 rounded-xl shadow-md transition"
        >
          Go to Home
        </Link>
        <Link
          to="/"
          className="bg-yellow-600 hover:bg-green-700 text-white px-6 py-2 mt-3 rounded-xl shadow-md transition"
        >
          Older Order
        </Link>
      </div>
    </div>
  );
};
