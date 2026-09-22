import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api, { subscribeApiEvents, getActiveRequestsCount } from '../api/axios';

const ServerStatusContext = createContext();

export function ServerStatusProvider({ children }) {
    const [status, setStatus] = useState('checking'); // 'online' | 'offline' | 'checking'
    const [latency, setLatency] = useState(null);
    const [lastChecked, setLastChecked] = useState(null);
    const [activeRequests, setActiveRequests] = useState(getActiveRequestsCount());
    const [errorMessage, setErrorMessage] = useState(null);
    const [showReconnectedAlert, setShowReconnectedAlert] = useState(false);
    const [serverInfo, setServerInfo] = useState(null);

    const prevStatusRef = useRef(status);
    const reconnectTimeoutRef = useRef(null);

    // Fungsi untuk cek koneksi ke endpoint /health
    const checkConnection = useCallback(async (isManual = false) => {
        if (isManual) {
            setStatus('checking');
        }
        const startTime = performance.now();
        try {
            const response = await api.get('/health', {
                _silent: !isManual,
                timeout: 5000,
            });
            const ping = Math.round(performance.now() - startTime);

            if (prevStatusRef.current === 'offline') {
                setShowReconnectedAlert(true);
                if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = setTimeout(() => {
                    setShowReconnectedAlert(false);
                }, 4000);
            }

            setStatus('online');
            setLatency(ping);
            setLastChecked(new Date());
            setErrorMessage(null);
            setServerInfo(response.data);
            prevStatusRef.current = 'online';
            return { ok: true, latency: ping, data: response.data };
        } catch (err) {
            const isNetErr =
                !err.response ||
                err.code === 'ERR_NETWORK' ||
                err.code === 'ECONNABORTED' ||
                (err.response && err.response.status >= 502);

            if (isNetErr) {
                setStatus('offline');
                setLatency(null);
                setErrorMessage('Gagal menghubungi backend di http://127.0.0.1:8000. Pastikan server Laravel aktif.');
                prevStatusRef.current = 'offline';
            } else {
                // Server merespon (misal status 404/500), tapi server tetap online
                const ping = Math.round(performance.now() - startTime);
                setStatus('online');
                setLatency(ping);
                setLastChecked(new Date());
                prevStatusRef.current = 'online';
            }
            return { ok: false, error: err };
        }
    }, []);

    // Berlangganan event Axios secara real-time
    useEffect(() => {
        const unsubscribe = subscribeApiEvents((event, data) => {
            setActiveRequests(data.activeCount);

            if (event === 'request_success') {
                if (prevStatusRef.current === 'offline') {
                    setShowReconnectedAlert(true);
                    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
                    reconnectTimeoutRef.current = setTimeout(() => {
                        setShowReconnectedAlert(false);
                    }, 4000);
                }
                setStatus('online');
                prevStatusRef.current = 'online';
                setErrorMessage(null);
                if (data.duration !== null) {
                    setLatency(data.duration);
                }
                setLastChecked(new Date());
            } else if (event === 'request_error') {
                if (data.isNetworkError) {
                    setStatus('offline');
                    prevStatusRef.current = 'offline';
                    setLatency(null);
                    setErrorMessage('Koneksi terputus: Server backend tidak merespons.');
                } else {
                    // Respons valid dari server HTTP (misal 400/401/422/404) membuktikan server hidup
                    setStatus('online');
                    prevStatusRef.current = 'online';
                    if (data.duration !== null) {
                        setLatency(data.duration);
                    }
                    setLastChecked(new Date());
                }
            }
        });

        return () => unsubscribe();
    }, []);

    // Initial check saat pertama kali aplikasi dibuka
    useEffect(() => {
        checkConnection();
    }, [checkConnection]);

    // Interval Heartbeat (setiap 25 detik jika online, atau 6 detik jika offline untuk auto-recovery)
    useEffect(() => {
        const intervalTime = status === 'offline' ? 6000 : 25000;
        const interval = setInterval(() => {
            checkConnection();
        }, intervalTime);

        return () => clearInterval(interval);
    }, [status, checkConnection]);

    // Deteksi event jendela / browser online & offline
    useEffect(() => {
        const handleOnline = () => checkConnection();
        const handleOffline = () => {
            setStatus('offline');
            prevStatusRef.current = 'offline';
            setLatency(null);
            setErrorMessage('Browser tidak terhubung ke jaringan internet/lokal.');
        };

        const handleFocus = () => checkConnection();

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('focus', handleFocus);
            if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        };
    }, [checkConnection]);

    const value = {
        status,
        latency,
        lastChecked,
        activeRequests,
        isLoading: activeRequests > 0,
        errorMessage,
        showReconnectedAlert,
        dismissReconnectedAlert: () => setShowReconnectedAlert(false),
        serverInfo,
        checkConnection,
        isOnline: status === 'online',
        isOffline: status === 'offline',
        isChecking: status === 'checking',
    };

    return (
        <ServerStatusContext.Provider value={value}>
            {children}
        </ServerStatusContext.Provider>
    );
}

export const useServerStatus = () => {
    const context = useContext(ServerStatusContext);
    if (!context) {
        throw new Error('useServerStatus must be used within a ServerStatusProvider');
    }
    return context;
};
