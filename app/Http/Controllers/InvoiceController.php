<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInvoiceRequest;
use App\Models\Setting;
use Inertia\Inertia;
use App\Models\Invoice;
use App\Models\Client;
use Illuminate\Http\Request;
use App\Services\InvoiceXmlService;

use App\Services\ZatcaQrService;
use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\Label\LabelAlignment;
use Endroid\QrCode\Label\Font\OpenSans;
use Endroid\QrCode\RoundBlockSizeMode;
use Endroid\QrCode\Writer\PngWriter;
use Barryvdh\DomPDF\Facade\Pdf;


class InvoiceController extends Controller
{
    // create_page
    public function create_page()
    {
        
        try {
            return Inertia::render('invoices/create');
        } catch (\Throwable $th) {
            return Inertia::render('404',["error"=>$th->getMessage()]);
        }
    }


    // invoice_store
    public function invoice_store(StoreInvoiceRequest $request)
    {

        try {
             // توليد رقم فاتورة تلقائي (مثلاً: INV-20250429-0001)
        $latestInvoice = Invoice::latest()->first();
        $nextNumber = $latestInvoice ? $latestInvoice->id + 1 : 1;
        $invoiceNumber = 'INV' .  '-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);

        
        // Handle client creation if client_id is not provided but client data exists
        $clientId = $request->client_id;
        if (!$clientId && $request->client) {
            // Check if client with same name already exists
            $existingClient = Client::where('name', $request->client)
                ->where('phone', $request->phone)
                ->first();
                
            if (!$existingClient) {
                // Create new client
                $newClient = Client::create([
                    'name' => $request->client,
                    'phone' => $request->phone,
                    'address' => $request->address,
                    'client_vat_number' => $request->client_vat_number,
                    'status' => 'active',
                ]);
                $clientId = $newClient->id;
            } else {
                $clientId = $existingClient->id;
            }
        }

        // Calculate totals - price is now sum of services
        $servicesTotal = 0;
        
        if ($request->service && is_array($request->service)) {
            foreach ($request->service as $service) {
                if (isset($service['price'])) {
                    $servicesTotal += (float) $service['price'];
                }
            }
        }
        
        $subtotal = $servicesTotal; // Price is now sum of services only
        $vatAmount = ($subtotal * $request->vat) / 100;
        $total = $subtotal + $vatAmount;

        $invoice = new Invoice();
        $invoice->invoice_number = $invoiceNumber;
        $invoice->invoice_type = $request->invoice_type;
        $invoice->payment_type = $request->payment_type;
        $invoice->client_id = $clientId;
        $invoice->client = $request->client;
        $invoice->address = $request->address;
        $invoice->phone = $request->phone;
        $invoice->service = $request->service;
        $invoice->price = $servicesTotal; // Store calculated price from services
        $invoice->vat = $vatAmount;
        $invoice->car_no = $request->car_no;
        $invoice->car_type = $request->car_type;
        $invoice->percent = $request->percent;
        $invoice->total = $total;
        $invoice->invoice_date = $request->invoice_date;
        $invoice->client_vat_number = $request->client_vat_number;
        $invoice->note = $request->note;
        $invoice->save();

        $settings = Setting::first();

        $xml = InvoiceXmlService::generate($invoice);
        $invoice->update(['xml_data' => $xml]);

        // Use the calculated VAT amount for QR code
        $qrBase64 = ZatcaQrService::generate(
            $settings->name,
            $settings->vat_number,
            now()->toIso8601String(),
            $servicesTotal, // Use services total as price
            number_format($vatAmount, 2, '.', '')
        );
        // Use the Builder class to create the QR code
        
        $builder = new Builder(
            writer: new PngWriter(),
            writerOptions: [],
            validateResult: false,
            data: $qrBase64,
            encoding: new Encoding('UTF-8'),
            errorCorrectionLevel: ErrorCorrectionLevel::High,
            size: 300,
            margin: 10,
            roundBlockSizeMode: RoundBlockSizeMode::Margin,
         
            labelFont: new OpenSans(16),
            labelAlignment: LabelAlignment::Center
        );

        // توليد النتيجة
        $result = $builder->build();

        // استخراج QR كـ base64 Data URI
        $qrDataUri = $result->getDataUri();

        // ****************************************************************
        $filename = 'qr_' . uniqid() . '.png'; // اسم فريد
        $path = public_path('qrcodes/' . $filename);

        // تأكد أن المجلد موجود
        if (!file_exists(public_path('qrcodes'))) {
            mkdir(public_path('qrcodes'), 0755, true);
        }

        // احفظ الصورة
        file_put_contents($path, $result->getString());
        // *********************************************************************
        // حفظ QR في قاعدة البيانات
        $invoice->update(['qr_code' => $qrDataUri]);
        return redirect()->back();
        } catch (\Throwable $th) {
            return Inertia::render('404',["error"=>$th->getMessage()]);
        }
      
       
    }






    public function show_invoices()
    {
        try {
            $invoices = Invoice::orderBy('created_at', 'desc')->get();
            return Inertia::render('invoices/show', ["invoices" => $invoices]);
        } catch (\Throwable $th) {
            return Inertia::render('404',["error"=>$th->getMessage()]);
        }
    }





    // edit_invoice
    public function edit_invoice($id){
        try {
            $invoice = Invoice::findOrFail($id);
            return Inertia::render('invoices/edit', ["invoice" => $invoice]);
        } catch (\Throwable $th) {
            return Inertia::render('404',["error"=>$th->getMessage()]);
        }
    }

    // update_invoice
    public function update_invoice($id, StoreInvoiceRequest $request){

        try {
            
            $invoice = Invoice::findOrFail($id);
            $invoice->invoice_type = $request->invoice_type;
            $invoice->payment_type = $request->payment_type;
            $invoice->client = $request->client;
            $invoice->address = $request->address;
            $invoice->phone = $request->phone;
            $invoice->service = $request->service;
            $invoice->price = $request->price;
            $invoice->vat = $request->vat;
            $invoice->car_no = $request->car_no;
            $invoice->car_type = $request->car_type;
            $invoice->percent = $request->percent;
            $invoice->total = $request->price * (1 + $request->vat / 100);
            $invoice->invoice_date = $request->invoice_date;
            $invoice->client_vat_number = $request->client_vat_number;
            $invoice->note = $request->note;
            $invoice->save();
    
            $settings = Setting::first();
    
            $xml = InvoiceXmlService::generate($invoice);
            $invoice->update(['xml_data' => $xml]);

            $vatAmount = ($invoice->price * $request->vat) / 115;
            $qrBase64 = ZatcaQrService::generate(
                $settings->name,
                $settings->vat_number,
                now()->toIso8601String(),
                $invoice->price,
                // $invoice->price * 0.15
                number_format($vatAmount, 2, '.', '')
            );
            // Use the Builder class to create the QR code
            
            $builder = new Builder(
                writer: new PngWriter(),
                writerOptions: [],
                validateResult: false,
                data: $qrBase64,
                encoding: new Encoding('UTF-8'),
                errorCorrectionLevel: ErrorCorrectionLevel::High,
                size: 300,
                margin: 10,
                roundBlockSizeMode: RoundBlockSizeMode::Margin,
                labelFont: new OpenSans(16),
                labelAlignment: LabelAlignment::Center
            );
    
            // توليد النتيجة
            $result = $builder->build();
    
            // استخراج QR كـ base64 Data URI
            $qrDataUri = $result->getDataUri();
    
            // ****************************************************************
            $filename = 'qr_' . uniqid() . '.png'; // اسم فريد
            $path = public_path('qrcodes/' . $filename);
    
            // تأكد أن المجلد موجود
            if (!file_exists(public_path('qrcodes'))) {
                mkdir(public_path('qrcodes'), 0755, true);
            }
    
            // احفظ الصورة
            file_put_contents($path, $result->getString());
            // *********************************************************************
            // حفظ QR في قاعدة البيانات
            $invoice->update(['qr_code' => $qrDataUri]);
    
    
    
    
    
            return redirect()->back();
        } catch (\Throwable $th) {
            return Inertia::render('404',["error"=>$th->getMessage()]);
        }



    }




    // delete_invoice 
    public function delete_invoice($id){
        
        try {
            $invoice = Invoice::findOrFail($id);
            $invoice->delete();
            return redirect()->back();
          
        } catch (\Throwable $th) {
            return Inertia::render('404',["error"=>$th->getMessage()]);
        }


    }

}
