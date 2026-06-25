import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';


export const GuestRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (isAuthenticated && user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/overview" replace />;
    }
    if (user.role === 'seller') {
      return <Navigate to="/seller/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

/**
 * Route guard for routes that require authentication and optional role authorization.
 */
export const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // If authenticated but not authorized, redirect to their home page
    if (user?.role === 'admin') {
      return <Navigate to="/admin/overview" replace />;
    }
    if (user?.role === 'seller') {
      return <Navigate to="/seller/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

/**
 * Route guard specifically for sellers that requires them to have verified/created a shop.
 * If they do not have a shop, redirects them to /verify-seller.
 */
import { useState, useEffect } from 'react';
import { shopsAPI } from '../services/api';

export const SellerRoute = () => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [shop, setShop] = useState(null);
  const [loadingShop, setLoadingShop] = useState(true);

  useEffect(() => {
    const checkShop = async () => {
      if (isAuthenticated && user?.role === 'seller') {
        try {
          const response = await shopsAPI.getOwned();
          setShop(response.data);
        } catch (err) {
          setShop(null);
        } finally {
          setLoadingShop(false);
        }
      } else {
        setLoadingShop(false);
      }
    };
    checkShop();
  }, [isAuthenticated, user]);

  if (authLoading || (isAuthenticated && user?.role === 'seller' && loadingShop)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'seller') {
    return <Navigate to="/" replace />;
  }

  if (!shop) {
    return <Navigate to="/verify-seller" replace />;
  }

  return <Outlet />;
};
