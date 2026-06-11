import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/axios";
import { loginSuccess } from "../features/auth/authSlice";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear errors when typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await api.post("/auth/login", formData);

      dispatch(
        loginSuccess({
          user: res.data.user,
          token: res.data.token,
        })
      );

      toast.success("Welcome back! Login Successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gray-950 text-white flex items-center justify-center font-bold text-xl mx-auto mb-4">
            E
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Sign in to ExpenseSplit
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Keep track of shared bills and group settlements
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          
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
              placeholder="name@company.com"
              className={`w-full px-4 py-2.5 border ${
                errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-gray-950"
              } rounded-xl text-sm text-gray-900 focus:ring-2 focus:border-transparent outline-none transition-all duration-200`}
              onChange={handleChange}
              value={formData.email}
            />
            {errors.email && (
              <p className="text-xs text-red-650 mt-1.5 font-medium">{errors.email}</p>
            )}
          </div>

          {/* Password Input Group */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                className={`w-full pl-4 pr-11 py-2.5 border ${
                  errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-gray-950"
                } rounded-xl text-sm text-gray-900 focus:ring-2 focus:border-transparent outline-none transition-all duration-200`}
                onChange={handleChange}
                value={formData.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-650 mt-1.5 font-medium">{errors.password}</p>
            )}
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 mt-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-gray-650 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-gray-950 hover:underline transition-all duration-200"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;