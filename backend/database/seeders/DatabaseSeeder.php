<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Ticket;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Buat User Akun Default
        $admin = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@helpdesk.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);
        $agent = User::create([
            'name' => 'Support Agent',
            'email' => 'agent@helpdesk.com',
            'password' => Hash::make('password'),
            'role' => 'agent',
        ]);
        $customer = User::create([
            'name' => 'Budi Customer',
            'email' => 'customer@helpdesk.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
        ]);
        // 2. Buat Kategori Tiket
        $catTech = Category::create([
            'name' => 'Technical Support',
            'slug' => 'technical-support',
            'description' => 'Kendala teknis, bug aplikasi, dan sistem eror.',
        ]);
        $catBilling = Category::create([
            'name' => 'Billing & Payment',
            'slug' => 'billing-payment',
            'description' => 'Pertanyaan seputar tagihan, faktur, dan pembayaran.',
        ]);
        $catGeneral = Category::create([
            'name' => 'General Inquiry',
            'slug' => 'general-inquiry',
            'description' => 'Pertanyaan umum seputar layanan.',
        ]);
        // 3. Buat Contoh Tiket Dummy
        Ticket::create([
            'ticket_number' => 'TCK-' . strtoupper(uniqid()),
            'user_id' => $customer->id,
            'assigned_to' => $agent->id,
            'id_categories' => $catTech->id_categories,
            'title' => 'Tidak bisa mengakses halaman laporan keuangan',
            'description' => 'Setiap kali saya klik tombol download laporan PDF, muncul halaman blank putih.',
            'priority' => 'high',
            'status' => 'open',
        ]);
    }
}
