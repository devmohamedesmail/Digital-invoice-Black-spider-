<?php

namespace App\Providers;
use App\Models\Note;
use Inertia\Inertia;
use App\Models\Invoice;
use App\Models\Service;
use App\Models\Setting;
use App\Models\InvoiceType;
use Illuminate\Support\Carbon;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share('app_settings', function () {
            return Setting::first();
        });

        Inertia::share('notes', function () {
            return Note::first();
        });

        Inertia::share('services', function () {
            return Service::all();
        });

        Inertia::share('invoices', function () {
            return Invoice::orderBy('created_at', 'desc')->get();
        });

        Inertia::share('today_invoices', function () {
            return Invoice::whereDate('created_at', Carbon::today())->get();
        });

        Inertia::share('invoicetypes', function () {
            return InvoiceType::all();
        });

    }
}
