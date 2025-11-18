import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavbarComponent from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import StoreList from './pages/Store/StoreList';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserList from './pages/Admin/UserList';
import AdminStoreList from './pages/Admin/StoreList';
import OwnerDashboard from './pages/Owner/OwnerDashboard';
import Footer from './components/Footer';



function App() {
  return (
    <>
      <NavbarComponent />

      <Routes>
        <Route path="/" element={<Navigate to="/stores" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/stores"
          element={
            <ProtectedRoute roles={['USER', 'ADMIN', 'STORE_OWNER']}>
              <StoreList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <UserList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/stores"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <AdminStoreList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute roles={['STORE_OWNER']}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
