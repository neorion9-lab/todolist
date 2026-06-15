import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import LoginPage from './pages/LoginPage'
import RoleSelectPage from './pages/RoleSelectPage'
import DashboardPage from './pages/DashboardPage'

function AppRoutes() {
  const { currentUser, needsRoleSelection, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>로딩 중...</p>
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={currentUser ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/role-select"
        element={
          <PrivateRoute>
            <RoleSelectPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            {needsRoleSelection ? <Navigate to="/role-select" replace /> : <DashboardPage />}
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
