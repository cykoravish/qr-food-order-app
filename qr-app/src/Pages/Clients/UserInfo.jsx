import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import publicAxios from '../../Services/PublicAxios';
import { useSelector } from 'react-redux';
import PrivateAxios from '../../Services/PrivateAxios';

export const UserInfo = () => {
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('userId')
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });
    const [cart, setCart] = useState({});
    const cartItems = useSelector((state) => state.cart.cartItems)


    const data = cartItems?.map((product) => ({
        productId: product._id,
        quantity: product.quantity
    }));
    console.log(data)

    const [form, setForm] = useState({
        name: user?.name || '',
        phone: user?.phone || ''
    });

    const [isEditMode, setIsEditMode] = useState(!user); // If no user, default to edit mode

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            const response = user ? null : await publicAxios.post('/auth/user', form);
            if (response.status === 200) {
                const updatedUser = response.data.user;
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setIsEditMode(false); // Switch to view mode
                navigate(`/cart-bill/?userId=${response.data.user._id}`);
            }
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    const handleEdit = () => {
        setIsEditMode(true);
    };

    async function handleCartDeta() {
        const cartData = {
            userId: userId ? userId : user._id,
            items: data
        };
        const responce = cart ? null : await publicAxios.post('/carts/add-cart', cartData);
        if (!responce.statusText === 'ok') {
            throw new Error({ message: 'responce failed' })
        };
        setCart(responce.data.data)
    }

    return (
        <div className='mx-3'>
            <div className='my-2'>
                <Link to={'/cart'} className='flex items-center gap-2 text-lg font-semibold'>
                    <img src='/assets/back.png' alt='back' className='w-6 h-6' />
                    <span className='capitalize'>Cart</span>
                </Link>
            </div>

            <div className='relative flex flex-col'>
                <h2 className='my-4 text-2xl text-center font-semibold'>User Details</h2>

                {isEditMode ? (
                    <>
                        <label htmlFor="name" className='text-xl font-semibold ml-1 mb-1'>Name</label>
                        <input type="text" name='name' placeholder='Enter Your Name' onChange={handleChange} value={form.name} className='w-full h-10 border rounded-md pl-1 border-gray-500' />

                        <label htmlFor="phone" className='font-semibold ml-1 mb-1 mt-2 text-xl'>Phone</label>
                        <input type="text" name='phone' placeholder='Enter Phone Number' onChange={handleChange} value={form.phone} className='w-full h-10 border rounded-md pl-1 border-gray-500' />

                        <div className='w-full flex gap-2 mt-4'>
                            <button className='bg-gray-300 w-1/2 py-2 rounded' onClick={() => setIsEditMode(false)}>Cancel</button>
                            <button className='bg-amber-400 w-1/2 py-2 rounded' onClick={handleSubmit}>Save</button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className='text-lg font-medium'>👤 Name: {user.name}</p>
                        <p className='text-lg font-medium mt-2'>📞 Phone: {user.phone}</p>
                        <button className='mt-4 bg-blue-400 text-white py-2 px-4 rounded' onClick={handleEdit}>Edit</button>
                        <Link className='mt-4 bg-blue-400 text-white py-2 px-4 rounded flex justify-center' to={`/cart-bill/?userId=${userId ? userId : user._id}`} onClick={handleCartDeta}>Bill Details</Link>
                    </>
                )}
            </div>
        </div>
    )
}
