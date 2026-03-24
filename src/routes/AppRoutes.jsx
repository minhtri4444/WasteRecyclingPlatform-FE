import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/common/Home";
import CollectionTasks from "../pages/collector/TaskList";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminUsers from "../pages/Admin/AdminUsers";
import AdminAreas from "../pages/Admin/AdminAreas";
import AdminWasteTypes from "../pages/Admin/AdminWasteTypes";
import AdminFeedback from "../pages/Admin/AdminFeedback";

function RequireAdmin({ children }) {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  if (!user) return <Navigate to="/login" replace />;

  const role = String(user.role || "").toLowerCase();
  if (role !== "admin" && role !== "administrator") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />

        <Route
          path="/admin/dashboard"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RequireAdmin>
              <AdminUsers />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/areas"
          element={
            <RequireAdmin>
              <AdminAreas />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/waste-types"
          element={
            <RequireAdmin>
              <AdminWasteTypes />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/feedback"
          element={
            <RequireAdmin>
              <AdminFeedback />
            </RequireAdmin>
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
