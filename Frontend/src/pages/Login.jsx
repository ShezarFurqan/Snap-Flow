// src/pages/Login.jsx 
import React, { useContext, useState } from 'react';
import { SnapContext } from "../context/SnapContext";
import { toast } from "react-toastify";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const { backendUrl, setToken, navigate } = useContext(SnapContext);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const onChangeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (form.email && form.password) {
        if (!isLogin) {
          // Signup
          const response = await axios.post(`${backendUrl}/api/auth/register`, form);
          if (response.data.success) {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            toast.success("Register Success");
            navigate("/"); 
          }
        } else {
          // Login
          const response = await axios.post(`${backendUrl}/api/auth/login`, form);

          if (response.data.success) {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            toast.success("Login Success");
            navigate("/");
          } else if (response.data.message === "Incorrect password") {
            toast.error("Incorrect password");
          }
        }
      } else {
        toast.error("Please fill all required fields");
      }
    } catch (error) {
      // Agar backend "Incorrect password" bhejta hai
      if (error.response?.data?.message === "Incorrect password") {
        toast.error("Incorrect password");
      } else {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    }
  };

  return (
    <div className="w-full min-h-full flex justify-center items-center">
      <div className="bg-[#111122] p-8 rounded-2xl shadow-lg w-full max-w-sm text-center">
        <h2 className="text-white text-2xl font-bold mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <form className="space-y-4" onSubmit={onSubmitHandler}>
          {!isLogin && (
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={onChangeHandler}
              placeholder="Full Name"
              className="w-full p-3 rounded-lg bg-[#1a1a2e] text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          )}

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChangeHandler}
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-[#1a1a2e] text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={onChangeHandler}
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-[#1a1a2e] text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#4F2DB8] to-[#261D5E] outfit-300 hover:from-[#261D5E] hover:to-[#4F2DB8] text-white py-3 rounded-lg font-semibold transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-gray-400 mt-4 text-sm">
          {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#4F2DB8] cursor-pointer hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
