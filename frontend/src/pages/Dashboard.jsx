import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { StatusBadge, PriorityBadge } from '../components/TicketBadge';
import { Clock, CheckCircle2, AlertCircle, MessageSquare, Filter } from 'lucide-react';

export default function Dashboard() {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const params = {};
            if (statusFilter !== 'all') params.status = statusFilter;
            if (priorityFilter !== 'all') params.priority = priorityFilter;

            const response = await api.get('/tickets', { params });
            setTickets(response.data.data || []);
        } catch (error) {
            console.error('Gagal mengambil daftar tiket:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [statusFilter, priorityFilter]);

    // Hitung statistik tiket
    const stats = {
        total: tickets.length,
        open: tickets.filter((t) => t.status === 'open').length,
        inProgress: tickets.filter((t) => t.status === 'in_progress').length,
        resolved: tickets.filter((t) => t.status === 'resolved').length,
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Welcome */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold">Daftar Tiket Dukungan</h1>
                    <p className="text-sm text-slate-400 mt-1">
                        {user?.role === 'customer'
                            ? 'Pantau status kendala dan pertanyaan yang Anda ajukan.'
                            : 'Kelola dan berikan solusi pada tiket kendala pengguna.'}
                    </p>
                </div>

                {/* Kartu Statistik */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-medium uppercase tracking-wider">Total Tiket</span>
                            <MessageSquare className="w-4 h-4 text-sky-400" />
                        </div>
                        <p className="text-2xl sm:text-3xl font-bold mt-2 text-white">{stats.total}</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-medium uppercase tracking-wider">Open</span>
                            <AlertCircle className="w-4 h-4 text-sky-400" />
                        </div>
                        <p className="text-2xl sm:text-3xl font-bold mt-2 text-sky-400">{stats.open}</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-medium uppercase tracking-wider">In Progress</span>
                            <Clock className="w-4 h-4 text-amber-400" />
                        </div>
                        <p className="text-2xl sm:text-3xl font-bold mt-2 text-amber-400">{stats.inProgress}</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-medium uppercase tracking-wider">Resolved</span>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </div>
                        <p className="text-2xl sm:text-3xl font-bold mt-2 text-emerald-400">{stats.resolved}</p>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
                        <Filter className="w-4 h-4 text-sky-400" />
                        <span>Filter:</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-sky-500"
                        >
                            <option value="all">Semua Status</option>
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                        </select>

                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-sky-500"
                        >
                            <option value="all">Semua Prioritas</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>
                </div>

                {/* Tabel Tiket */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                    {loading ? (
                        <div className="p-12 text-center text-slate-500">Memuat data tiket...</div>
                    ) : tickets.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-slate-400">Tidak ada tiket yang ditemukan.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-300">
                                <thead className="bg-slate-800/60 text-xs uppercase text-slate-400 border-b border-slate-800 font-semibold tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Nomor Tiket & Judul</th>
                                        <th className="px-6 py-4">Kategori</th>
                                        <th className="px-6 py-4">Prioritas</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Pelapor</th>
                                        <th className="px-6 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {tickets.map((t) => (
                                        <tr key={t.id_tickets} className="hover:bg-slate-800/40 transition">
                                            <td className="px-6 py-4">
                                                <div className="font-mono text-xs text-sky-400 font-semibold">
                                                    {t.ticket_number}
                                                </div>
                                                <div className="font-medium text-white text-sm mt-0.5 max-w-xs truncate">
                                                    {t.title}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-slate-300">
                                                {t.category?.name || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <PriorityBadge priority={t.priority} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={t.status} />
                                            </td>
                                            <td className="px-6 py-4 text-xs text-slate-400">
                                                {t.user?.name || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    to={`/tickets/${t.id_tickets}`}
                                                    className="inline-block bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 transition"
                                                >
                                                    Lihat Detail →
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}