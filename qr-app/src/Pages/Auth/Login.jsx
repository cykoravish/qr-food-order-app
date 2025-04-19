
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PrivateAxios from '../../Services/PrivateAxios';

export const Login = () => {
    const naviagate = useNavigate();
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: ''
    });

    async function handleForm(e) {
        e.preventDefault();

        const resoponce = await PrivateAxios.post('/auth/login', form);
        if (resoponce.status === 200) {
            await naviagate('/')
        }
    };

    function handleInput(e) {
        e.preventDefault();
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }
    return (
        <div className='w-[375px] h-full overflow-x-hidden items-center relative'>
            <div className='flex text-left p-4'>
                <img src="/assets/back.png" alt="back" className='shadow-sm rounded-full' />
                <Link to="/" className='ml-2 font-semibold'>Home</Link>
            </div>
            <div className='mt-10'>
                <h2 className='flex justify-center text-2xl font-semibold'>Login Form</h2>
                <form onSubmit={handleForm} className='w-[93%] m-3 shadow-md rounded-md'>

                    <div className='flex flex-col'>
                        <input type="email" name='email' placeholder='Email' required
                            className='m-2 border border-gray-400 pl-2 h-12 rounded-md '
                            onChange={handleInput} />
                    </div>
                    <div className='flex flex-col'>
                        <input type="password" name='password' placeholder='Password' required
                            className='m-2 border border-gray-400 pl-2 h-12 rounded-md '
                            onChange={handleInput} />
                    </div>
                    <div className='w-[93%]  m-2 mb-2 bg-[#5780FA] rounded-md'>
                        <button type="submit" className='h-12  flex justify-center text-center items-center m-auto text-xl  '>Login</button>
                    </div>
                </form>
            </div>
        </div>

    )
}
