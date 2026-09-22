import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function TicketCreate() {
    const [categories, setCategories] = useState([]);
    const [idCategories, setIdCategories] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('medium');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories');
                setCategories(response.data);
                if (response.data.length > 0) {
                    setIdCategories(response.data[0].id_categories);
                }
            } catch (err) {
                console.error('Gagal mengambil kategori:', err);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/tickets', {
                id_categories: idCategories,
                title,
                description,
                priority,
            });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal membuat tiket. Periksa kembali form.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <Navbar />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
                <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-sky-400 mb-6 transition">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali ke Dashboard</span>
                </Link>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
                    <h1 className="text-2xl font-bold text-white mb-2">Ajukan Tiket Dukungan Baru</h1>
                    <p className="text-sm text-slate-400 mb-6">
                        Deskripsikan kendala Anda secara spesifik agar tim teknis kami dapat segera membantu.
                    </p>

                    {error && (
                        <div className="mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center gap-2 text-sm">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Kategori Masalah</label>
                            <select
                                value={idCategories}
                                onChange={(e) => setIdCategories(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                            >
                                {categories.map((c) => (
                                    <option key={c.id_categories} value={c.id_categories}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Tingkat Prioritas</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                            >
                                <option value="low">Low (Pertanyaan umum / Tidak mendesak)</option>
                                <option value="medium">Medium (Kendala operasional standar)</option>
                                <option value="high">High (Fitur penting tidak berfungsi)</option>
                                <option value="urgent">Urgent (Sistem lumpuh total)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Judul Kendala</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Contoh: Eror saat download faktur tagihan"
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Deskripsi Lengkap</label>
                            <textarea
                                required
                                rows={5}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Jelaskan langkah-langkah yang menyebabkan eror atau informasi relevan lainnya..."
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-none"
                            ></textarea>
                        </div>

                        <div className="pt-2 flex justify-end gap-3">
                            <Link
                                to="/"
                                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl transition"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50 cursor-pointer"
                            >
                                {loading ? 'Mengirim Tiket...' : 'Kirim Tiket'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}