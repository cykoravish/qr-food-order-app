import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import publicAxios from '../../Services/PublicAxios';
import { useSelector } from 'react-redux';
import { ReverseButton } from '../../components/Client/ReverseButton';

export const UserInfo = () => {
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('userId');

    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });
    const [cart, setCart] = useState(null);
    const cartItems = useSelector((state) => state.cart.cartItems)



    const [form, setForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        table: user?.table || ''
    });

    const [isEditMode, setIsEditMode] = useState(!user); // If no user, default to edit mode

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    console.log(form)

    const handleSubmit = async () => {
        try {
            const response = user ? await publicAxios.put('/auth/user', form) : await publicAxios.post('/auth/user', form);
            if (response.status === 200) {
                const updatedUser = response.data.user;
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setIsEditMode(false);
                navigate(`/cart-bill/?userId=${response.data.user._id}`);
            }
        } catch (error) {
            throw new Error({ message: 'Api req failed', error })
        }
    };

    const handleEdit = () => {
        setIsEditMode(true);
    };

    const itemData = cartItems.map((item) => ({
        productId: item._id,
        quantity: item.quantity
    }));

    async function handleCartDeta() {
        const cartData = {
            userId: userId ? userId : user._id,
            items: itemData
        };
        try {
            const responce = cart ? null : await publicAxios.post('/carts/add-cart', cartData);

            if (responce.statusText !== 'Created') {
                throw new Error({ message: 'responce failed' })
            };
            setCart(responce.data.content)
        } catch (error) {
            throw new Error({ message: 'Api req failed', error })
        }
    };

    return (
        <div className='mx-3'>
            <div className='w-[100%] h-[58px] flex items-center'>
                <ReverseButton route={'/cart'} routeName={'Cart'} />
            </div>

            <div className='relative flex flex-col'>
                <h2 className='my-4 text-2xl text-center font-semibold'>User Details</h2>

                {isEditMode ? (
                    <>
                        <label htmlFor="name" className='text-xl font-semibold ml-1 mb-1'>Name</label>
                        <input type="text" name='name' placeholder='Enter Your Name' required onChange={handleChange} value={form.name} className='w-full h-10 border rounded-md pl-1 border-gray-500' />

                        <label htmlFor="phone" className='font-semibold ml-1 mb-1 mt-2 text-xl'>Phone</label>
                        <input type="text" name='phone' placeholder='Enter Phone Number' required onChange={handleChange} value={form.phone} className='w-full h-10 border rounded-md pl-1 border-gray-500' />

                        <label htmlFor="table" className='font-semibold ml-1 mb-1 mt-2 text-xl'>Table</label>
                        <input type="number" name='table' placeholder='Enter Table Number' required onChange={handleChange} value={form.table} className='w-full h-10 border rounded-md pl-1 border-gray-500' />

                        <div className='w-full flex gap-2 mt-4'>
                            <Link className='bg-gray-300 w-1/2 py-2 rounded flex justify-center' onClick={() => setIsEditMode(false)} to={'/cart'}>Cancel</Link>
                            <button className='bg-amber-400 w-1/2 py-2 rounded' onClick={() => {
                                handleSubmit();
                                handleCartDeta();
                            }}>Save</button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className='text-lg font-medium'>👤 Name: {user.name}</p>
                        <p className='text-lg font-medium mt-2'>📞 Phone: {user.phone}</p>
                        <button className='mt-4 bg-blue-400 text-white py-2 px-4 rounded' onClick={handleEdit}>Edit</button>
                        <Link className='mt-4 bg-blue-400 text-white py-2 px-4 rounded flex justify-center  items-center' to={`/cart-bill/?userId=${userId ? userId : user._id}`} onClick={() => {
                            handleCartDeta();
                            handleSubmit();
                        }}>Bill Details</Link>
                    </>
                )}
            </div>
        </div>
    )
}
