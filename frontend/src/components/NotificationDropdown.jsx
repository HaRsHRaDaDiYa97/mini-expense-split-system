import React, { useState, useEffect, useRef } from "react";
import { Bell, Check, Loader2 } from "lucide-react";
import { getNotificationsApi, markNotificationsReadApi } from "../api/notificationApi";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await getNotificationsApi();
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Close when clicking outside
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllAsRead = async () => {
    try {
      await markNotificationsReadApi();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all focus:outline-none cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="px-4 py-2 border-b border-gray-50 flex items-center justify-between">
            <span className="font-bold text-gray-900 text-sm">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-indigo-650 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="py-8 flex justify-center text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`px-4 py-3 border-b border-gray-50 text-xs transition-colors hover:bg-gray-50 flex gap-2 ${
                    !notification.isRead ? "bg-indigo-50/20" : ""
                  }`}
                >
                  <div className="flex-1">
                    <p className="text-gray-750 font-medium leading-relaxed">
                      {notification.message}
                    </p>
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      {new Date(notification.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {!notification.isRead && (
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
