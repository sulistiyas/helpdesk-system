<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TicketReply extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_ticket_replies';     
    protected $table = 'ticket_replies';

    protected $fillable = [
        'id_tickets',
        'user_id',
        'message',
        'attachment_path',
    ];

    public function ticket()
    {
        return $this->belongsTo(Ticket::class, 'id_tickets', 'id_tickets');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}