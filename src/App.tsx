import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import RouteGuard from "./components/RouteGuard";
import ProjectDetails from "./pages/ProjectDetails";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RouteGuard requireAuth={false} />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<RouteGuard requireAuth />}>
          <Route path="/" element={<Dashboard />} />
        </Route>

        <Route element={<RouteGuard requireAuth />}>
          <Route path="/projects/:projectId" element={<ProjectDetails />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster position="top-right" />
    </BrowserRouter>
  );
}
