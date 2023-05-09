import React from "react";
import { Route, Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  isAuthenticated?: boolean;
  isAuthorized?: boolean;
  redirectTo?: string;
  element: React.ReactElement;
  path: string;
  role: string
}

const AdminRoute: React.FC<ProtectedRouteProps> = ({
  isAuthenticated,
  isAuthorized,
  redirectTo,
  element: Element,
  path,
  role,
  ...rest
}) => {
  return (
    <Route
      path={path}
      {...rest}
      element={
        role === 'admin' ? (
          Element
        ) : (
          <Navigate to={'/'} />
        )
      }
    />
  );
};

export default AdminRoute;
