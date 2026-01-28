import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import React, { useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { 
    Edit, 
    Trash2, 
    Printer, 
    Plus, 
    FileText, 
    Download,
    Copy,
    FileSpreadsheet,
    Search,
    Calendar,
    User,
    Phone,
    CreditCard,
    Car,
    Receipt,
    DollarSign
} from 'lucide-react';
import InvoicePaper from './InvoicePaper';
import ReactDOM from 'react-dom/client';

import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-select-dt';
import 'datatables.net-responsive-dt';
import Buttons from 'datatables.net-buttons-dt';
import 'datatables.net-buttons/js/buttons.html5.js';
import 'datatables.net-buttons/js/buttons.print.js';
import 'datatables.net-select-dt';
import 'datatables.net-responsive-dt';


// Required for export
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import JSZip from 'jszip';

// Assign global dependencies
(pdfMake as any).vfs = pdfFonts.vfs;
(window as any).JSZip = JSZip;




export default function Show_Invoices({ invoices }: any) {
    const { t } = useTranslation()
    const { app_settings, notes }: any = usePage().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('dashboard'),
            href: '/dashboard',
        },
        {
            title: t('show-invoices'),
            href: '/show/invoices',
        },
    ];

    const printInvoice = ({ invoice, app_settings, notes }: any) => {
        const printContainer = document.createElement('div');
        printContainer.className = 'printable-area';
        document.body.appendChild(printContainer);

        const root = ReactDOM.createRoot(printContainer);
        root.render(<InvoicePaper invoice={invoice} settings={app_settings} notes={notes} />);

        const printStyles = `
          @media print {
            body * {
              visibility: hidden;
            }
            .printable-area, .printable-area * {
              visibility: visible;
            }
            .printable-area {
              position: absolute;
              left: 0;
              top: 0;
            }
            @page {
              margin: 20px;
            }
            .no-print {
              display: none !important;
            }
              .bg-gray-200 {
                background-color: #d3d3d3 !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
          }
        `;

        const styleTag = document.createElement('style');
        styleTag.innerHTML = printStyles;
        document.head.appendChild(styleTag);

        setTimeout(() => {
            window.print();

            setTimeout(() => {
                root.unmount();
                document.body.removeChild(printContainer);
                document.head.removeChild(styleTag);
            }, 500);
        }, 2000);
    };

    const handleDeleteInvoice = (invoice: any) => {
        if (confirm(t('confirm-delete-invoice') || 'Are you sure you want to delete this invoice?')) {
            router.get(route('invoices.delete', invoice.id));
        }
    };

    const exportToPDF = () => {
        // Create PDF export logic
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Invoices Export</title>
                        <style>
                            body { font-family: Arial, sans-serif; }
                            table { width: 100%; border-collapse: collapse; }
                            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                            th { background-color: #f2f2f2; }
                        </style>
                    </head>
                    <body>
                        <h1>Invoices Report</h1>
                        <table>
                            <tr>
                                <th>Invoice Number</th>
                                <th>Client</th>
                                <th>Total</th>
                                <th>Date</th>
                            </tr>
                            ${invoices.map((invoice: any) => `
                                <tr>
                                    <td>${invoice.invoice_number}</td>
                                    <td>${invoice.client?.name || 'N/A'}</td>
                                    <td>${invoice.total || 'N/A'} SAR</td>
                                    <td>${new Date(invoice.invoice_date).toLocaleDateString()}</td>
                                </tr>
                            `).join('')}
                        </table>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    };

    const exportToExcel = () => {
        const csvContent = [
            ['Invoice Number', 'Client Name', 'Phone', 'VAT Number', 'Payment Type', 'Total', 'Date'].join(','),
            ...invoices.map((invoice: any) => [
                invoice.invoice_number,
                invoice.client?.name || 'N/A',
                invoice.phone || 'N/A',
                invoice.client_vat_number || 'N/A',
                invoice.payment_type || 'N/A',
                invoice.total || 'N/A',
                invoice.invoice_date
            ].map(field => `"${field}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'invoices.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const copyToClipboard = () => {
        const textContent = invoices.map((invoice: any) => 
            `${invoice.invoice_number} - ${invoice.client?.name || 'N/A'} - ${invoice.total || 'N/A'} SAR`
        ).join('\n');
        
        navigator.clipboard.writeText(textContent).then(() => {
            alert(t('copied-to-clipboard') || 'Copied to clipboard!');
        });
    };

    const formatServices = (services: any) => {
        if (!services || !Array.isArray(services)) return 'N/A';
        
        if (typeof services[0] === 'object') {
            return services.map((service: any, index: number) => 
                `${index + 1}. ${service.service || service} (${service.price ? service.price + ' SAR' : 'N/A'})`
            ).join(', ');
        }
        
        return services.map((service: any, index: number) => 
            `${index + 1}. ${service}`
        ).join(', ');
    };

    DataTable.use(DT);
    DataTable.use(Buttons);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('show-invoices')} />

            {/* Header Section */}
            <div className="flex justify-between items-center mb-6 px-6 pt-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 arabic-font">
                        {t('show-invoices')}
                    </h1>
                    <p className="text-gray-600 mt-1 arabic-font">
                        {t('manage-all-invoices') || 'Manage and view all your invoices'}
                    </p>
                </div>
                <Link
                    href='/invoice/create'
                    className='flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors arabic-font'
                >
                    <Icon iconNode={Plus} className="h-4 w-4" />
                    {t('create-invoice')}
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-6 mb-6">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 arabic-font">{t('total-invoices')}</p>
                                <p className="text-2xl font-bold">{invoices.length}</p>
                            </div>
                            <Icon iconNode={FileText} className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 arabic-font">{t('total-revenue')}</p>
                                <p className="text-2xl font-bold">
                                    {invoices.reduce((sum: number, invoice: any) => sum + (parseFloat(invoice.total) || 0), 0).toFixed(2)} SAR
                                </p>
                            </div>
                            <Icon iconNode={DollarSign} className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 arabic-font">{t('this-month')}</p>
                                <p className="text-2xl font-bold">
                                    {invoices.filter((invoice: any) => {
                                        const invoiceDate = new Date(invoice.invoice_date);
                                        const now = new Date();
                                        return invoiceDate.getMonth() === now.getMonth() && 
                                               invoiceDate.getFullYear() === now.getFullYear();
                                    }).length}
                                </p>
                            </div>
                            <Icon iconNode={Calendar} className="h-8 w-8 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 arabic-font">{t('avg-invoice-value')}</p>
                                <p className="text-2xl font-bold">
                                    {invoices.length > 0 ? 
                                        (invoices.reduce((sum: number, invoice: any) => sum + (parseFloat(invoice.total) || 0), 0) / invoices.length).toFixed(2) : 
                                        '0.00'
                                    } SAR
                                </p>
                            </div>
                            <Icon iconNode={Receipt} className="h-8 w-8 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Export Actions */}
            <Card className="mx-6 mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 arabic-font">
                        <Icon iconNode={Download} className="h-5 w-5" />
                        {t('export-options')}
                    </CardTitle>
                    <CardDescription className="arabic-font">
                        {t('export-options-description') || 'Export your invoice data in various formats'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        <Button
                            onClick={copyToClipboard}
                            variant="outline"
                            className="flex items-center gap-2 arabic-font"
                        >
                            <Icon iconNode={Copy} className="h-4 w-4" />
                            {t('copy')}
                        </Button>
                        
                        <Button
                            onClick={exportToExcel}
                            variant="outline"
                            className="flex items-center gap-2 arabic-font"
                        >
                            <Icon iconNode={FileSpreadsheet} className="h-4 w-4" />
                            {t('export-to-excel')}
                        </Button>
                        
                        <Button
                            onClick={exportToPDF}
                            variant="outline"
                            className="flex items-center gap-2 arabic-font"
                        >
                            <Icon iconNode={FileText} className="h-4 w-4" />
                            {t('export-to-pdf')}
                        </Button>
                        
                        <Button
                            onClick={() => window.print()}
                            variant="outline"
                            className="flex items-center gap-2 arabic-font"
                        >
                            <Icon iconNode={Printer} className="h-4 w-4" />
                            {t('print')}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Invoices Table */}
            <Card className="mx-6 mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 arabic-font">
                        <Icon iconNode={FileText} className="h-5 w-5" />
                        {t('invoices-list')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <DataTable 
                            className="w-full"
                            options={{
                                dom: 'frtip',
                                responsive: true,
                                pageLength: 25,
                                order: [[0, 'desc']],
                                language: {
                                    search: t('search') + ':',
                                    searchPlaceholder: t('search-invoices') || 'Search invoices...',
                                    lengthMenu: t('show') + ' _MENU_ ' + t('entries'),
                                    info: t('showing') + ' _START_ ' + t('to') + ' _END_ ' + t('of') + ' _TOTAL_ ' + t('entries'),
                                    paginate: {
                                        first: t('first'),
                                        last: t('last'),
                                        next: t('next'),
                                        previous: t('previous')
                                    }
                                }
                            }}
                        >
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider arabic-font">
                                        {t('invoice-number')}
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider arabic-font">
                                        {t('client-information-column')}
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider arabic-font">
                                        {t('payment-details')}
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider arabic-font">
                                        {t('services')}
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider arabic-font">
                                        {t('vehicle-info')}
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider arabic-font">
                                        {t('total')}
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider arabic-font">
                                        {t('actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {invoices.map((invoice: any) => (
                                    <tr key={invoice.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 arabic-font">
                                                {invoice.invoice_number}
                                            </div>
                                            <div className="text-sm text-gray-500 arabic-font">
                                                {new Date(invoice.invoice_date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        
                                        <td className="px-4 py-4">
                                            <div className="flex items-center">
                                                <Icon iconNode={User} className="h-4 w-4 text-gray-400 mr-2" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 arabic-font">
                                                        {invoice.client?.name || 'N/A'}
                                                    </div>
                                                    <div className="text-sm text-gray-500 arabic-font flex items-center">
                                                        <Icon iconNode={Phone} className="h-3 w-3 mr-1" />
                                                        {invoice.phone || 'N/A'}
                                                    </div>
                                                    {invoice.client_vat_number && (
                                                        <div className="text-xs text-gray-400 arabic-font">
                                                            VAT: {invoice.client_vat_number}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        
                                        <td className="px-4 py-4">
                                            <div className="space-y-1">
                                                <Badge variant="outline" className="text-xs arabic-font">
                                                    <Icon iconNode={CreditCard} className="h-3 w-3 mr-1" />
                                                    {invoice.payment_type || 'N/A'}
                                                </Badge>
                                                <div className="text-xs text-gray-500 arabic-font">
                                                    {invoice.invoice_type || 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        
                                        <td className="px-4 py-4">
                                            <div className="text-sm text-gray-900 arabic-font max-w-xs">
                                                {formatServices(invoice.service)}
                                            </div>
                                        </td>
                                        
                                        <td className="px-4 py-4">
                                            {invoice.car_no || invoice.car_type ? (
                                                <div className="flex items-center text-sm text-gray-900 arabic-font">
                                                    <Icon iconNode={Car} className="h-4 w-4 text-gray-400 mr-2" />
                                                    <div>
                                                        <div>{invoice.car_no || 'N/A'}</div>
                                                        <div className="text-xs text-gray-500">{invoice.car_type || 'N/A'}</div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400 arabic-font">N/A</span>
                                            )}
                                        </td>
                                        
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 arabic-font">
                                                {invoice.total ? `${parseFloat(invoice.total).toFixed(2)} SAR` : 'N/A'}
                                            </div>
                                            {invoice.percent && (
                                                <div className="text-xs text-gray-500 arabic-font">
                                                    {invoice.percent}%
                                                </div>
                                            )}
                                        </td>
                                        
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => printInvoice({ invoice, app_settings, notes })}
                                                    className="flex items-center gap-1"
                                                >
                                                    <Icon iconNode={Printer} className="h-3 w-3" />
                                                    <span className="sr-only">{t('print')}</span>
                                                </Button>
                                                
                                                <Link
                                                    href={route('invoices.edit', invoice.id)}
                                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8"
                                                >
                                                    <Icon iconNode={Edit} className="h-3 w-3" />
                                                    <span className="sr-only">{t('edit')}</span>
                                                </Link>
                                                
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDeleteInvoice(invoice)}
                                                    className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:border-red-300"
                                                >
                                                    <Icon iconNode={Trash2} className="h-3 w-3" />
                                                    <span className="sr-only">{t('delete')}</span>
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </DataTable>
                    </div>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
