
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PrivateAxios from '../../Services/PrivateAxios';

export const NewCategory = () => {
    const naviagate = useNavigate();
    const [category, setCategory] = useState('');
    const [picture, setPicture] = useState(null);
    const [form, setForm] = useState({
        category: '',
        description: ''
    });

    function handleImage(e) {
        const file = e.target.files[0];
        setPicture(file)
    };

    function handleFormDate(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }
    console.log(category)

    async function handleSubmit() {
        const Form = new FormData();

        Form.append('picture', picture);
        Form.append('name', form.category);
        Form.append('description', form.description);
        try {
            const responce = await PrivateAxios.post('/products/new-category', Form);
            console.log(responce)
            if (responce.status === 201) {
                setCategory(responce.data.content)
                naviagate('/admin')
            }
        } catch (error) {
            throw new Error({ message: 'responce Failed', error })
        }
    }


    return (
        <div>
            <div className='flex text-left p-4 '>
                <img src="/public/assets/back.png" alt="back" className=' px-2' />
                <Link to={'/admin'}>Add Product</Link>
            </div>
            <div className='flex justify-between m-4'>
                <div className='flex justify-start items-center'>
                    <div className='mr-5'>
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <div className="rounded-full bg-gray-600 p-4">
                                <img src="/public/assets/vector2.png" alt="file upload" />
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

                        <div className=''>
                            {picture && <p>{picture.name}</p>}
                        </div>
                    </div>
                    <div className='flex gap-4'>
                        <button className='bg-[#F9D718] w-32 flex font-light items-center text-center justify-center rounded-md h-8'>Upload Image</button>
                        <button className='bg-[#D9D9D9] border rounded-md px-5' >Delete</button>
                    </div>
                </div>
            </div>
            <form className='flex flex-col w-[90%] max-w-[90%] overflow-hidden m-4' onSubmit={handleSubmit}>
                <div className='w-full max-w-full h-[70px] flex flex-col m-1 overflow-x-hidden '>
                    <label className='p'>Category</label>
                    <input type="text" name="category" id="" placeholder='Chinese Burer' onChange={handleFormDate} className='bg-[#F9F9F9] min-h-[40px]  overflow-x-hidden' />
                </div>
                <div className='w-full max-w-full h-[70px] flex flex-col m-1 overflow-x-hidden '>
                    <label className='p'>Description</label>
                    <input type="text" name="description" id="" placeholder='description' onChange={handleFormDate} className='bg-[#F9F9F9] min-h-[40px]  overflow-x-hidden' />
                </div>
            </form>
            <div className='flex justify-between  min-h-[48px] m-4 mt-28 fixed bottom-0 gap-3'>
                <button className='bg-[#F2EFE3] rounded-md w-[164px]'>Discard</button>
                <button onClick={handleSubmit} type='submit' className='bg-[#F9D718] w-[164px] rounded-md'>Save</button>
            </div>
        </div>
    )
}
