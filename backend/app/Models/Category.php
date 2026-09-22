<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_categories'; 
    protected $table = 'categories';
    
    protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    public function tickets()
    {
        return $this->hasMany(Ticket::class, 'id_categories', 'id_categories');
    }
}