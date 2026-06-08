import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/register", formData);

      toast.success(res.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      {/* Register Card Container */}
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Please fill in your details to sign up.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Name Input Group */}
          <div>
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="John Doe"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-200"
              onChange={handleChange}
              value={formData.name}
            />
          </div>

          {/* Email Input Group */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-200"
              onChange={handleChange}
              value={formData.email}
            />
          </div>

          {/* Password Input Group */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-200"
              onChange={handleChange}
              value={formData.password}
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 mt-2"
          >
            Register
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-gray-900 hover:underline transition-all duration-200"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;