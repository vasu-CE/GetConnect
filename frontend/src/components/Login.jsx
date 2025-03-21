import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import axios from "axios";

function Login() {
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(() => {
    return JSON.parse(localStorage.getItem("isSignup")) || false;
  });
  const [next, setNext] = useState(false);
  const [timer, setTimer] = useState(0);
  const [input, setInput] = useState({
    email: "",
    userName: "",
    password: "",
    otp: "",
  });

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/user/sendotp`, {
        email: input.email,
      });

      if (res.data.success) {
        toast.success("OTP sent successfully!");
        setNext(true);
        setTimer(60);
      } else {
        toast.error(res.data.message || "An error occurred while sending OTP");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "server error");
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

      const res = await axios.post(endpoint, payload, {
        withCredentials: true,
      });

      if (res.data.success) {
        if (!isSignup) {
          dispatch(setAuthUser(res.data.user));
        }
        toast.success(
          res.data.message || `${isSignup ? "Signup" : "Login"} successful`
        );
        setInput({
          email: "",
          userName: "",
          password: "",
          otp: "",
        });
        navigate("/home");
      } else {
        toast.error(
          res.data.message ||
            `An error occurred during ${isSignup ? "signup" : "login"}`
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fuchsia-200 to-purple-200">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
          {isSignup ? "Sign Up" : "Log In"}
        </h1>
        <form onSubmit={submitHandler} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <Input
                type="text"
                name="userName"
                placeholder="UserName"
                value={input.userName}
                onChange={changeHandler}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={loading}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              type="email"
              name="email"
              placeholder="xyz@gmail.com"
              required
              value={input.email}
              onChange={changeHandler}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              type="password"
              name="password"
              placeholder="password"
              value={input.password}
              onChange={changeHandler}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              disabled={loading}
            />
          </div>
          {isSignup && (
            <>
              {!next && (
                <Button
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
                  onClick={handleOTP}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Send OTP"}
                </Button>
              )}
              {next && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    OTP
                  </label>
                  <Input
                    type="tel"
                    name="otp"
                    value={input.otp}
                    onChange={changeHandler}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    disabled={loading}
                  />
                </div>
              )}
              {next && timer > 0 && (
                <p className="text-gray-500 text-sm text-center">
                  Resend OTP in {timer} seconds
                </p>
              )}
              {next && timer === 0 && (
                <Button
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                  onClick={handleOTP}
                  disabled={loading}
                >
                  Resend OTP
                </Button>
              )}
            </>
          )}
          {(!isSignup || (isSignup && next)) && (
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md"
              type="submit"
              disabled={loading}
            >
              {loading ? "Loading..." : isSignup ? "Sign Up" : "Log In"}
            </Button>
          )}
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            {isSignup ? "Already have an account?" : "Don't have an account?"}
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                localStorage.setItem("isSignup", JSON.stringify(!isSignup));
                setNext(false);
                setInput({
                  email: "",
                  userName: "",
                  password: "",
                  otp: "",
                });
              }}
              className="text-indigo-600 hover:text-indigo-800 ml-1"
            >
              {isSignup ? "Log In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;