import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/common/Home";
import CollectionTasks from "../pages/collector/TaskList";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />

        {/* Placeholder cho các Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <div className="p-8 bg-white rounded-[32px] shadow-sm font-bold">
              Admin Dashboard Content
            </div>
          }
        />
        <Route
          path="/citizen/report"
          element={
            <div className="p-8 bg-white rounded-[32px] shadow-sm font-bold">
              Citizen Report Page
            </div>
          }
        />
        <Route
          path="/enterprise/pending"
          element={
            <div className="p-8 bg-white rounded-[32px] shadow-sm font-bold">
              Enterprise Pending Items
            </div>
          }
        />
        <Route
          path="/collector/tasks"
          element={<CollectionTasks />}
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
