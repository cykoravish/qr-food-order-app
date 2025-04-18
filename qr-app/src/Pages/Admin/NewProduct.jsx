import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux';
// import { addProduct } from '../../ItemsSlice';
// import { selectGroupedProducts } from '../../Selecters/Selecters';

export const NewProduct = () => {
    const [catgory, setCategoryOption] = useState([]);
    const [picture, setPicture] = useState(null);
    const [preview, setPreview] = useState(null);
    const [showImage, setShowImage] = useState(true)
    const [form, setForm] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
    });
    console.log("categorueue", catgory)
    const navigate = useNavigate();

    useEffect(() => {
        const controler = new AbortController();
        async function fetched() {
            const responce = await axios.get('http://localhost:5000/api/v1/products/category', { withCredentials: true, signal: controler.signal });
            console.log(responce)
            if (responce.statusText === 'OK') {
                console.log(responce.data.content)
                setCategoryOption(responce.data.content)
            } else {
                throw new Error({ message: 'Responce failed' })
            }
        };
        fetched();
        return () => {
            controler.abort();
        }
    }, []);

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPicture(file);
        }
    };

    const handleForm = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(form)
        const responce = await axios.post('http://localhost:5000/api/v1/products/new-product', { "picture": picture, form }, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log(responce)
        if (responce.status === 201) {
            setForm({
                name: '',
                description: '',
                category: '',
                price: '',

            });
            setPicture(null);

            navigate('/admin');
        };

    };

    const handleDiscard = () => {
        setForm({
            productName: '',
            shortDesc: '',
            category: '',
            prices: '',
            qty: '',
        });
        setPicture(null);
    };

    function handlePreviewImage() {
        if (picture) {
            const imageUrl = URL.createObjectURL(picture);
            setShowImage((prev) => !prev);
            setPreview(imageUrl)
        }
    };

    return (
        <div>
            {/* Top nav */}
            <div className='flex text-left p-4'>
                <img src="/assets/back.png" alt="back" className='shadow-sm rounded-full' />
                <Link to="/admin" className='ml-2 font-semibold'>Add Product</Link>
            </div>

            <div className='flex justify-between m-4'>
                <div className='flex justify-start items-center'>
                    <div className='mr-5'>
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <div className="rounded-full bg-gray-600 p-4">
                                <img src="/public/assets/Vector2.png" alt="file upload" />
                            </div>
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            name="file"
                            hidden
                            onChange={handleImage}
                            required
                        />

                    </div>


                    <div className='flex gap-4'>
                        <button onClick={handlePreviewImage} className='bg-[#F9D718] w-32 flex font-light items-center justify-center text-center rounded-md h-8 overflow-y-hidden'>
                            Uploaded Image
                        </button>
                        <button
                            className='bg-gray-400 border rounded-md px-5'
                            onClick={() => setPicture(null)}
                            type="button"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
            <div className='flex my-2 ml-4'>
                {picture && <p className="text-sm mt-1">{picture.name}</p>}
            </div>
            <div>

            </div>
            {preview && (
                <div className="mt-4 ml-3">
                    {showImage && (<><p className="text-sm mb-1">Image Preview:</p>
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-md border"
                        /></>)}

                </div>)}

            {/* Form fields */}
            <div className='flex flex-col ml-3 overflow-x-hidden'>
                <form onSubmit={handleSubmit} className='flex flex-col w-[95%] max-w-[90%] overflow-x-hidden'>
                    <div className='w-full h-[67px] flex flex-col mb-2'>
                        <label className='min-h-5'>Product Name</label>
                        <input
                            type="text"
                            name="name"
                            onChange={handleForm}
                            value={form.name}
                            placeholder='Chinese Burger'
                            required
                            className='bg-[#F9F9F9] min-h-[40px] px-2'
                        />
                    </div>

                    <div className='w-full h-[67px] flex flex-col m-1'>
                        <label className='min-h-5'>Short Description</label>
                        <input
                            type="text"
                            name="description"
                            onChange={handleForm}
                            value={form.description}
                            placeholder='Tasty and spicy'
                            required
                            className='bg-[#F9F9F9] min-h-[40px] px-2'
                        />
                    </div>

                    <div className='w-full h-[67px] flex flex-col m-1'>
                        <label className='min-h-5'>Category</label>
                        <select
                            className="bg-[#F9F9F9] min-h-[40px] px-2"
                            name="category"
                            onChange={handleForm}
                            value={form.category} // Replace with your actual form state
                        >
                            {catgory.map((category) => (
                                <option key={category.name} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>



                    </div>

                    <div className='w-full h-[67px] flex flex-col m-1'>
                        <label className='min-h-5'>Prices (Rs.)</label>
                        <input
                            type="number"
                            name="price"
                            onChange={handleForm}
                            value={form.price}
                            placeholder='e.g. 149'
                            required
                            className='bg-[#F9F9F9] min-h-[40px] px-2'
                        />
                    </div>
                </form>
            </div >

            {/* Action Buttons */}
            < div className='flex justify-between min-h-[48px] m-1 mt-28 fixed bottom-0 left-0 right-0 bg-white shadow-md px-4 gap-4' >
                <button
                    onClick={handleDiscard}
                    className='bg-[#F2EFE3] rounded-md w-[164px]'
                    type="button"
                >
                    Discard
                </button>
                <button
                    onClick={handleSubmit}
                    className='bg-[#F9D718] w-[164px] rounded-md'
                >
                    Save
                </button>
            </div >
        </div >
    );
}
