<?php


namespace App\Services;

use App\Models\Invoice;

class InvoiceXmlService
{
    public static function generate(Invoice $invoice): string
    {
        $xml = new \SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><Invoice></Invoice>');

        $xml->addChild('cbc:ID', $invoice->invoice_number);
        $xml->addChild('cbc:IssueDate', $invoice->invoice_date);
        $xml->addChild('cbc:InvoiceTypeCode', '388'); // فاتورة ضريبية
        $xml->addChild('cbc:DocumentCurrencyCode', 'SAR');

        // البائع
        $accountingSupplierParty = $xml->addChild('cac:AccountingSupplierParty');
        $party = $accountingSupplierParty->addChild('cac:Party');
        $party->addChild('cbc:Name', 'اسم شركتك هنا');

        // المشتري
        $accountingCustomerParty = $xml->addChild('cac:AccountingCustomerParty');
        $party = $accountingCustomerParty->addChild('cac:Party');
        $party->addChild('cbc:Name', $invoice->client);

        // المبلغ
        $legalMonetaryTotal = $xml->addChild('cac:LegalMonetaryTotal');
        $legalMonetaryTotal->addChild('cbc:PayableAmount', $invoice->amount);

        return $xml->asXML();
    }
}
