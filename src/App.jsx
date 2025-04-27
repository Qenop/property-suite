// src/App.jsx
import { Routes, Route } from 'react-router-dom';

import AuthProvider from './auth/AuthProvider';
import ProtectedRoute from './auth/ProtectedRoute';

import Home from './pages/Home'; // 
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddProperty from './components/properties/AddProperty';
import PropertiesPage from './components/properties/PropertiesPage';
import PropertyDetailsPage from './components/properties/PropertyDetailsPage';
import AssignTenant from './components/tenants/AssignTenant';
import TenantsPage from './components/tenants/TenantsPage';
import BillingPage from './pages/BillingPage';
import SidebarLayout from './layouts/SidebarLayout';
import SellingPage from './pages/SellingPage'; // NEW
import Header from './layouts/Header';  // NEW

export default function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <Header />

        <main className="flex-1 bg-gray-50">
          <Routes>
            {/* Public Home page */}
            <Route path="/" element={<Home />} />
            
            {/* Selling page route */}
            <Route path="/selling" element={<SellingPage />} /> {/* Link to Selling Page */}

            {/* Login page */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes with sidebar */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <SidebarLayout>
                    <Dashboard />
                  </SidebarLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-property"
              element={
                <ProtectedRoute>
                  <SidebarLayout>
                    <AddProperty />
                  </SidebarLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/properties"
              element={
                <ProtectedRoute>
                  <SidebarLayout>
                    <PropertiesPage />
                  </SidebarLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/properties/:id"
              element={
                <ProtectedRoute>
                  <SidebarLayout>
                    <PropertyDetailsPage />
                  </SidebarLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/assign-tenant"
              element={
                <ProtectedRoute>
                  <SidebarLayout>
                    <AssignTenant />
                  </SidebarLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tenants"
              element={
                <ProtectedRoute>
                  <SidebarLayout>
                    <TenantsPage />
                  </SidebarLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/billing"
              element={
                <ProtectedRoute>
                  <SidebarLayout>
                    <BillingPage />
                  </SidebarLayout>
                </ProtectedRoute>
              }
            />

            {/* 404 fallback */}
            <Route
              path="*"
              element={<div className="p-6 text-center text-gray-500">404 - Page Not Found</div>}
            />
          </Routes>
        </main>

        <footer className="bg-black p-4 text-center">
          <p className="text-sm text-white">
            Copyright &copy; 2025 Property Suite™ | <a href="https://qenops.co.ke" target="_blank">QENOPS SYSTEMS</a> . All rights reserved.
          </p>
        </footer>
      </div>
    </AuthProvider>
  );
}
