import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
    name: 'cart',
    initialState: { cartItems: [] },
    reducers: {
        addToCart: (state, action) => {
            const product = action.payload;
            // Find if the product already exists in the cart by productId
            const existingItem = state.cartItems.find(item => item._id === product._id);

            if (existingItem) {
                existingItem.quantity += 1;  // Increment quantity if item already exists
            } else {
                state.cartItems.push({ ...product, quantity: 1 });  // Add new item with quantity 1
            }
        },

        incrementCart: (state, action) => {
            console.log(action.payload)
            const item = state.cartItems.find(item => item._id === action.payload);
            if (item) item.quantity += 1;
            console.log(state.cartItems)
        },

        removeFromCart: (state, action) => {
            const productId = action.payload;
            const existedProduct = state.cartItems.find((item) => item._id === productId);

            if (existedProduct) {
                if (existedProduct.quantity > 1) {
                    existedProduct.quantity -= 1;
                } else {
                    state.cartItems = state.cartItems.filter((item) => item._id !== productId);
                }
            }
        },
        onload: (state, action) => {
            state.cartItems = action.payload;
        }
    },
});

export const { addToCart, removeFromCart, incrementCart, onload } = cartSlice.actions;

export default cartSlice.reducer;
