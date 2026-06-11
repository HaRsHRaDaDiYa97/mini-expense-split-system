import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X, LogOut, User, ChevronDown, LayoutDashboard } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gray-950 text-white flex items-center justify-center font-bold text-lg">
                E
              </div>
              <span className="font-bold text-lg text-gray-950 tracking-tight">
                ExpenseSplit
              </span>
            </Link>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-955 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-all"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            </div>
          </div>

          {/* Actions & Profiles */}
          <div className="hidden md:flex items-center gap-4">
            {/* In-app Notifications Dropdown */}
            <NotificationDropdown />

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl border border-gray-100 hover:bg-gray-55 hover:border-gray-200 transition-all text-gray-700 hover:text-gray-950 focus:outline-none cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-gray-900 text-white font-bold text-xs flex items-center justify-center uppercase">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <span className="text-sm font-semibold pr-1">
                  {user?.name || "User"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {profileOpen && (
                <>
                  {/* Backdrop overlay to close */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setProfileOpen(false)}
                  ></div>
                  
                  {/* Dropdown panel */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-gray-100 shadow-xl py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                      <p className="text-xs text-gray-400 font-medium">Logged in as</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        handleLogout();
                      }}
                      className="w-full px-4 py-2.5 hover:bg-red-50 text-left text-sm font-medium text-red-600 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Right Controls & Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <NotificationDropdown />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-500 hover:text-gray-950 hover:bg-gray-100 rounded-lg transition-all focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Slide-in Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3 animate-in slide-in-from-top duration-200">
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-gray-700 hover:text-gray-955 rounded-xl hover:bg-gray-50 transition-all"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <div className="pt-4 border-t border-gray-100">
            <div className="px-4 py-2 mb-2">
              <p className="text-xs text-gray-400 font-semibold">User Info</p>
              <p className="text-sm font-bold text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-red-650 hover:bg-red-50 rounded-xl transition-all text-left cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;