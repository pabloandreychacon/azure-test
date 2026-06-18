import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Signup } from './pages/Signup'
import { Login } from './pages/Login'
import { BusinessStatusList } from './pages/BusinessStatusList'
import { CreateBusinessStatus } from './pages/CreateBusinessStatus'
import { EditBusinessStatus } from './pages/EditBusinessStatus'
import { EditUser } from './pages/EditUser'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useAuth } from './contexts/AuthContext'

function App() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading && location.pathname !== '/login') {
    return <div style={{ padding: '20px' }}>Loading...</div>
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? '/business-statuses' : '/login'} replace />} />
      <Route path="/signup" element={user ? <Navigate to="/business-statuses" replace /> : <Signup />} />
      <Route path="/login" element={user ? <Navigate to="/business-statuses" replace /> : <Login />} />
      <Route
        path="/business-statuses"
        element={
          <ProtectedRoute>
            <BusinessStatusList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/business-statuses/create"
        element={
          <ProtectedRoute>
            <CreateBusinessStatus />
          </ProtectedRoute>
        }
      />
      <Route
        path="/business-statuses/edit/:id"
        element={
          <ProtectedRoute>
            <EditBusinessStatus />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <EditUser />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
