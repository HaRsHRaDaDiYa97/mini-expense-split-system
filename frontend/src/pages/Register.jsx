import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../api/axios";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [strength, setStrength] = useState({ score: 0, label: "", color: "bg-gray-200" });

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  const checkPasswordStrength = (password) => {
    if (!password) {
      return { score: 0, label: "", color: "bg-gray-200" };
    }
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
      return { score, label: "Weak", color: "bg-red-500 w-1/3" };
    } else if (score <= 4) {
      return { score, label: "Medium", color: "bg-amber-500 w-2/3" };
    } else {
      return { score, label: "Strong", color: "bg-emerald-500 w-full" };
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "password") {
      setStrength(checkPasswordStrength(value));
    }

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await api.post("/auth/register", formData);

      toast.success(res.data.message || "Registration Successful! Please log in.");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed. Please try again."
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
            Create an account
          </h1>
          <p className="mt-2 text-sm text-gray-550">
            Sign up to start splitting expenses easily
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          
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
              className={`w-full px-4 py-2.5 border ${
                errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-gray-950"
              } rounded-xl text-sm text-gray-900 focus:ring-2 focus:border-transparent outline-none transition-all duration-200`}
              onChange={handleChange}
              value={formData.name}
            />
            {errors.name && (
              <p className="text-xs text-red-650 mt-1.5 font-medium">{errors.name}</p>
            )}
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

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2.5 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Password strength:</span>
                  <span className={`font-semibold ${
                    strength.label === "Weak" ? "text-red-600" : strength.label === "Medium" ? "text-amber-600" : "text-emerald-600"
                  }`}>{strength.label}</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-300 ${strength.color}`}></div>
                </div>
              </div>
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
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-gray-650 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-gray-950 hover:underline transition-all duration-200"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;