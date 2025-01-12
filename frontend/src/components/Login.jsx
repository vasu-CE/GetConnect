// import { label } from '@radix-ui/react-label'
import React, {Suspense, lazy , useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';
import axios from 'axios';
import Waves from './ReactBeats/Waves';

function Login() {
    const [loading, setLoading] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [next, setNext] = useState(false);
    const [input, setInput] = useState({
        email: '',
        userName: '',
        password: '',
        mobile: '',
        otp: ''
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeHandler = (e) => {
        setInput({...input, [e.target.name]: e.target.value})
    }

    const handleOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_URL}/user/sendotp`, {
                email: input.email
            });
            
            if (res.data.success) {
                toast.success("OTP sent successfully!")
                setNext(true);
            } else {
                toast.error(res.data.message || 'An error occurred while sending OTP');
            }
        } catch(err) {
            toast.error(err.response?.data?.message || 'server error')
        } finally {
            setLoading(false);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const endpoint = isSignup 
                ? `${import.meta.env.VITE_URL}/user/signup`
                : `${import.meta.env.VITE_URL}/user/login`;
            {console.log(endpoint)}
            const payload = isSignup 
                ? {
                    userName: input.userName,
                    email: input.email,
                    password: input.password,
                    otp: input.otp,
                  }
                : {
                    email: input.email,
                    password: input.password,
                  };

            const res = await axios.post(endpoint, payload ,{withCredentials : true});

            if (res.data.success) {
                if (!isSignup) {
                    dispatch(setAuthUser(res.data.user));
                }
                toast.success(res.data.message || `${isSignup ? 'Signup' : 'Login'} successful`);
                setInput({
                    email: '',
                    userName: '',
                    password: '',
                    mobile: '',
                    otp: ''
                });
                navigate('/home');
            } else {
                toast.error(res.data.message || `An error occurred during ${isSignup ? 'signup' : 'login'}`);
            }
        } catch(err) {
            toast.error(err.response?.data?.message || 'server error')
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='w-screen h-screen flex justify-center items-center bg-fuchsia-100 relative mt-[-20px]'>
            <Suspense fallback={<div>Loading...</div>}>
                <Waves
                  lineColor="#999"
                  backgroundColor="rgba(255, 255, 255, 0.2)"
                  waveSpeedX={0.02}
                  waveSpeedY={0.01}
                  waveAmpX={40}
                  waveAmpY={20}
                  friction={0.9}
                  tension={0.01}
                  maxCursorMove={120}
                  xGap={12}
                  yGap={36}
                />
            </Suspense>

<form onSubmit={submitHandler} className="shadow-lg border border-fuchsia-300 bg-slate-100 flex flex-col gap-2 p-8 pb-2 w-[30vw] absolute">
    <h1 className='text-xl text-center font-bold mb-2'>{isSignup ? 'Signup' : 'Login'}</h1>

    {isSignup && (
        <div className='flex items-center gap-2'>
            <label className='font-medium whitespace-nowrap w-[32%]'>UserName :</label>
            <Input
                type="text"
                name="userName"
                value={input.userName}
                onChange={changeHandler}
                className="bg-slate-200 focus-visible:ring-transparent text-gray-800 my-2"
                disabled={loading}
            />
        </div>
    )}

    <div className='flex items-center gap-2'>
        <label className='font-medium whitespace-nowrap w-[32%]'>Email<sup className='text-red-500 text-lg'>*</sup> : </label>
        <Input
            type="email"
            name="email"
            required
            value={input.email}
            onChange={changeHandler}
            className="bg-slate-200 focus-visible:ring-transparent text-gray-800 my-2"
            disabled={loading}
        />
    </div>

    <div className='flex items-center gap-2'>
        <label className='font-medium whitespace-nowrap w-[32%]'>Password :</label>
        <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeHandler}
            className="bg-slate-200 focus-visible:ring-transparent text-gray-800 my-2"
            disabled={loading}
        />
    </div>

    {isSignup && (
        <>
            {!next && (
                <Button
                    className="w-[30%] mx-auto mt-3"
                    onClick={handleOTP}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Next'}
                </Button>
            )}

            {next && (
                <div className='flex items-center gap-2'>
                    <label className='font-medium whitespace-nowrap w-[32%]'>OTP :</label>
                    <Input
                        type="tel"
                        name="otp"
                        value={input.otp}
                        onChange={changeHandler}
                        className="bg-slate-200 focus-visible:ring-transparent text-gray-800 my-2"
                        disabled={loading}
                    />
                </div>
            )}
        </>
    )}

    {(!isSignup || (isSignup && next)) && (
        <Button
            className='bg-purple-500 hover:bg-purple-600'
            type='submit'
            disabled={loading}
        >
            {loading ? 'Loading...' : (isSignup ? 'Signup' : 'Login')}
        </Button>
    )}

    <div className='text-center mt-3'>
        {isSignup ? 'Already have an account?' : "Don't have an account?"}
        <button 
            type="button"
            onClick={() => {
                setIsSignup(!isSignup);
                setNext(false);
                setInput({
                    email: '',
                    userName: '',
                    password: '',
                    mobile: '',
                    otp: ''
                });
            }}
            className="text-blue-600 ml-1"
        >
            {isSignup ? 'Login' : 'Signup'}
        </button>
    </div>
</form>

        </div>
    )
}

export default Login
