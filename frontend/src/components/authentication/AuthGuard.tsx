import type { FC, PropsWithChildren } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Navigate, Outlet } from "react-router";

export const AuthGuard: FC<PropsWithChildren> = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
