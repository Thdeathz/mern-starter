import { Routes, Route, Outlet } from 'react-router-dom'
import { Public } from './components'
import { ROLES } from './config/roles'
import PersistLogin from './features/auth/PersistLogin'
import RequireAuth from './features/auth/RequireAuth'
import Login from './features/auth/Login'
import Signup from './features/auth/Signup'
import Welcome from './features/auth/Welcome'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Outlet />}>
        {/* PUBLIC ROUTES */}
        <Route index element={<Public />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* PRIVATE ROUTES */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
            <Route path="/home" element={<Welcome />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App
