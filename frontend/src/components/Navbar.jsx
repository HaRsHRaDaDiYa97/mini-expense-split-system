import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Structural container for better ultra-wide screen handling */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo / Brand */}
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
              Expense Split
            </h1>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* User Info */}
            <div className="flex items-center gap-2 text-gray-600">
              <FaUserCircle className="text-gray-400 text-xl" />
              {/* Hide name on mobile to keep navbar clean and prevent overflow */}
              <span className="text-sm font-medium hidden sm:block">
                {user?.name || "Guest"}
              </span>
            </div>

            {/* Subtle Divider (Desktop only) */}
            <div className="h-5 w-px bg-gray-200 hidden sm:block" aria-hidden="true"></div>

            {/* Logout Action */}
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors duration-200 focus:outline-none"
            >
              Logout
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;