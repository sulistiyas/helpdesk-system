<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_tickets';
    protected $table = 'tickets';
    protected $fillable = [
        'ticket_number',
        'user_id',
        'assigned_to',
        'id_categories',
        'title',
        'description',
        'priority',
        'status',
    ];

    // Relasi ke Customer pembuat tiket
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relasi ke Staf/Agent penanggung jawab
    public function assignedAgent()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    // Relasi ke Kategori
    public function category()
    {
        return $this->belongsTo(Category::class, 'id_categories', 'id_categories');
    }

    // Relasi ke Balasan/Komentar tiket
    public function replies()
    {
        return $this->hasMany(TicketReply::class, 'id_tickets', 'id_tickets');
    }
}