<?php

namespace Database\Seeders;

use App\Models\Client;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create some sample clients
        Client::create([
            'name' => 'Ahmed Al-Rashid',
            'phone' => '+966501234567',
            'address' => 'King Fahd Road, Al-Olaya District',
            'client_vat_number' => '310123456789103',
            'email' => 'ahmed.rashid@example.com',
            'company_name' => 'Al-Rashid Trading Co.',
            'contact_person' => 'Ahmed Al-Rashid',
            'city' => 'Riyadh',
            'country' => 'Saudi Arabia',
            'postal_code' => '11564',
            'status' => 'active',
            'notes' => 'VIP Client - Priority service',
        ]);

        Client::create([
            'name' => 'Fatima Al-Zahra',
            'phone' => '+966509876543',
            'address' => 'Prince Sultan Road, Al-Khobar',
            'client_vat_number' => '310987654321103',
            'email' => 'fatima.zahra@example.com',
            'company_name' => 'Zahra Enterprises',
            'contact_person' => 'Fatima Al-Zahra',
            'city' => 'Al-Khobar',
            'country' => 'Saudi Arabia',
            'postal_code' => '31952',
            'status' => 'active',
        ]);

        Client::create([
            'name' => 'Mohammed Al-Qasemi',
            'phone' => '+966555123456',
            'address' => 'Corniche Road, Jeddah',
            'client_vat_number' => '310456789123103',
            'email' => 'mohammed.qasemi@example.com',
            'company_name' => 'Qasemi Industries',
            'contact_person' => 'Mohammed Al-Qasemi',
            'city' => 'Jeddah',
            'country' => 'Saudi Arabia',
            'postal_code' => '21589',
            'status' => 'active',
        ]);

        // Create additional random clients
        Client::factory(20)->create();
    }
}
