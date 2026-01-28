<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\PurchaseController;
use App\Models\Invoice;
use App\Models\Client;

Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('home');

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('dashboard', function () {
//         return Inertia::render('dashboard');
//     })->name('dashboard');
// });

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        if (auth()->user()->role == 'admin') {
            $invoices = Invoice::all();
            $today_invoices = Invoice::today()->get();
            $monthly_revenue = Invoice::thisMonth()->sum('total');
            $pending_invoices = Invoice::pending()->get();
            $clients_count = Client::active()->count();
            
            return Inertia::render('dashboard', [
                'invoices' => $invoices,
                'today_invoices' => $today_invoices,
                'monthly_revenue' => $monthly_revenue,
                'pending_invoices' => $pending_invoices,
                'clients_count' => $clients_count,
            ]);
        } else {
            return Inertia::render('auth/login');
        }
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';





Route::controller(InvoiceController::class)->group(function () {
    Route::get('invoice/create', 'create_page')->name('invoice.create' )->middleware('auth');
    Route::post('invoice/store', 'invoice_store')->name('invoice.store' )->middleware('auth');
    Route::get('show/invoices','show_invoices')->name('show.invoices')->middleware('auth');
    Route::get('/invoice/{invoice}/edit','edit_invoice')->name('invoices.edit')->middleware('auth');
    Route::post('/invoice/{invoice}/update/confirm','update_invoice')->name('invoice.update.confirm')->middleware('auth');
    Route::get('/invoice/{invoice}/delete','delete_invoice')->name('invoices.delete')->middleware('auth');

});


Route::controller(SettingController::class)->group(function () {
  Route::get('/settings/page', 'settings_page')->name('settings.page')->middleware('auth');
  Route::post('/settings/update', 'settings_update')->name('settings.update')->middleware('auth');
  Route::post('/service/store', 'service_store')->name('service.store')->middleware('auth');
  Route::get('/terms/conditions/page', 'terms_conditions_page')->name('terms.conditions.page')->middleware('auth');
  Route::post('/store/terms/conditions', 'store_terms_conditions')->name('terms.conditions.store')->middleware('auth');
  Route::post('/invoice/type/store', 'invoice_type_store')->name('invoicetype.store')->middleware('auth');

});

// Client routes
Route::resource('clients', ClientController::class)->middleware(['auth', 'verified']);
Route::get('api/clients', [ClientController::class, 'api'])->name('clients.api')->middleware(['auth', 'verified']);
Route::get('api/clients/search', [ClientController::class, 'search'])->name('clients.search')->middleware(['auth', 'verified']);

// Purchase routes
Route::resource('purchases', PurchaseController::class)->middleware(['auth']);
Route::get('api/purchases', [PurchaseController::class, 'api'])->name('purchases.api')->middleware(['auth', 'verified']);
Route::get('api/purchases/search', [PurchaseController::class, 'search'])->name('purchases.search')->middleware(['auth', 'verified']);
