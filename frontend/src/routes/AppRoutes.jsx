import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import GroupDetails from "../pages/GroupDetails";
import ProtectedRoute from "../components/ProtectedRoute";
import Summary from "../pages/Summary";
import Settlements from "../pages/Settlements";

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
                <Route
                    path="/group/:id/summary"
                    element={
                        <ProtectedRoute>
                            <Summary />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/group/:id/settlements"
                    element={
                        <ProtectedRoute>
                            <Settlements />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;