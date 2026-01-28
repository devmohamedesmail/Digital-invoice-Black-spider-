import CustomInput from '@/components/custom/CustomInput';
import ClientAutocomplete from '@/components/custom/ClientAutocomplete';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/react'
import { useTranslation } from 'react-i18next';
import { useRef, useState } from 'react';
import CustomtextArea from '@/components/custom/CustomtextArea';
import Custommodal from '@/components/custom/Custommodal';
import Customselect from '@/components/custom/Customselect';
import {
    FileText,
    User,
    CreditCard,
    Calculator,
    Calendar,
    Car,
    Percent,
    Receipt,
    Save,
    Eye,
    Search,
    Edit,
    ArrowLeft
} from 'lucide-react';



export default function EditInvoice({ invoice }: any) {
    const { invoicetypes } = usePage<{ invoicetypes: any }>().props
    const [selectedClient, setSelectedClient] = useState<any>(null);
    const [serviceSearch, setServiceSearch] = useState<string>('');

    type Service = {
        id: number;
        type: string;
        created_at: string;
        updated_at: string;
    };

    const modalRef = useRef<HTMLDialogElement>(null);
    const { t } = useTranslation();
    const { services } = usePage<{ services: Service[] }>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('dashboard'),
            href: '/dashboard',
        },
        {
            title: t('show-invoices'),
            href: '/show/invoices',
        },
        {
            title: t('edit-invoice'),
            href: '#',
        },
    ];

    // Prepare initial service data - handle both old and new formats
    const prepareInitialServices = (invoiceServices: any) => {
        if (!invoiceServices) return [];
        
        if (Array.isArray(invoiceServices)) {
            // If it's already an array of objects with service and price
            if (invoiceServices.length > 0 && typeof invoiceServices[0] === 'object' && invoiceServices[0].service) {
                return invoiceServices;
            }
            // If it's an array of strings (old format)
            return invoiceServices.map((service: any) => ({
                service: service,
                price: 0
            }));
        }
        
        return [];
    };

    const { data, setData, post, processing, errors } = useForm({
        invoice_type: invoice.invoice_type || '',
        payment_type: invoice.payment_type || '',
        client_id: invoice.client_id || '',
        client: invoice.client || '',
        phone: invoice.phone || '',
        address: invoice.address || '',
        price: invoice.price || '',
        vat: invoice.vat || 15,
        car_no: invoice.car_no || '',
        car_type: invoice.car_type || '',
        percent: invoice.percent || '',
        service: prepareInitialServices(invoice.service),
        invoice_date: invoice.invoice_date || '',
        client_vat_number: invoice.client_vat_number || '',
        note: invoice.note || '',
    })

    const submit = (e: any) => {
        e.preventDefault()

        post(route('invoice.update.confirm', invoice.id), {
            onSuccess: () => {
                if (modalRef.current) {
                    modalRef.current.showModal();
                }
            },
        })
    }

    const handleClientSelect = (client: any) => {
        setSelectedClient(client);
        setData(prev => ({
            ...prev,
            client_id: client.id.toString(),
            client: client.name,
            phone: client.phone || '',
            address: client.address || '',
            client_vat_number: client.client_vat_number || '',
        }));
    };

    const handleClientNameChange = (value: string, client?: any) => {
        if (client) {
            handleClientSelect(client);
        } else {
            // If no client selected, clear the client_id and related fields
            setSelectedClient(null);
            setData(prev => ({
                ...prev,
                client_id: '',
                client: value,
            }));
        }
    };

    const paymenttypes = [
        { id: 1, title: t('cash'), value: t('cash') },
        { id: 2, title: t('visa'), value: t('visa') },
        { id: 3, title: t('transfer'), value: t('transfer') },
    ];

    // Calculate totals
    const servicesSubtotal = data.service.reduce((sum, item) => sum + (item.price || 0), 0);
    const basePrice = Number(data.price) || 0;
    const totalPrice = basePrice + servicesSubtotal;
    const vatRate = Number(data.vat) || 0;
    const vatAmount = (totalPrice * vatRate) / 100;
    const total = totalPrice + vatAmount;

    const handleServiceAdd = (serviceName: string) => {
        const existingService = data.service.find(s => s.service === serviceName);
        if (!existingService) {
            setData('service', [...data.service, { service: serviceName, price: 0 }]);
        }
    };

    const handleServiceRemove = (serviceName: string) => {
        setData('service', data.service.filter(s => s.service !== serviceName));
    };

    const handleServicePriceChange = (serviceName: string, price: number) => {
        setData('service', data.service.map(s => 
            s.service === serviceName ? { ...s, price } : s
        ));
    };

    // Filter services based on search
    const filteredServices = services.filter(service =>
        service.type.toLowerCase().includes(serviceSearch.toLowerCase())
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('edit-invoice')} #${invoice.invoice_number}`} />

            {/* Header Section */}
            <div className="flex justify-between items-center mb-6 px-6 pt-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 arabic-font">
                        {t('edit-invoice')} #{invoice.invoice_number}
                    </h1>
                    <p className="text-gray-600 mt-1 arabic-font">
                        {t('edit-invoice-description') || 'Update invoice information and details'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href='/show/invoices'
                        className='flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors arabic-font'
                    >
                        <Icon iconNode={ArrowLeft} className="h-4 w-4" />
                        {t('back-to-invoices')}
                    </Link>
                    <Link
                        href='/invoice/create'
                        className='flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors arabic-font'
                    >
                        <Icon iconNode={FileText} className="h-4 w-4" />
                        {t('create-new')}
                    </Link>
                </div>
            </div>

            <div className="px-6 pb-6">
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Client Information Card */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 arabic-font">
                                    <Icon iconNode={User} className="h-5 w-5 text-blue-600" />
                                    {t('client-information')}
                                </CardTitle>
                                <CardDescription className="arabic-font">
                                    {t('client-info-description') || 'Update client information and details'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ClientAutocomplete
                                    value={data.client}
                                    onChange={handleClientNameChange}
                                    onClientSelect={handleClientSelect}
                                    label={t('client-name')}
                                    placeholder={t('search-or-enter-client-name') || 'Search for existing client or enter new name...'}
                                    error={errors.client}
                                />

                                {selectedClient && (
                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Icon iconNode={User} className="h-4 w-4 text-blue-600" />
                                            <span className="text-sm font-medium text-blue-800 arabic-font">
                                                {t('existing-client-selected') || 'Existing Client Selected'}
                                            </span>
                                        </div>
                                        <div className="text-sm text-blue-700 arabic-font">
                                            <p><strong>{selectedClient.name}</strong></p>
                                            {selectedClient.company_name && (
                                                <p>{selectedClient.company_name}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="grid gap-4 md:grid-cols-2">
                                    <CustomInput
                                        label={t('phone')}
                                        type='text'
                                        placeholder={t('phone')}
                                        value={data.phone}
                                        onChange={(e: any) => setData('phone', e.target.value)}
                                        error={errors.phone}
                                    />
                                    <CustomInput
                                        label={t('client_vat_number')}
                                        type='text'
                                        placeholder={t('client_vat_number')}
                                        value={data.client_vat_number}
                                        onChange={(e: any) => setData('client_vat_number', e.target.value)}
                                        error={errors.client_vat_number}
                                    />
                                </div>

                                <CustomInput
                                    label={t('address')}
                                    type='text'
                                    placeholder={t('address')}
                                    value={data.address}
                                    onChange={(e: any) => setData('address', e.target.value)}
                                    error={errors.address}
                                />
                            </CardContent>
                        </Card>

                        {/* Invoice Summary Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 arabic-font">
                                    <Icon iconNode={Calculator} className="h-5 w-5 text-green-600" />
                                    {t('invoice-summary')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 arabic-font">{t('base-price')}</span>
                                        <span className="font-medium arabic-font">{basePrice.toFixed(2)} SAR</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 arabic-font">{t('services-total')}</span>
                                        <span className="font-medium arabic-font">{servicesSubtotal.toFixed(2)} SAR</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 arabic-font">{t('subtotal')}</span>
                                        <span className="font-medium arabic-font">{totalPrice.toFixed(2)} SAR</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 arabic-font">{t('vat')} ({vatRate}%)</span>
                                        <span className="font-medium arabic-font">{vatAmount.toFixed(2)} SAR</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between items-center text-lg font-bold">
                                        <span className="arabic-font">{t('total')}</span>
                                        <span className="text-green-600 arabic-font">{total.toFixed(2)} SAR</span>
                                    </div>
                                </div>

                                {data.service.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2 arabic-font">
                                            {t('selected-services')}
                                        </h4>
                                        <div className="space-y-2">
                                            {data.service.map((serviceItem, index) => (
                                                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                    <span className="text-sm arabic-font">{serviceItem.service}</span>
                                                    <span className="text-sm font-medium arabic-font">{serviceItem.price.toFixed(2)} SAR</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Invoice Details Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 arabic-font">
                                <Icon iconNode={FileText} className="h-5 w-5 text-purple-600" />
                                {t('invoice-details')}
                            </CardTitle>
                            <CardDescription className="arabic-font">
                                {t('invoice-details-description') || 'Configure invoice settings and services'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-3">
                                <Customselect
                                    label={t('select-invoice-type')}
                                    items={invoicetypes}
                                    titleKey='type'
                                    valueKey='type'
                                    value={data.invoice_type}
                                    onChange={(e: any) => setData('invoice_type', e.target.value)}
                                    error={errors.invoice_type}
                                />

                                <Customselect
                                    label={t('select-payment-type')}
                                    items={paymenttypes}
                                    value={data.payment_type}
                                    onChange={(e: any) => setData('payment_type', e.target.value)}
                                    titleKey='title'
                                    valueKey='title'
                                    error={errors.payment_type}
                                />

                                <CustomInput
                                    label={t('invoice-date')}
                                    type='date'
                                    value={data.invoice_date}
                                    onChange={(e: any) => setData('invoice_date', e.target.value)}
                                    error={errors.invoice_date}
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <CustomInput
                                    label={t('price')}
                                    type='number'
                                    step="0.01"
                                    placeholder={t('price')}
                                    value={data.price}
                                    onChange={(e: any) => setData('price', e.target.value)}
                                    error={errors.price}
                                />

                                <CustomInput
                                    label={t('vat-percentage')}
                                    type='number'
                                    step="0.01"
                                    placeholder={t('vat')}
                                    value={data.vat}
                                    onChange={(e: any) => setData('vat', e.target.value)}
                                    error={errors.vat}
                                />
                            </div>

                            {/* Services with Pricing */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 arabic-font">
                                        {t('services')}
                                    </label>
                                    
                                    {/* Service Search */}
                                    <div className="relative mb-4">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input
                                            type="text"
                                            placeholder={t('search-services') || 'Search services...'}
                                            value={serviceSearch}
                                            onChange={(e) => setServiceSearch(e.target.value)}
                                            className="pl-10 arabic-font"
                                        />
                                    </div>

                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {filteredServices.length === 0 ? (
                                            <div className="text-center py-4 text-gray-500 arabic-font">
                                                {serviceSearch ? 
                                                    (t('no-services-found') || 'No services found matching your search') :
                                                    (t('no-services-available') || 'No services available')
                                                }
                                            </div>
                                        ) : (
                                            filteredServices.map((service) => {
                                                const isSelected = data.service.some(s => s.service === service.type);
                                                const selectedService = data.service.find(s => s.service === service.type);
                                                
                                                return (
                                                    <div key={service.id} className="border rounded-lg p-3 hover:border-blue-300 transition-colors">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center space-x-2">
                                                                <input
                                                                    type="checkbox"
                                                                    id={`service-${service.id}`}
                                                                    checked={isSelected}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            handleServiceAdd(service.type);
                                                                        } else {
                                                                            handleServiceRemove(service.type);
                                                                        }
                                                                    }}
                                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                                />
                                                                <label 
                                                                    htmlFor={`service-${service.id}`}
                                                                    className="text-sm font-medium text-gray-700 arabic-font cursor-pointer"
                                                                >
                                                                    {service.type}
                                                                </label>
                                                            </div>
                                                        </div>
                                                        
                                                        {isSelected && (
                                                            <div className="mt-2">
                                                                <CustomInput
                                                                    label={t('service-price')}
                                                                    type="number"
                                                                    step="0.01"
                                                                    placeholder={t('enter-service-price')}
                                                                    value={selectedService?.price || 0}
                                                                    onChange={(e: any) => handleServicePriceChange(service.type, Number(e.target.value))}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>

                                    {/* Selected Services Summary */}
                                    {data.service.length > 0 && (
                                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Icon iconNode={Receipt} className="h-4 w-4 text-blue-600" />
                                                <span className="text-sm font-medium text-blue-800 arabic-font">
                                                    {t('selected-services-count', { count: data.service.length })} ({data.service.length})
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {data.service.map((serviceItem, index) => (
                                                    <Badge key={index} variant="secondary" className="arabic-font">
                                                        {serviceItem.service}: {serviceItem.price.toFixed(2)} SAR
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {errors.service && (
                                        <p className="mt-1 text-sm text-red-600 arabic-font">{errors.service}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Additional Details Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 arabic-font">
                                <Icon iconNode={Car} className="h-5 w-5 text-orange-600" />
                                {t('additional-details')}
                            </CardTitle>
                            <CardDescription className="arabic-font">
                                {t('additional-details-description') || 'Optional vehicle and additional information'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-3">
                                <CustomInput
                                    label={t('car_no')}
                                    type='text'
                                    placeholder={t('car_no')}
                                    value={data.car_no}
                                    onChange={(e: any) => setData('car_no', e.target.value)}
                                    error={errors.car_no}
                                />
                                <CustomInput
                                    label={t('car_type')}
                                    type='text'
                                    placeholder={t('car_type')}
                                    value={data.car_type}
                                    onChange={(e: any) => setData('car_type', e.target.value)}
                                    error={errors.car_type}
                                />
                                <CustomInput
                                    label={t('percent')}
                                    type='number'
                                    step="0.01"
                                    placeholder={t('percent')}
                                    value={data.percent}
                                    onChange={(e: any) => setData('percent', e.target.value)}
                                    error={errors.percent}
                                />
                            </div>

                            <CustomtextArea
                                label={t('note')}
                                value={data.note}
                                onChange={(e: any) => setData('note', e.target.value)}
                                error={errors.note}
                            />
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-center pt-6">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="px-8 py-3 text-lg arabic-font"
                            size="lg"
                        >
                            <Icon iconNode={Save} className="h-5 w-5 mr-2" />
                            {processing ? t('updating') : t('update-invoice')}
                        </Button>
                    </div>
                </form>
            </div>

            <Custommodal modalname={modalRef} message={t('invoice-updated-successfully')} />
        </AppLayout>
    );
}
