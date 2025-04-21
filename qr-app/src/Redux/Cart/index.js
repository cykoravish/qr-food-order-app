import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
    name: 'cart',
    initialState: { cartItems: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [] },
    reducers: {
        addToCart: (state, action) => {
            const product = action.payload;

            const existingItem = state.cartItems.find(item => item._id === product._id);

            if (existingItem) {
                existingItem.quantity += 1;  // Increment quantity if item already exists
                localStorage.setItem('cart', JSON.stringify(action.payload))
            } else {
                state.cartItems.push({ ...product, quantity: 1 });  // Add new item with quantity 1
                localStorage.setItem('cart', JSON.stringify(action.payload))
            }
        },

        incrementCart: (state, action) => {
            console.log(action.payload)
            const item = state.cartItems.find(item => item._id === action.payload);
            if (item) item.quantity += 1;
            console.log(state.cartItems)
            localStorage.setItem('cart', JSON.stringify(action.payload))
        },

        removeFromCart: (state, action) => {
            const productId = action.payload;
            const existedProduct = state.cartItems.find((item) => item._id === productId);

            if (existedProduct) {
                if (existedProduct.quantity > 1) {
                    existedProduct.quantity -= 1;
                    localStorage.setItem('cart', JSON.stringify(action.payload))
                } else {
                    state.cartItems = state.cartItems.filter((item) => item._id !== productId);
                    localStorage.setItem('cart', JSON.stringify(action.payload))
                }
            }
        },
        onload: (state, action) => {
            state.cartItems = action.payload;
        },
        clearLocalStorage: (state) => {
            state.cartItems = localStorage.removeItem('cart')
        }
    },
});

export const { addToCart, removeFromCart, incrementCart, onload, clearLocalStorage } = cartSlice.actions;

export default cartSlice.reducer;
