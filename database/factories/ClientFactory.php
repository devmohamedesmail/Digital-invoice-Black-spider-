<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Client>
 */
class ClientFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'phone' => $this->faker->phoneNumber(),
            'address' => $this->faker->streetAddress(),
            'client_vat_number' => $this->faker->numerify('3#########'),
            'email' => $this->faker->unique()->safeEmail(),
            'company_name' => $this->faker->company(),
            'contact_person' => $this->faker->name(),
            'city' => $this->faker->city(),
            'country' => $this->faker->randomElement(['Saudi Arabia', 'UAE', 'Qatar', 'Kuwait']),
            'postal_code' => $this->faker->postcode(),
            'status' => $this->faker->randomElement(['active', 'inactive']),
            'notes' => $this->faker->optional()->sentence(),
        ];
    }
}
