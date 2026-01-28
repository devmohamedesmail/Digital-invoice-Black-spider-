import { usePage } from '@inertiajs/react'
import React from 'react'
import { useTranslation } from 'react-i18next';

interface InvoicePaperProps {
    invoice: any;
    settings: any;
    notes: any;
}

function InvoicePaper({ invoice, settings, notes }: InvoicePaperProps) {
    const { t } = useTranslation()

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ar-SA', {
            style: 'currency',
            currency: 'SAR',
        }).format(amount);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('ar-EG', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="w-full h-full bg-white flex flex-col" style={{ width: '210mm', height: '297mm', minHeight: '297mm', maxHeight: '297mm', direction: 'rtl' }}>
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 relative overflow-hidden flex-shrink-0">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>

                <div className="flex justify-between items-start relative z-10">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        {settings.logo && (
                            <div className="w-28 h-28 bg-white rounded-lg p-2">
                                <img
                                    src={`/uploads/${settings.logo}`}
                                    className="w-full h-full object-contain"
                                    alt={settings.name}
                                />
                            </div>
                        )}
                        <div className="whitespace-nowrap">
                            <h1 className="text-5xl font-bold arabic-font whitespace-nowrap">{settings.shop_name}</h1>
                            <p className="text-blue-100 text-lg whitespace-nowrap">{settings.name}</p>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                            <h2 className="text-2xl font-bold mb-2 arabic-font whitespace-nowrap">{t('invoice')}</h2>
                            <div className="space-y-1 text-sm">
                                <p className="text-blue-100 whitespace-nowrap">{t('invoice_number')}: <span className="font-bold text-white">{invoice.invoice_number}</span></p>
                                <p className="text-blue-100 whitespace-nowrap">{t('date')}: <span className="font-bold text-white">{formatDate(invoice.invoice_date)}</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <div className="inline-block bg-white bg-opacity-20 rounded-full px-6 py-2 backdrop-blur-sm">
                        <span className="text-xl font-semibold arabic-font">{invoice.invoice_type}</span>
                    </div>
                </div>
            </div>

            {/* Company Information */}
            <div className="px-6 py-3 bg-gray-50 border-b flex-shrink-0">
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-3 arabic-font whitespace-nowrap">{t('company-details')}</h3>
                        <div className="space-y-2 text-sm">
                            <p className="flex items-center whitespace-nowrap"><span className="font-medium text-gray-600 w-32">{t('address')}:</span> <span>{settings.address}</span></p>
                            <p className="flex items-center whitespace-nowrap"><span className="font-medium text-gray-600 w-32">{t('phone')}:</span> <span className='whitespace-nowrap' dir="ltr">{settings.phone}</span></p>
                            <p className="flex items-center whitespace-nowrap"><span className="font-medium text-gray-600 w-32">{t('email')}:</span> <span>{settings.email}</span></p>
                            <p className="flex items-center whitespace-nowrap"><span className="font-medium text-gray-600 w-32">{t('vat_number')}:</span> <span>{settings.vat_number}</span></p>
                            <p className="flex items-center whitespace-nowrap"><span className="font-medium text-gray-600 w-32">{t('unique_number')}:</span> <span> 7039471771 </span></p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-3 arabic-font whitespace-nowrap">{t('client-info')}</h3>
                        <div className="bg-white rounded-lg p-4 border">
                            <div className="space-y-2 text-sm">
                                <p className="flex items-center whitespace-nowrap"><span className="font-medium text-gray-600 w-32">{t('name')}:</span> <span className="font-semibold">{invoice.client || 'N/A'}</span></p>
                                <p className="flex items-center whitespace-nowrap"><span className="font-medium text-gray-600 w-32">{t('phone')}:</span> <span className='whitespace-nowrap' dir="ltr">{invoice.phone || 'N/A'}</span></p>
                                <p className="flex items-center whitespace-nowrap"><span className="font-medium text-gray-600 w-32">{t('address')}:</span> <span>{invoice.address || 'N/A'}</span></p>
                                <p className="flex items-center whitespace-nowrap"><span className="font-medium text-gray-600 w-32">{t('client_vat_number')}:</span> <span>{invoice.client_vat_number || 'N/A'}</span></p>
                                <p className="flex items-center whitespace-nowrap"><span className="font-medium text-gray-600 w-32">{t('car_no')}:</span> <span>{invoice.car_no || 'N/A'}</span></p>
                                <p className="flex items-center whitespace-nowrap"><span className="font-medium text-gray-600 w-32">{t('car_type')}:</span> <span>{invoice.car_type || 'N/A'}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invoice Details Table */}
            

            {/* Total Section */}
            <div className="px-8 py-3">
                <div className="flex justify-between items-start">
                    {invoice.service && invoice.service.length > 0 && (
                        <div className="mt-4">
                            <h4 className="text-md font-bold text-gray-800 mb-2 arabic-font whitespace-nowrap">{t('services')}</h4>
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                                            <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 border-b whitespace-nowrap">#</th>
                                            <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 border-b whitespace-nowrap">{t('service')}</th>
                                            <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 border-b whitespace-nowrap">{t('price')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoice.service.slice(0, 8).map((service: any, index: number) => {
                                            // Handle both object format and string format
                                            const serviceName = typeof service === 'object' && service.service
                                                ? service.service
                                                : typeof service === 'string'
                                                    ? service
                                                    : 'N/A';

                                            const servicePrice = typeof service === 'object' && service.price
                                                ? parseFloat(service.price) || 0
                                                : 0;

                                            return (
                                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-3 py-2 text-xs text-gray-600 border-b text-right whitespace-nowrap">
                                                        <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                                                            {index + 1}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-2 text-xs text-gray-800 border-b text-right whitespace-nowrap arabic-font">
                                                        {serviceName}
                                                    </td>
                                                    <td className="px-3 py-2 text-xs text-gray-800 border-b text-right whitespace-nowrap font-medium">
                                                        {formatCurrency(servicePrice)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {invoice.service.length > 8 && (
                                            <tr>
                                                <td colSpan={3} className="px-3 py-2 text-xs text-gray-500 text-center border-b">
                                                    و {invoice.service.length - 8} خدمات إضافية...
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    <div className="w-80">
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 border-2 border-gray-100 ">
                            <div className="flex items-center mb-3">
                                <div className="w-6 h-6 bg-green-600 rounded-lg flex items-center justify-center ml-2">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 114 0v1H6v-1zm6 0a2 2 0 10-4 0v1h4v-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-bold text-gray-800 arabic-font whitespace-nowrap">ملخص الفاتورة</h3>
                            </div>

                            <div className="space-y-2">
                                {/* Subtotal (Price) */}
                                <div className="flex justify-between items-center py-2 px-1 bg-blue-50 rounded-lg border border-gray-100">
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                        <span className="text-sm font-semibold text-blue-700 whitespace-nowrap arabic-font">المجموع الفرعي</span>
                                    </div>
                                    <span className="text-sm font-bold text-blue-800 whitespace-nowrap">{formatCurrency(invoice.price || 0)}</span>
                                </div>

                                {/* VAT */}
                                <div className="flex justify-between items-center py-2 px-2 bg-orange-50 rounded-lg border border-gray-100">
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-orange-600 rounded-full "></div>
                                        <span className="text-sm font-semibold text-orange-700 whitespace-nowrap arabic-font">
                                            ضريبة القيمة المضافة ({invoice.vat_percentage || 15}%)
                                        </span>
                                    </div>
                                    <span className="text-sm font-bold text-orange-800 whitespace-nowrap">{formatCurrency(invoice.vat || 0)}</span>
                                </div>

                                {/* Total */}
                                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-3  mt-3">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-white rounded-full ml-2"></div>
                                            <span className="text-lg font-bold text-white whitespace-nowrap arabic-font"> الإجمالي</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xl font-bold text-white whitespace-nowrap">{formatCurrency(invoice.total || 0)}</span>
                                            <p className="text-green-100 text-xs whitespace-nowrap">شامل الضريبة</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Info */}
                                <div className="mt-2 p-2 bg-gray-100 rounded-lg border">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-600 arabic-font whitespace-nowrap">طريقة الدفع:</span>
                                        <span className="text-xs font-medium text-gray-800 whitespace-nowrap">{invoice.payment_type || 'غير محدد'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <div className="px-8 py-4 mt-auto">
                <div className="flex justify-between items-end">
                    {/* QR Code */}
                    <div className="flex-shrink-0">
                        {invoice.qr_code && (
                            <div className="bg-white p-3 ">
                                <img
                                    src={invoice.qr_code}
                                    alt="QR Code"
                                    className="w-24 h-24 object-contain"
                                />
                               
                            </div>
                        )}
                    </div>

                    {/* Signatures */}
                    <div className="flex space-x-12 rtl:space-x-reverse justify-between items-center w-full mr-24">
                        <div className="text-center">
                            <div className="w-28 h-12 border-b-2 border-gray-300 mb-2"></div>
                            <p className="text-xs font-medium text-gray-600 arabic-font whitespace-nowrap">{t('client-signature')}</p>
                        </div>

                        <div className="text-center">
                            <div className="w-28 h-12 border-b-2 border-gray-300 mb-2"></div>
                            <p className="text-xs font-medium text-gray-600 arabic-font whitespace-nowrap">{t('auth-signature')}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Border */}
            <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-800"></div>
        </div>












    )
}

export default InvoicePaper