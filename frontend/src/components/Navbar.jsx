import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useServerStatus } from '../context/ServerStatusContext';
import { LifeBuoy, LogOut, PlusCircle, User, Loader2 } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { isOnline, isOffline, isLoading, latency } = useServerStatus();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/" className="flex items-center gap-2.5 text-white font-bold text-lg">
                        <div className="bg-sky-500/20 p-2 rounded-xl text-sky-400 border border-sky-500/30">
                            <LifeBuoy className="w-5 h-5" />
                        </div>
                        <span>Helpdesk Desk</span>
                    </Link>

                    {/* Inline Server Connection Badge */}
                    <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-950/70 border border-slate-800/80 text-[11px]">
                        {isOffline ? (
                            <>
                                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                <span className="text-rose-400 font-medium">Server Offline</span>
                            </>
                        ) : isLoading ? (
                            <>
                                <Loader2 className="w-3 h-3 text-sky-400 animate-spin" />
                                <span className="text-sky-300 font-medium">Sinkronisasi...</span>
                            </>
                        ) : (
                            <>
                                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                <span className="text-slate-300">Server API</span>
                                {latency !== null && (
                                    <span className="font-mono text-emerald-400/90 font-semibold">{latency}ms</span>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Tombol Buat Tiket */}
                    <Link
                        to="/tickets/new"
                        className="flex items-center gap-1.5 bg-sky-500 hover:bg-sky-400 text-white text-xs sm:text-sm font-medium px-3.5 py-2 rounded-xl transition duration-150"
                    >
                        <PlusCircle className="w-4 h-4" />
                        <span>Buat Tiket</span>
                    </Link>

                    {/* Info User & Role */}
                    <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-800 text-sm">
                        <div className="bg-slate-800 p-2 rounded-full text-slate-400">
                            <User className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                            <p className="text-xs font-semibold text-slate-200">{user?.name}</p>
                            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-slate-800 text-sky-400 rounded">
                                {user?.role}
                            </span>
                        </div>
                    </div>

                    {/* Tombol Logout */}
                    <button
                        onClick={handleLogout}
                        title="Keluar"
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition cursor-pointer"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    );
}