import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { StatusBadge, PriorityBadge } from '../components/TicketBadge';
import { ArrowLeft, Send, User, Clock, CheckCircle } from 'lucide-react';

export default function TicketDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState('');
    const [submittingReply, setSubmittingReply] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const fetchTicket = async () => {
        try {
            const response = await api.get(`/tickets/${id}`);
            setTicket(response.data);
        } catch (error) {
            console.error('Gagal mengambil detail tiket:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTicket();
    }, [id]);

    // Kirim balasan komentar
    const handleSendReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        setSubmittingReply(true);
        try {
            const response = await api.post(`/tickets/${id}/replies`, {
                message: replyText,
            });
            // Update daftar balasan di state lokal
            setTicket((prev) => ({
                ...prev,
                replies: [...prev.replies, response.data.reply],
            }));
            setReplyText('');
        } catch (error) {
            alert('Gagal mengirim balasan.');
        } finally {
            setSubmittingReply(false);
        }
    };

    // Ubah status tiket (Khusus Agent & Admin)
    const handleUpdateStatus = async (newStatus) => {
        setUpdatingStatus(true);
        try {
            await api.put(`/tickets/${id}`, { status: newStatus });
            setTicket((prev) => ({ ...prev, status: newStatus }));
        } catch (error) {
            alert('Gagal memperbarui status.');
        } finally {
            setUpdatingStatus(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center">
                Memuat detail tiket...
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-400 flex flex-col items-center justify-center gap-4">
                <p>Tiket tidak ditemukan.</p>
                <Link to="/" className="text-sky-400 hover:underline">Kembali ke Dashboard</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <Navbar />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
                <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-sky-400 mb-6 transition">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali ke Daftar Tiket</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Kolom Kiri: Detail Tiket & Riwayat Balasan */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Kartu Masalah Utama */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                            <div className="flex items-center justify-between gap-4 mb-4">
                                <span className="font-mono text-xs font-semibold text-sky-400">
                                    {ticket.ticket_number}
                                </span>
                                <StatusBadge status={ticket.status} />
                            </div>

                            <h1 className="text-xl sm:text-2xl font-bold text-white mb-3">{ticket.title}</h1>

                            <div className="bg-slate-800/60 rounded-xl p-4 text-sm text-slate-300 leading-relaxed border border-slate-800">
                                {ticket.description}
                            </div>

                            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Diajukan pada {new Date(ticket.created_at).toLocaleString('id-ID')}</span>
                            </div>
                        </div>

                        {/* Thread Balasan / Komentar */}
                        <div className="space-y-4">
                            <h3 className="text-base font-semibold text-white">Riwayat Tanggapan ({ticket.replies?.length || 0})</h3>

                            {ticket.replies?.length === 0 ? (
                                <p className="text-sm text-slate-500 italic">Belum ada balasan pada tiket ini.</p>
                            ) : (
                                ticket.replies.map((reply) => {
                                    const isStaff = reply.user?.role === 'admin' || reply.user?.role === 'agent';
                                    return (
                                        <div
                                            key={reply.id_ticket_replies}
                                            className={`p-5 rounded-2xl border ${
                                                isStaff
                                                    ? 'bg-sky-950/20 border-sky-500/30'
                                                    : 'bg-slate-900 border-slate-800'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-sm text-slate-200">
                                                        {reply.user?.name}
                                                    </span>
                                                    <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded ${
                                                        isStaff ? 'bg-sky-500/20 text-sky-300' : 'bg-slate-800 text-slate-400'
                                                    }`}>
                                                        {reply.user?.role}
                                                    </span>
                                                </div>
                                                <span className="text-[11px] text-slate-500">
                                                    {new Date(reply.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                                                {reply.message}
                                            </p>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Form Kirim Balasan */}
                        <form onSubmit={handleSendReply} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                Tambahkan Balasan
                            </label>
                            <textarea
                                rows={3}
                                required
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Tulis tanggapan atau pembaruan di sini..."
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-none"
                            ></textarea>
                            <div className="mt-3 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={submittingReply}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold rounded-xl transition disabled:opacity-50 cursor-pointer"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                    <span>{submittingReply ? 'Mengirim...' : 'Kirim Balasan'}</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Kolom Kanan: Info Metadata & Kontrol Staf */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                                Informasi Tiket
                            </h3>

                            <div>
                                <span className="text-xs text-slate-500 block">Pelapor</span>
                                <p className="text-sm font-medium text-slate-200 mt-0.5">{ticket.user?.name}</p>
                                <p className="text-xs text-slate-400">{ticket.user?.email}</p>
                            </div>

                            <div>
                                <span className="text-xs text-slate-500 block">Kategori</span>
                                <p className="text-sm font-medium text-slate-200 mt-0.5">{ticket.category?.name || '-'}</p>
                            </div>

                            <div>
                                <span className="text-xs text-slate-500 block">Prioritas</span>
                                <div className="mt-1">
                                    <PriorityBadge priority={ticket.priority} />
                                </div>
                            </div>
                        </div>

                        {/* Kontrol Khusus Agent & Admin untuk Mengubah Status */}
                        {(user?.role === 'admin' || user?.role === 'agent') && (
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-sky-400 mb-3 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Kontrol Staf</span>
                                </h3>
                                <p className="text-xs text-slate-400 mb-4">Ubah status penyelesaian kendala tiket ini:</p>

                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        disabled={updatingStatus || ticket.status === 'in_progress'}
                                        onClick={() => handleUpdateStatus('in_progress')}
                                        className="px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold rounded-xl transition disabled:opacity-40 cursor-pointer"
                                    >
                                        In Progress
                                    </button>
                                    <button
                                        disabled={updatingStatus || ticket.status === 'resolved'}
                                        onClick={() => handleUpdateStatus('resolved')}
                                        className="px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold rounded-xl transition disabled:opacity-40 cursor-pointer"
                                    >
                                        Resolved
                                    </button>
                                    <button
                                        disabled={updatingStatus || ticket.status === 'closed'}
                                        onClick={() => handleUpdateStatus('closed')}
                                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 text-xs font-semibold rounded-xl transition disabled:opacity-40 cursor-pointer col-span-2"
                                    >
                                        Tutup Tiket (Closed)
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}