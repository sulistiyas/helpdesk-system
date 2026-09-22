import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    timeout: 10000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

let activeRequestsCount = 0;
const listeners = new Set();

export const subscribeApiEvents = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

const notifyApiEvent = (event, data) => {
    listeners.forEach((listener) => {
        try {
            listener(event, data);
        } catch (err) {
            console.error('Error in API event listener:', err);
        }
    });
};

export const getActiveRequestsCount = () => activeRequestsCount;

// Interceptor: Otomatis sisipkan Bearer Token & lacak durasi/jumlah request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    config.metadata = { startTime: performance.now() };

    // Abaikan health check dari penghitungan loading bar utama agar tidak flickering
    if (!config._silent) {
        activeRequestsCount++;
    }

    notifyApiEvent('request_start', {
        activeCount: activeRequestsCount,
        silent: !!config._silent,
        url: config.url,
    });

    return config;
});

// Interceptor: Jika respon diterima (sukses atau error), update status koneksi dan kurangi request
api.interceptors.response.use(
    (response) => {
        const duration = response.config?.metadata?.startTime
            ? Math.round(performance.now() - response.config.metadata.startTime)
            : null;

        if (!response.config?._silent) {
            activeRequestsCount = Math.max(0, activeRequestsCount - 1);
        }

        notifyApiEvent('request_success', {
            activeCount: activeRequestsCount,
            duration,
            status: response.status,
            silent: !!response.config?._silent,
            url: response.config?.url,
        });

        return response;
    },
    (error) => {
        const config = error.config || {};
        const duration = config.metadata?.startTime
            ? Math.round(performance.now() - config.metadata.startTime)
            : null;

        if (!config._silent) {
            activeRequestsCount = Math.max(0, activeRequestsCount - 1);
        }

        // Tentukan apakah error disebabkan oleh koneksi jaringan / server mati
        const isNetworkError =
            !error.response ||
            error.code === 'ERR_NETWORK' ||
            error.code === 'ECONNABORTED' ||
            (error.response && error.response.status >= 502 && error.response.status <= 504);

        notifyApiEvent('request_error', {
            activeCount: activeRequestsCount,
            duration,
            isNetworkError,
            status: error.response?.status,
            message: error.message,
            silent: !!config._silent,
            url: config.url,
        });

        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;