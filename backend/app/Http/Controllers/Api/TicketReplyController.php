<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\TicketReply;
use Illuminate\Http\Request;

class TicketReplyController extends Controller
{
    public function store(Request $request, $id_tickets)
    {
        $ticket = Ticket::where('id_tickets', $id_tickets)->firstOrFail();

        // Validasi: customer hanya bisa membalas tiketnya sendiri
        if ($request->user()->role === 'customer' && $ticket->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }

        $validated = $request->validate([
            'message' => 'required|string',
        ]);

        $reply = TicketReply::create([
            'id_tickets' => $ticket->id_tickets,
            'user_id' => $request->user()->id,
            'message' => $validated['message'],
        ]);

        return response()->json([
            'message' => 'Balasan berhasil dikirim',
            'reply' => $reply->load('user'),
        ], 201);
    }
}