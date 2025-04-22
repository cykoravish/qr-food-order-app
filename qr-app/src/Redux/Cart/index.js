import { createSlice } from "@reduxjs/toolkit";

const getInitialCart = () => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
};

export const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cartItems: getInitialCart()
    },
    reducers: {
        addToCart: (state, action) => {
            const product = action.payload;
            const existingItem = state.cartItems.find(item => item._id === product._id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.cartItems.push({ ...product, quantity: 1 });
            }

            localStorage.setItem("cart", JSON.stringify(state.cartItems));
        },

        incrementCart: (state, action) => {
            const item = state.cartItems.find(item => item._id === action.payload);
            if (item) {
                item.quantity += 1;
                localStorage.setItem("cart", JSON.stringify(state.cartItems));
            }
        },

        removeFromCart: (state, action) => {
            const productId = action.payload;
            const existingItem = state.cartItems.find(item => item._id === productId);

            if (existingItem) {
                if (existingItem.quantity > 1) {
                    existingItem.quantity -= 1;
                } else {
                    state.cartItems = state.cartItems.filter(item => item._id !== productId);
                }
                localStorage.setItem("cart", JSON.stringify(state.cartItems));
            }
        },

        loadCartFromLocalStorage: (state) => {
            const storedCart = localStorage.getItem("cart");
            if (storedCart) {
                state.cartItems = JSON.parse(storedCart);
            }
        },

        clearCart: (state) => {
            state.cartItems = [];
            localStorage.removeItem('cart');
        },

        syncCartFromLocalStorage: (state) => {
            const cart = localStorage.getItem('cart');
            state.cartItems = cart ? JSON.parse(cart) : [];
        }
    }
});

export const {
    addToCart,
    removeFromCart,
    incrementCart,
    loadCartFromLocalStorage,
    clearCart,
    syncCartFromLocalStorage

} = cartSlice.actions;

export default cartSlice.reducer;
