<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    // 1. Ambil daftar tiket (dengan filter role & status)
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Ticket::with(['category', 'user', 'assignedAgent']);

        // Jika customer biasa, hanya tampilkan tiket miliknya
        if ($user->role === 'customer') {
            $query->where('user_id', $user->id);
        }

        // Filter opsional berdasarkan status jika dikirim dari frontend
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter opsional berdasarkan prioritas
        if ($request->has('priority') && $request->priority !== 'all') {
            $query->where('priority', $request->priority);
        }

        $tickets = $query->latest('id_tickets')->paginate(10);

        return response()->json($tickets);
    }

    // 2. Buat tiket baru (Customer)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_categories' => 'required|exists:categories,id_categories',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:low,medium,high,urgent',
        ]);

        $ticket = Ticket::create([
            'ticket_number' => 'TCK-' . strtoupper(uniqid()),
            'user_id' => $request->user()->id,
            'id_categories' => $validated['id_categories'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'priority' => $validated['priority'],
            'status' => 'open',
        ]);

        return response()->json([
            'message' => 'Tiket berhasil dibuat',
            'ticket' => $ticket->load('category'),
        ], 201);
    }

    // 3. Detail tiket beserta riwayat komentar balasan
    public function show(Request $request, $id)
    {
        $ticket = Ticket::with([
            'category',
            'user',
            'assignedAgent',
            'replies.user'
        ])->where('id_tickets', $id)->firstOrFail();

        // Customer hanya boleh melihat tiketnya sendiri
        if ($request->user()->role === 'customer' && $ticket->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }

        return response()->json($ticket);
    }

    // 4. Update status atau agent (Hanya Agent/Admin)
    public function update(Request $request, $id)
    {
        $user = $request->user();
        if ($user->role === 'customer') {
            return response()->json(['message' => 'Hanya staf yang dapat mengubah status tiket.'], 403);
        }

        $ticket = Ticket::where('id_tickets', $id)->firstOrFail();

        $validated = $request->validate([
            'status' => 'sometimes|in:open,in_progress,resolved,closed',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        $ticket->update($validated);

        return response()->json([
            'message' => 'Tiket berhasil diperbarui',
            'ticket' => $ticket->fresh(['category', 'user', 'assignedAgent']),
        ]);
    }
}