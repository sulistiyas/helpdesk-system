import { useState, useEffect } from 'react';
import { useServerStatus } from '../context/ServerStatusContext';
import {
    Activity,
    Wifi,
    WifiOff,
    RefreshCw,
    CheckCircle2,
    AlertTriangle,
    Server,
    X,
    Clock,
    Zap,
    Loader2
} from 'lucide-react';

export default function ServerStatusIndicator() {
    const {
        status,
        latency,
        lastChecked,
        activeRequests,
        isLoading,
        errorMessage,
        showReconnectedAlert,
        dismissReconnectedAlert,
        checkConnection,
        isOnline,
        isOffline,
        isChecking,
    } = useServerStatus();

    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isProgressBarVisible, setIsProgressBarVisible] = useState(false);

    // Animasi Progress Bar di bagian paling atas layar
    useEffect(() => {
        let timer;
        if (isLoading) {
            setIsProgressBarVisible(true);
            setProgress((prev) => (prev === 0 ? 25 : prev));

            timer = setInterval(() => {
                setProgress((old) => {
                    if (old >= 85) return old;
                    const diff = Math.random() * 15;
                    return Math.min(old + diff, 88);
                });
            }, 250);
        } else {
            // Selesai: langsung lompat ke 100% lalu sembunyikan
            if (isProgressBarVisible) {
                setProgress(100);
                const hideTimer = setTimeout(() => {
                    setIsProgressBarVisible(false);
                    setProgress(0);
                }, 350);
                return () => clearTimeout(hideTimer);
            }
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isLoading, isProgressBarVisible]);

    const handleManualPing = async (e) => {
        e?.stopPropagation();
        await checkConnection(true);
    };

    return (
        <>
            {/* 1. TOP PROGRESS BAR (Garis progres loading global di paling atas) */}
            {isProgressBarVisible && (
                <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none h-[3.5px] bg-slate-800/40">
                    <div
                        className="h-full bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400 shadow-[0_0_12px_rgba(56,189,248,0.8)] transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}

            {/* 2. NOTIFIKASI SUKSES REKONEKSI (Floating Toast Hijau) */}
            {showReconnectedAlert && (
                <aside aria-label="Notifikasi Rekoneksi" className="fixed top-4 right-4 z-[9998] animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="bg-emerald-950/90 border border-emerald-500/30 text-emerald-100 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3">
                        <div className="bg-emerald-500/20 p-2 rounded-xl text-emerald-400">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-white">Terhubung Kembali ke Server Backend!</p>
                            <p className="text-[11px] text-emerald-300/80">
                                Koneksi API pulih {latency ? `(${latency}ms)` : ''}
                            </p>
                        </div>
                        <button
                            onClick={dismissReconnectedAlert}
                            className="p-1 hover:bg-emerald-800/40 rounded-lg text-emerald-400 transition"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </aside>
            )}

            {/* 3. ALERT BANNER SAAT SERVER OFFLINE (Banner peringatan terputus) */}
            {isOffline && (
                <aside aria-label="Peringatan Koneksi Server" className="fixed top-0 left-0 right-0 z-[9997] bg-rose-950/95 border-b border-rose-500/30 text-rose-100 px-4 py-2.5 backdrop-blur-md shadow-lg animate-in slide-in-from-top duration-300">
                    <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5">
                            <div className="bg-rose-500/20 p-1.5 rounded-lg text-rose-400">
                                <AlertTriangle className="w-4 h-4" />
                            </div>
                            <div>
                                <span className="font-semibold text-rose-200">Koneksi Backend Terputus: </span>
                                <span className="text-rose-300/90">
                                    {errorMessage || 'Server Laravel (http://127.0.0.1:8000) tidak dapat dijangkau.'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleManualPing}
                                disabled={isChecking}
                                className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-medium px-3 py-1.5 rounded-lg transition disabled:opacity-50 cursor-pointer shadow-sm"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
                                <span>{isChecking ? 'Mencoba Menghubungkan...' : 'Coba Hubungkan Ulang'}</span>
                            </button>
                        </div>
                    </div>
                </aside>
            )}

            {/* 4. FLOATING STATUS PILL (Pojok Kanan Bawah di SEMUA Halaman) */}
            <aside aria-label="Status Server Backend" className="fixed bottom-4 right-4 z-[9990] flex flex-col items-end">
                {/* Popover Detail Hubungan Server */}
                {isDetailOpen && (
                    <div className="mb-2 w-80 bg-slate-900/95 border border-slate-800 text-slate-200 rounded-2xl shadow-2xl backdrop-blur-xl p-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                            <div className="flex items-center gap-2">
                                <div className="bg-sky-500/20 p-1.5 rounded-lg text-sky-400">
                                    <Server className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-xs text-white">Status Backend Server</span>
                            </div>
                            <button
                                onClick={() => setIsDetailOpen(false)}
                                className="p-1 text-slate-400 hover:text-white rounded-lg transition hover:bg-slate-800"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <div className="mt-3 space-y-2.5 text-xs">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400">URL Endpoint</span>
                                <span className="font-mono text-[11px] text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                                    127.0.0.1:8000/api
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-slate-400">Status Hubungan</span>
                                {isOnline && (
                                    <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        Terhubung (Online)
                                    </span>
                                )}
                                {isOffline && (
                                    <span className="flex items-center gap-1.5 text-rose-400 font-medium">
                                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                                        Terputus (Offline)
                                    </span>
                                )}
                                {isChecking && (
                                    <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        Memeriksa...
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-slate-400">Respon / Latensi</span>
                                <span className="font-mono text-xs text-sky-400 font-semibold">
                                    {latency !== null ? `${latency} ms` : '-'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-slate-400">Proses Request Aktif</span>
                                <span className="font-mono text-xs">
                                    {activeRequests > 0 ? (
                                        <span className="text-amber-400 font-medium">
                                            {activeRequests} request berjalan...
                                        </span>
                                    ) : (
                                        <span className="text-slate-400">Idle (0)</span>
                                    )}
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-slate-500" />
                                    Terakhir dicek
                                </span>
                                <span>
                                    {lastChecked ? lastChecked.toLocaleTimeString() : 'Belum pernah'}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 pt-2">
                            <button
                                onClick={handleManualPing}
                                disabled={isChecking}
                                className="w-full flex items-center justify-center gap-2 bg-sky-500/10 hover:bg-sky-500/20 active:scale-98 text-sky-400 border border-sky-500/30 text-xs font-semibold py-2 rounded-xl transition disabled:opacity-50 cursor-pointer"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
                                <span>{isChecking ? 'Memeriksa...' : 'Cek Status Sekarang'}</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Pill Button Utama */}
                <button
                    onClick={() => setIsDetailOpen(!isDetailOpen)}
                    title="Klik untuk melihat rincian koneksi server backend"
                    className={`group flex items-center gap-2.5 px-3 py-1.5 rounded-full text-xs font-medium border shadow-lg backdrop-blur-md transition-all duration-200 cursor-pointer select-none ${
                        isOffline
                            ? 'bg-rose-950/80 border-rose-500/40 text-rose-300 hover:bg-rose-900/90'
                            : isChecking
                            ? 'bg-slate-900/90 border-amber-500/30 text-amber-300 hover:bg-slate-850'
                            : isLoading
                            ? 'bg-slate-900/90 border-sky-500/40 text-sky-300 hover:bg-slate-800'
                            : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/90'
                    }`}
                >
                    {/* Status Dot / Icon */}
                    {isOffline ? (
                        <div className="relative flex items-center justify-center">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping absolute opacity-75" />
                            <span className="w-2 h-2 rounded-full bg-rose-500" />
                        </div>
                    ) : isChecking ? (
                        <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                    ) : isLoading ? (
                        <div className="relative flex items-center justify-center">
                            <Loader2 className="w-3.5 h-3.5 text-sky-400 animate-spin" />
                        </div>
                    ) : (
                        <div className="relative flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/50 animate-pulse absolute" />
                        </div>
                    )}

                    {/* Status Text */}
                    <span className="font-medium tracking-tight">
                        {isOffline
                            ? 'Backend Terputus'
                            : isChecking
                            ? 'Mengecek...'
                            : isLoading
                            ? `Memuat (${activeRequests})`
                            : 'Backend Online'}
                    </span>

                    {/* Ping Latency Badge */}
                    {isOnline && latency !== null && !isLoading && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-800 text-sky-400 border border-slate-700/50">
                            {latency}ms
                        </span>
                    )}

                    {/* Icon Panah Detail */}
                    <Activity className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 transition" />
                </button>
            </aside>
        </>
    );
}
