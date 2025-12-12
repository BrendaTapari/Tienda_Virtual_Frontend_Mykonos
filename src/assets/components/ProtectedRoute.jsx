import { useAuth } from "../context/AuthContext";
import { Redirect } from "wouter";

/**
 * Protected route component for admin-only pages
 * Redirects to login if not authenticated
 * Redirects to home if authenticated but not admin
 */
export default function ProtectedRoute({ component: Component, ...rest }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  if (!isAdmin) {
    return <Redirect to="/" />;
  }

  return <Component {...rest} />;
}
