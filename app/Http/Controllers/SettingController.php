<?php
namespace App\Http\Controllers;

use App\Models\InvoiceType;
use App\Models\Note;
use App\Models\Service;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SettingController extends Controller
{
    // settings_page
    public function settings_page()
    {
        try {
            $settings = Setting::first();
            return Inertia::render('settings/index', ['settings' => $settings]);
        } catch (\Throwable $th) {
            return Inertia::render('404', ["error" => $th->getMessage()]);
        }

    }

    // settings_update
    public function settings_update(Request $request)
    {
        try {
            $settings = Setting::first();
            if (! $settings) {
                $settings             = new Setting();
                $settings->shop_name  = $request->shop_name;
                $settings->name       = $request->name;
                $settings->phone      = $request->phone;
                $settings->address    = $request->address;
                $settings->email      = $request->email;
                $settings->vat_number = $request->vat_number;

                $logo = $request->logo;
                if ($logo) {
                    $image_name = Str::uuid() . '.' . $logo->getClientOriginalExtension();
                    $logo->move(public_path('uploads'), $image_name);
                    $settings->logo = $image_name;
                }

                $settings->save();
                return redirect()->back();
            } else {
                $settings->shop_name  = $request->shop_name;
                $settings->name       = $request->name;
                $settings->phone      = $request->phone;
                $settings->address    = $request->address;
                $settings->email      = $request->email;
                $settings->vat_number = $request->vat_number;

                $logo = $request->logo;
                if ($logo) {
                    $image_name = Str::uuid() . '.' . $logo->getClientOriginalExtension();
                    $logo->move(public_path('uploads'), $image_name);
                    $settings->logo = $image_name;
                }

                $settings->save();
                return redirect()->back();
            }
        } catch (\Throwable $th) {
            return Inertia::render('404', ["error" => $th->getMessage()]);
        }

    }

    // service_store
    public function service_store(Request $request)
    {

        try {
            $service       = new Service();
            $service->type = $request->type;
            $service->save();
            return redirect()->back();
        } catch (\Throwable $th) {
            return Inertia::render('404', ["error" => $th->getMessage()]);
        }
    }

    // terms_conditions_page
    public function terms_conditions_page()
    {
        try {
            return Inertia::render('terms/index');
        } catch (\Throwable $th) {
            return Inertia::render('404', ["error" => $th->getMessage()]);
        }
    }

    // store_terms_conditions
    public function store_terms_conditions(Request $request)
    {
        try {
            $note = Note::first();

            if ($note) {
                $note->note = $request->note;
            } else {
                $note       = new Note();
                $note->note = $request->note;
            }

            $note->save();

            return redirect()->back();
        } catch (\Throwable $th) {
            return Inertia::render('404', ["error" => $th->getMessage()]);
        }

    }

// invoice_type_store
    public function invoice_type_store(Request $request)
    {

        try {
            try {
                $type       = new InvoiceType();
                $type->type = $request->type;
                $type->save();
                return redirect()->back();
            } catch (\Throwable $th) {
                return Inertia::render('404', ["error" => $th->getMessage()]);
            }
        } catch (\Throwable $th) {
            return Inertia::render('404', ["error" => $th->getMessage()]);
        }

    }

}
