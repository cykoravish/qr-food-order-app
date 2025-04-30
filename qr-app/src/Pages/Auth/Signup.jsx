import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import publicAxios from '../../Services/PublicAxios';
import { ReverseButton } from '../../components/Client/ReverseButton';
export const Signup = () => {
    const naviagate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: ''
    });

    async function handleForm(e) {
        e.preventDefault();
        const resoponce = await publicAxios.post('/auth/signup', form)
        if (!resoponce.status === 201) {
            throw new Error({ message: 'Responce Failed' })
        }
        naviagate('/login')
    };

    function handleInput(e) {
        e.preventDefault();
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }
    return (
        <div className='w-[98%] mx-auto my-0 overflow-x-hidden  relative'>
            <ReverseButton route={'/'} routeName={'Home'} css={'mt-2 ml-2'} />
            <div className='mt-10 flex flex-col items-center '>
                <h2 className='flex justify-center text-2xl font-semibold'>Ragistration Form</h2>
                <form onSubmit={handleForm} className='sm:w-[90%]  lg:w-[40%] flex flex-col text-center justify-center shadow-md rounded-md p-4'>
                    <div className='flex flex-col'>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            required
                            className="m-2 border border-gray-400 pl-2 h-12 rounded-md"
                            onChange={handleInput}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                            className="m-2 border border-gray-400 pl-2 h-12 rounded-md"
                            onChange={handleInput}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                            className="m-2 border border-gray-400 pl-2 h-12 rounded-md"
                            onChange={handleInput}
                        />
                    </div>

                    {/* 🛠 No extra div! Directly button */}
                    <button
                        type="submit"
                        className="m-2 bg-[#5780FA] text-white font-semibold h-12 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        Signup
                    </button>

                    <p className="flex justify-center mt-4">
                        Already have an account?
                        <Link className="text-blue-500 ml-1" to="/login">Login</Link>
                    </p>
                </form>

            </div>
        </div >

    )
}
