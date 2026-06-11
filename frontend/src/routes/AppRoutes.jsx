import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import GroupDetails from "../pages/GroupDetails";
import ProtectedRoute from "../components/ProtectedRoute";
import LandingPage from "../pages/LandingPage";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/"
                    element={<LandingPage />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/group/:id"
                    element={
                        <ProtectedRoute>
                            <GroupDetails />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;