import { Button } from '@/components/ui/button';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head , router} from '@inertiajs/react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function invoice({ invoice }: any) {




    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            
            <Head title={`Invoice #${invoice.invoice_number}`} />
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold">تفاصيل الفاتورة</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p><strong>رقم الفاتورة:</strong> {invoice.invoice_number}</p>
                        <p><strong>اسم العميل:</strong> {invoice.client}</p>
                        <p><strong>تاريخ الفاتورة:</strong> {invoice.invoice_date}</p>
                        <p><strong>المبلغ:</strong> {invoice.amount} SAR</p>
                        {invoice.phone && (
                            <p><strong>رقم الهاتف:</strong> {invoice.phone}</p>
                        )}
                        {invoice.address && (
                            <p><strong>العنوان:</strong> {invoice.address}</p>
                        )}
                    </div>

                    <div>
                        <p><strong>رمز QR:</strong></p>
                        {invoice.qr_code && (
                            <img src={invoice.qr_code} alt="QR Code" className="w-48 h-48 border rounded" />
                        )}
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mt-6">XML</h2>
                    <pre className="bg-gray-100 text-sm p-4 rounded overflow-auto">
                        {invoice.xml_data}
                    </pre>
                </div>
            </div>
         
        </AppLayout>
    );
}
