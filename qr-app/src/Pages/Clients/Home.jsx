import React, { useEffect, useState } from "react";
import "./Home.css";
import { CardItem } from "../../components/CardItem";
import { CardDetails } from "../../components/CardDetails";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../Redux/Cart/index";
import EventEmitter from "events";
import { Bounce, toast } from "react-toastify";
import { CategoryCard } from "../../components/Client/CategoryCard";
import OrderStatusCard from "../../components/Client/OrderStatusCard";
import publicAxios from "../../Services/PublicAxios";
import { socket } from "../../Services/Socket";
import { motion } from "framer-motion";
// import { socket } from '../../Services/Socket';

export const Home = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => (state ? state.cart.cartItems : []));
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [latestOrder, setLatestOrder] = useState([]);
  const [popup, setPopup] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [clickCount, setClickCount] = useState(0);

  // Get admin access
  const handleAdminAccess = () => {
    setClickCount((prev) => {
      const newCount = prev + 1;

      if (newCount === 10) {
        toast("🦄 Admin Mode Activated", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: false,
          theme: "colored",
          transition: Bounce,
        });
        navigate("/signup");

        return 0;
      }

      return newCount;
    });
  };

  // Get products
  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const response = await publicAxios.get("/products");

        if (response.status !== 200) {
          throw new Error("Response is not okay");
        }
        setProducts(response.data.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else {
          console.error("Fetch error:", error.message);
        }
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      controller.abort();
    };
  }, []);

  // products with category
  const groupedProducts = products?.reduce((acc, product) => {
    const categoryName = product.categoryId?.name || "Uncategorized";
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(product);
    return acc;
  }, {});

  const uniqueCategories = [
    ...new Map(
      products.map((item) => [item?.categoryId?.name, item.categoryId])
    ).values(),
  ];

  const addToCarts = async (product) => {
    dispatch(addToCart(product));
  };

  // Calculate total quantity in cart
  const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // search functionality
  const filteredGroupedProducts = Object.keys(groupedProducts).reduce(
    (acc, categoryName) => {
      const filteredProducts = groupedProducts[categoryName].filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.categoryId?.name.toLowerCase().includes(search.toLowerCase())
      );
      if (filteredProducts.length > 0) {
        acc[categoryName] = filteredProducts;
      }
      return acc;
    },
    {}
  );

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const existingUser = storedUser ? JSON.parse(storedUser) : null;

    setUser(existingUser);

    async function fetched(userId) {
      try {
        const res = await publicAxios.get(`/orders/${userId}`);
        console.log(res);

        if (res.status !== 200) {
          throw new Error("Response failed");
        }

        const orders = res.data.content;

        // Get today's start and end timestamps
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0)).getTime();
        const endOfDay = new Date(now.setHours(23, 59, 59, 999)).getTime();

        // Filter today's orders
        const filteredOrders = orders.filter((order) => {
          const orderDate = new Date(order.placedAt).getTime();
          return orderDate >= startOfDay && orderDate <= endOfDay;
        });

        console.log(filteredOrders);
        setLatestOrder(filteredOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        throw new Error("Some error occurred while fetching orders");
      }
    }

    if (existingUser?._id) {
      fetched(existingUser._id);
      socket.emit("join-admin");

      const handleOrderUpdate = (data) => {
        console.log("Admin received order update:", data);
        fetched(existingUser._id);
      };

      socket.on("order-updated-status", handleOrderUpdate);

      return () => {
        socket.off("order-updated-status", handleOrderUpdate);
      };
    }
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      const allDelivered = latestOrder.every(
        (order) => order.status === "delivered"
      );

      if (allDelivered) {
        const delay = 50 * 60 * 1000;

        setTimeout(() => {
          localStorage.removeItem("user");
          setUser(null);
          console.log("User removed after 5 minutes.");
        }, delay);
      }
    }
  }, [latestOrder]);

  function handleShowOrder() {
    setPopup((prev) => !prev);
  }

  return (
    <div className=" max-w-[100%] mx-auto">
      <button onClick={handleAdminAccess} className="w-full ">
        <img
          src="/assets/cover.png"
          alt="coverimage"
          className="w-full h-full object-cover min-w-[100%] max-h-[500px]"
        />
      </button>

      {user && (
        <div className="fixed right-0 top-5 w-14 h-8 bg-yellow-300 rounded-full object-contain flex justify-center items-center text-center ">
          <button onClick={handleShowOrder} className="">
            Order
          </button>
          {popup &&
            latestOrder?.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <OrderStatusCard orderStatus={item} onClose={handleShowOrder} />
              </motion.div>
            ))}
        </div>
      )}

      <div className="search-container min-w-[90% ] items-start">
        <p className="flex justify-start mb-3 pl-1">
          Choose the best dish for you
        </p>
        <div className="flex flex-row items-center gap-2 flex-shrink-0 border border-gray-500 w-[100%] h-[40px] text-start rounded-xl pl-3 ">
          <img
            src="/assets/lenspng.svg"
            alt="lens"
            className="w-[16px] h-[16px]"
          />
          <input
            type="search"
            name="search"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
            className="pr-2 border-none w-[100%] h-[40px] bg-transparent outline-none"
          ></input>
        </div>
      </div>

      {search &&
        Object.keys(filteredGroupedProducts)?.map((categoryName) => (
          <div key={categoryName} className="category-section mb-3">
            <div className="flex justify-between px-4 py-2">
              <h2 className="text-xl font-semibold">{categoryName}</h2>
              <Link
                to={`/${categoryName}`}
                state={{ items: filteredGroupedProducts[categoryName] }}
                className="text-blue-500"
              >
                See More
              </Link>
            </div>

            <div className="flex overflow-x-auto h-[200px] space-x-4 px-4">
              {filteredGroupedProducts[categoryName]?.map((product) => (
                <div key={product._id} className="min-w-[150px] flex-shrink-0">
                  <CardDetails
                    id={product._id}
                    category={product.categoryId?.name}
                    dishName={product.name}
                    price={product.price || 100}
                    qty={product.quantity} // Adjusted to use `quantity`
                    image={product.imageUrl}
                    onAddToCart={() => addToCarts(product)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

      <div className="">
        <CategoryCard uniqueCategories={uniqueCategories} products={products} />
      </div>

      {Object.keys(groupedProducts).map((categoryName) => (
        <div key={categoryName} className="category-section mb-2">
          <div className="flex justify-between px-4 py-2">
            <h2 className="text-[14px] font-semibold">{categoryName}</h2>
            <Link
              to={`/${categoryName}`}
              state={{ items: groupedProducts[categoryName] }}
              className="text-blue-500"
            >
              See More
            </Link>
          </div>

          <div
            className="flex overflow-x-auto min-h-[200px]  space-x-4 px-4 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {groupedProducts[categoryName]?.map((product) => (
              <div key={product._id} className="min-w-[150px] flex-shrink-0">
                <CardDetails
                  key={product._id}
                  id={product._id}
                  category={product.categoryId?.name}
                  dishName={product.name}
                  price={product.price || 100}
                  qty={product.quantity} // Adjusted to use `quantity`
                  image={product.imageUrl}
                  onAddToCart={() => addToCarts(product)}
                  product={product}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="fixed bottom-1 left-0 right-0 mx-auto bg-yellow-300 w-[97%] h-[48px] flex justify-center items-center">
        <Link
          className="flex items-center justify-center text-center gap-1"
          to={"/cart"}
          state={{ cartItems }}
        >
          <span>
            <img
              src="/assets/cart.svg"
              alt="cart"
              className="w-[18px] h-[18px] font-semibold"
            />
          </span>
          Cart
          <span className="font-semibold ml-1 text-center flex justify-center">
            {totalQty}
          </span>
        </Link>
      </div>
    </div>
  );
};
