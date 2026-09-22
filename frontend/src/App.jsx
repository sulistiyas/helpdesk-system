import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ServerStatusProvider } from './context/ServerStatusContext';
import ServerStatusIndicator from './components/ServerStatusIndicator';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TicketCreate from './pages/TicketCreate';
import TicketDetail from './pages/TicketDetail';

export default function App() {
    return (
        <ServerStatusProvider>
            <AuthProvider>
                <ServerStatusIndicator />
                <BrowserRouter>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        {/* Protected Routes (Harus Login) */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/tickets/new" element={<TicketCreate />} />
                            <Route path="/tickets/:id" element={<TicketDetail />} />
                        </Route>
                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ServerStatusProvider>
    );
}