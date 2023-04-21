import { Routes, Route, Outlet } from 'react-router-dom'

import { ROLES } from './config/roles'
import PersistLogin from './features/auth/components/PersistLogin'
import RequireAuth from './features/auth/components/RequireAuth'
import Login from './features/auth/Login'
import Signup from './features/auth/Signup'
import ForgotPassword from './features/auth/ForgotPassword'
import Welcome from './features/users/Welcome'
import ResetPassword from './features/auth/ResetPassword'
import VerifyOTP from './features/auth/VerifyOTP'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Outlet />}>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyOTP />} />

        {/* PRIVATE ROUTES */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
            <Route path="/" element={<Welcome />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App
