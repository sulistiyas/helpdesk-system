export function StatusBadge({ status }) {
    const config = {
        open: { label: 'Open', bg: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
        in_progress: { label: 'In Progress', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
        resolved: { label: 'Resolved', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
        closed: { label: 'Closed', bg: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
    };

    const item = config[status] || config.open;

    return (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${item.bg}`}>
            {item.label}
        </span>
    );
}

export function PriorityBadge({ priority }) {
    const config = {
        low: { label: 'Low', color: 'text-slate-400' },
        medium: { label: 'Medium', color: 'text-sky-400' },
        high: { label: 'High', color: 'text-amber-400' },
        urgent: { label: 'Urgent', color: 'text-rose-400 font-bold' },
    };

    const item = config[priority] || config.medium;

    return (
        <span className={`text-xs uppercase tracking-wider ${item.color}`}>
            ● {item.label}
        </span>
    );
}