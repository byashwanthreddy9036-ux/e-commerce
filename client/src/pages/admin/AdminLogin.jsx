import { Navigate } from 'react-router-dom'

// Admin and user login are now handled by the same /login page.
const AdminLogin = () => <Navigate to='/login' replace />

export default AdminLogin
