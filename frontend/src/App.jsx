import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';

// Halaman sementara untuk menguji login berhasil
function HomeDummy() {
    const { user, logout } = useAuth();
    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl max-w-md w-full text-center">
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/20">
                    Login Sukses! 🎉
                </span>
                <h1 className="text-2xl font-bold mt-4">Halo, {user?.name}</h1>
                <p className="text-slate-400 text-sm mt-1">Email: {user?.email}</p>
                <div className="mt-2 inline-block px-3 py-1 bg-sky-500/10 text-sky-400 rounded-lg text-xs font-mono uppercase tracking-wider">
                    Role: {user?.role}
                </div>

                <div className="mt-6">
                    <button
                        onClick={logout}
                        className="w-full bg-rose-600/80 hover:bg-rose-500 text-white text-sm font-medium py-2 rounded-xl transition cursor-pointer"
                    >
                        Keluar / Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<HomeDummy />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}