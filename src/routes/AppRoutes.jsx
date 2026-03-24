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
import EnterpriseDashboard from "../pages/Enterprise/EnterpriseDashboard";
import EnterpriseCapacities from "../pages/Enterprise/EnterpriseCapacities";
import EnterprisePending from "../pages/Enterprise/EnterprisePending";
import EnterpriseAssignments from "../pages/Enterprise/EnterpriseAssignments";
import EnterpriseCollectors from "../pages/Enterprise/EnterpriseCollectors";
import EnterpriseRules from "../pages/Enterprise/EnterpriseRules";

function RequireRole({ children, allowedRoles = [] }) {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  if (!user) return <Navigate to="/login" replace />;

  const role = String(user.role || "").toLowerCase();
  const normalizedAllowed = allowedRoles.map((r) => String(r).toLowerCase());

  if (!normalizedAllowed.includes(role)) {
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
            <RequireRole allowedRoles={["admin", "administrator"]}>
              <AdminDashboard />
            </RequireRole>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RequireRole allowedRoles={["admin", "administrator"]}>
              <AdminUsers />
            </RequireRole>
          }
        />
        <Route
          path="/admin/areas"
          element={
            <RequireRole allowedRoles={["admin", "administrator"]}>
              <AdminAreas />
            </RequireRole>
          }
        />
        <Route
          path="/admin/waste-types"
          element={
            <RequireRole allowedRoles={["admin", "administrator"]}>
              <AdminWasteTypes />
            </RequireRole>
          }
        />
        <Route
          path="/admin/feedback"
          element={
            <RequireRole allowedRoles={["admin", "administrator"]}>
              <AdminFeedback />
            </RequireRole>
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
            <RequireRole allowedRoles={["enterprise"]}>
              <EnterprisePending />
            </RequireRole>
          }
        />
        <Route
          path="/enterprise/dashboard"
          element={
            <RequireRole allowedRoles={["enterprise"]}>
              <EnterpriseDashboard />
            </RequireRole>
          }
        />
        <Route
          path="/enterprise/capacities"
          element={
            <RequireRole allowedRoles={["enterprise"]}>
              <EnterpriseCapacities />
            </RequireRole>
          }
        />
        <Route
          path="/enterprise/assignments"
          element={
            <RequireRole allowedRoles={["enterprise"]}>
              <EnterpriseAssignments />
            </RequireRole>
          }
        />
        <Route
          path="/enterprise/collectors"
          element={
            <RequireRole allowedRoles={["enterprise"]}>
              <EnterpriseCollectors />
            </RequireRole>
          }
        />
        <Route
          path="/enterprise/rules"
          element={
            <RequireRole allowedRoles={["enterprise"]}>
              <EnterpriseRules />
            </RequireRole>
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
