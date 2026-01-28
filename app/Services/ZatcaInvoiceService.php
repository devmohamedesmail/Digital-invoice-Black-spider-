<?php

namespace App\Services;

use App\Models\Invoice;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RobRichards\XMLSecLibs\XMLSecurityDSig;
use RobRichards\XMLSecLibs\XMLSecurityKey;
use Firebase\JWT\JWT;

class ZatcaInvoiceService
{
    public static function send(Invoice $invoice)
    {
        // 1. توقيع XML
        $signedXml = self::signXml($invoice->xml_data);

        // 2. توليد JWT
        $jwt = self::generateJwt();

        // 3. إرسال الفاتورة
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $jwt,
            'Accept' => 'application/json',
            'Content-Type' => 'application/xml',
        ])->post('https://api.fatoora.gov.sa/invoices/reporting/simplified', $signedXml);

        if ($response->successful()) {
            $invoice->update(['zatca_response' => $response->body()]);
            return true;
        }

        Log::error('ZATCA Error', ['response' => $response->body()]);
        return false;
    }

    private static function signXml($xmlString): string
    {
        $doc = new \DOMDocument();
        $doc->loadXML($xmlString);

        $objDSig = new XMLSecurityDSig();
        $objDSig->setCanonicalMethod(XMLSecurityDSig::EXC_C14N);
        $objDSig->addReference(
            $doc,
            XMLSecurityDSig::SHA256,
            ['http://www.w3.org/2000/09/xmldsig#enveloped-signature']
        );

        $objKey = new XMLSecurityKey(XMLSecurityKey::RSA_SHA256, ['type' => 'private']);
        $objKey->loadKey(storage_path('app/keys/private.key'), true);

        $objDSig->sign($objKey);
        $objDSig->appendSignature($doc->documentElement);

        return $doc->saveXML();
    }

    private static function generateJwt(): string
    {
        $payload = [
            'iss' => 'YOUR_DEVICE_UUID',
            'aud' => 'https://api.fatoora.gov.sa',
            'iat' => time(),
            'exp' => time() + 3600,
        ];

        $privateKey = file_get_contents(storage_path('app/keys/private.key'));

        return JWT::encode($payload, $privateKey, 'RS256');
    }
}
