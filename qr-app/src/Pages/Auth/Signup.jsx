import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
export const Signup = () => {
    const naviagate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: ''
    });

    async function handleForm(e) {
        e.preventDefault();
        const resoponce = await axios.post('http://localhost:5000/api/v1/auth/signup', form);
        console.log(resoponce)
        if (!resoponce.status === 201) {
            throw new Error({ message: 'Responce Failed' })
        }
        naviagate('/login')
    };

    function handleInput(e) {
        e.preventDefault();
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        console.log(form)
    }
    return (
        <div className='w-[375px] h-full overflow-x-hidden items-center relative'>
            <div className='flex text-left p-4'>
                <img src="/assets/back.png" alt="back" className='shadow-sm rounded-full' />
                <Link to="/" className='ml-2 font-semibold'>Home</Link>
            </div>
            <div className='mt-10'>
                <h2 className='flex justify-center text-2xl font-semibold'>Ragistration Form</h2>
                <form onSubmit={handleForm} className='w-[93%] m-3 shadow-md rounded-md'>
                    <div className='flex flex-col'>
                        {/* <label className='m-2'>UserName</label> */}
                        <input type="text" name='name' placeholder='Name' required
                            className='m-2 border border-gray-400 pl-2 h-12 rounded-md '
                            onChange={handleInput}
                        />
                    </div>
                    <div className='flex flex-col'>
                        {/* <label className='m-2'>Email</label> */}
                        <input type="email" name='email' placeholder='Email' required
                            className='m-2 border border-gray-400 pl-2 h-12 rounded-md '
                            onChange={handleInput} />
                    </div>
                    <div className='flex flex-col'>
                        {/* <label className='m-2'>Password</label> */}
                        <input type="password" name='password' placeholder='Password' required
                            className='m-2 border border-gray-400 pl-2 h-12 rounded-md '
                            onChange={handleInput} />
                    </div>
                    <div className='w-[93%]  m-2 mb-2 bg-[#5780FA] rounded-md'>
                        <button type="submit" className='h-12  flex justify-center text-center items-center m-auto text-xl  '>Signup</button>
                    </div>
                </form>
            </div>
        </div>

    )
}
