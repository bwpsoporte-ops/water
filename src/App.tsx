/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { SellerApp } from './pages/SellerApp';
import { Products } from './pages/Products';
import { Dispatches } from './pages/Dispatches';
import { Sales } from './pages/Sales';
import { Closures } from './pages/Closures';
import { Customers } from './pages/Customers';
import { Expenses } from './pages/Expenses';
import { Sellers } from './pages/Sellers';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Maintenance } from './pages/Maintenance';
import { Layout } from './components/Layout';

function AppRoutes() {
  const { profile, loading, isAdmin, isSeller, isIT } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (!profile) {
    return <Login />;
  }

  // If user must change password, they should only see the login page (which handles the change)
  if (profile.mustChange) {
    return <Login />;
  }

  const isManagement = isAdmin || isIT;

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {isManagement ? (
          <>
            <Route index element={<AdminDashboard />} />
            <Route path="sellers" element={<Sellers />} />
            <Route path="products" element={<Products />} />
            <Route path="dispatches" element={<Dispatches />} />
            <Route path="sales" element={<Sales />} />
            <Route path="closures" element={<Closures />} />
            <Route path="customers" element={<Customers />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="maintenance" element={<Maintenance />} />
          </>
        ) : isSeller ? (
          <>
            <Route index element={<SellerApp />} />
          </>
        ) : (
          <Route index element={<div className="p-8">Acceso no autorizado. Contacte al administrador.</div>} />
        )}
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
