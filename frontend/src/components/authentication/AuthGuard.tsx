import type { FC, PropsWithChildren } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Navigate, Outlet } from "react-router";
import { isFileLoadingAllowed } from "vite";

export const AuthGuard: FC<PropsWithChildren> = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <div>Sign you in. . .</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
