import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LifeBuoy, Lock, Mail, AlertCircle } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login gagal. Periksa kembali email dan password.');
        } finally {
            setIsLoading(false);
        }
    };

    // Tombol Demo Instan untuk Portofolio
    const fillDemo = (demoEmail) => {
        setEmail(demoEmail);
        setPassword('password');
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="flex justify-center">
                    <div className="bg-sky-500/10 p-3 rounded-2xl border border-sky-500/20 text-sky-400">
                        <LifeBuoy className="w-10 h-10" />
                    </div>
                </div>
                <h2 className="mt-4 text-3xl font-extrabold tracking-tight">Helpdesk System</h2>
                <p className="mt-1 text-sm text-slate-400">Masuk ke akun Anda untuk mengelola tiket</p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-slate-900 py-8 px-6 shadow-2xl rounded-2xl border border-slate-800 sm:px-10">
                    {error && (
                        <div className="mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl flex items-center gap-2 text-sm">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                            <div className="relative">
                                <Mail className="w-5 h-5 text-slate-500 absolute left-3 top-3" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 text-sm"
                                    placeholder="nama@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                            <div className="relative">
                                <Lock className="w-5 h-5 text-slate-500 absolute left-3 top-3" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-2 bg-sky-500 hover:bg-sky-400 text-white font-semibold py-2.5 rounded-xl transition duration-200 text-sm disabled:opacity-50 cursor-pointer"
                        >
                            {isLoading ? 'Memproses...' : 'Masuk ke Sistem'}
                        </button>
                    </form>

                    {/* Tombol Akun Demo untuk Portofolio */}
                    <div className="mt-6 pt-6 border-t border-slate-800">
                        <p className="text-xs text-slate-400 font-medium mb-3 text-center">Login Cepat dengan Akun Demo:</p>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => fillDemo('admin@helpdesk.com')}
                                className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs rounded-lg text-slate-300 transition"
                            >
                                Admin
                            </button>
                            <button
                                type="button"
                                onClick={() => fillDemo('agent@helpdesk.com')}
                                className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs rounded-lg text-slate-300 transition"
                            >
                                Agent
                            </button>
                            <button
                                type="button"
                                onClick={() => fillDemo('customer@helpdesk.com')}
                                className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs rounded-lg text-slate-300 transition"
                            >
                                Customer
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-slate-400">
                            Belum punya akun?{' '}
                            <Link to="/register" className="text-sky-400 hover:underline">
                                Daftar sebagai Customer
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}