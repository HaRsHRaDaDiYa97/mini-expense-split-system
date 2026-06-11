import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const { exp } = JSON.parse(jsonPayload);
    return Date.now() >= exp * 1000;
  } catch (error) {
    return true;
  }
};

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  if (!token || isTokenExpired(token)) {
    if (token) {
      dispatch(logout());
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;