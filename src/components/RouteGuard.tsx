import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/store";

interface RouteGuardProps {
  requireAuth: boolean;
}

export default function RouteGuard({ requireAuth }: RouteGuardProps) {
  const token = useAppSelector((state) => state.auth.token);

  if (requireAuth && !token) {
    return <Navigate to="/login" replace />;
  }

  if (!requireAuth && token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
