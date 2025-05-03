
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PrivateAxios from '../../Services/PrivateAxios';
import { Model } from '../../components/Model';

export const NewProduct = () => {
    const [catgory, setCategoryOption] = useState([]);
    const [picture, setPicture] = useState(null);
    const [preview, setPreview] = useState(null);
    const [showImage, setShowImage] = useState(true)
    const [image, setImage] = useState();
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
            const responce = await PrivateAxios.get('/products/category');
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
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl)
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
        const data = new FormData();
        data.append("picture", picture); // match backend field
        data.append("name", form.name);
        data.append("description", form.description);
        data.append("category", form.category);
        data.append("price", form.price);
        const responce = await PrivateAxios.post('/products/new-product', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
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
        navigate('/admin')
    };

    function handlePreviewImage() {
        console.log('click')
        if (picture) {
            const imageUrl = URL.createObjectURL(picture);
            console.log(imageUrl)
            setShowImage((prev) => !prev);
            setPreview(imageUrl)
        }
    };
    console.log(preview)

    return (
        <div>
            {/* Top nav */}
            <div className='flex text-left p-4'>
                <img src="/assets/back.png" alt="back" className='shadow-sm rounded-full' />
                <Link to="/admin" className='ml-2 font-semibold'>Add Product</Link>
            </div>

            <div className='flex flex-col justify-between m-4 lg:items-center'>
                <div className='flex justify-start items-center'>
                    <div className='mr-5'>
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <div className=" bg-gray-600 w-[50px] h-[50px] object-contain rounded-full items-center justify-center flex ">
                                {image ? <img src={image} alt="file upload" className='w-[50px] h-[50px] object-contain rounded-full' /> : <img src="/public/assets/Vector2.png" alt="file upload" />}

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
                            {picture && picture.name ? picture.name : 'Uploaded Image'}
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
            <div>

            </div>

            {preview && showImage && <Model children={<img
                src={preview}
                alt="Preview"
                className="w-64 h-64 object-cover rounded-md border mb-4"
            />} onClose={() => setShowImage(false)} />}



            {/* Form fields */}
            <div className='flex flex-col ml-3 overflow-x-hidden lg:items-center  '>
                <form onSubmit={handleSubmit} className='flex flex-col w-[95%] lg:w-[40%] max-w-[90%] overflow-x-hidden'>
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
                            value={form.category} // Ensure the select value is controlled by form.state
                            required
                        >
                            {/* "Choose Category" option */}
                            <option value=''>Choose Category</option>
                            {/* Render categories only if `catgory` has items */}
                            {catgory.length > 0 &&
                                catgory.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))
                            }
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
                    < div className='w-full flex justify-between min-h-[48px] mt-28 fixed bottom-2 left-0 right-0 bg-white shadow-md px-4 gap-4' >
                        <button
                            onClick={handleDiscard}
                            className='w-[50%] bg-[#F2EFE3] rounded-md min-w-[164px]'
                            type="button"
                        >
                            Discard
                        </button>
                        <button
                            onClick={handleSubmit}
                            className='bg-[#F9D718] w-[50%]  rounded-md min-w-[164px]'
                        >
                            Save
                        </button>
                    </div >
                </form>
            </div >

            {/* Action Buttons */}

        </div >
    );
}
