import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
    const { token, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-400">
                Memuat data sesi...
            </div>
        );
    }

    // Jika belum login, lempar ke halaman login
    return token ? <Outlet /> : <Navigate to="/login" replace />;
}