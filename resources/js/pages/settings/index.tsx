import CustomInput from '@/components/custom/CustomInput';
import Custommodal from '@/components/custom/Custommodal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@/components/ui/icon';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react'
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Settings as SettingsIcon,
    Building2,
    Phone,
    Mail,
    MapPin,
    Hash,
    Upload,
    Save,
    Plus,
    FileText,
    Wrench,
    Image
} from 'lucide-react';

export default function Settings({ settings }: any) {
    const modalRef = useRef<HTMLDialogElement>(null);
    const modalService = useRef<HTMLDialogElement>(null);
    const modalInvoiceType = useRef<HTMLDialogElement>(null);
    const { t } = useTranslation();
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('dashboard'),
            href: '/dashboard',
        },
        {
            title: t('settings'),
            href: '/settings/page',
        },
    ];

    const { data, setData, post, processing, errors } = useForm({
        shop_name: settings?.shop_name || '',
        name: settings?.name || '',
        logo: '',
        phone: settings?.phone || '',
        address: settings?.address || '',
        email: settings?.email || '',
        vat_number: settings?.vat_number || '',
    })

    const update_settings = (e: any) => {
        e.preventDefault()
        post(route('settings.update'), {
            onSuccess: () => {
                if (modalRef.current) {
                    modalRef.current.showModal();
                }
            },
        })
    }

    const { data: serviceData, setData: setServiceData, post: postService, processing: processingService, errors: errorsService } = useForm({
        type: '',
    })

    const add_new_service = (e: any) => {
        e.preventDefault()
        postService(route('service.store'), {
            preserveScroll: true,
            onSuccess: () => {
                if (modalService.current) {
                    modalService.current.showModal();
                }
                setServiceData('type', '');
            },
        })
    }

    const { data: invoiceData, setData: setInvoiceData, post: postInvoiceType, processing: processingInvoice, errors: errorsInvoice } = useForm({
        type: '',
    })
    
    const add_new_invoice_type = (e: any) => {
        e.preventDefault()
        postInvoiceType(route('invoicetype.store'), {
            preserveScroll: true,
            onSuccess: () => {
                if (modalInvoiceType.current) {
                    modalInvoiceType.current.showModal();
                }
                setInvoiceData('type', '');
            },
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('settings')} />

            {/* Header Section */}
            <div className="flex justify-between items-center mb-6 px-6 pt-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 arabic-font">
                        {t('settings')}
                    </h1>
                    <p className="text-gray-600 mt-1 arabic-font">
                        {t('settings-description') || 'Manage your application settings and configuration'}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Icon iconNode={SettingsIcon} className="h-6 w-6 text-gray-600" />
                </div>
            </div>

            <div className="px-6 pb-6">
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Company Settings Card */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 arabic-font">
                                <Icon iconNode={Building2} className="h-5 w-5 text-blue-600" />
                                {t('company-settings')}
                            </CardTitle>
                            <CardDescription className="arabic-font">
                                {t('company-settings-description') || 'Configure your company information and branding'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={update_settings} className="space-y-4">
                                <div className="grid gap-4">
                                    <CustomInput
                                        label={t('shop-name')}
                                        type='text'
                                        placeholder={t('shop-name')}
                                        value={data.shop_name}
                                        onChange={(e: any) => setData('shop_name', e.target.value)}
                                        error={errors.shop_name}
                                    />
                                    
                                    <CustomInput
                                        label={t('compant-name')}
                                        type='text'
                                        placeholder={t('compant-name')}
                                        value={data.name}
                                        onChange={(e: any) => setData('name', e.target.value)}
                                        error={errors.name}
                                    />
                                </div>

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
                                        label={t('email')}
                                        type='email'
                                        placeholder={t('email')}
                                        value={data.email}
                                        onChange={(e: any) => setData('email', e.target.value)}
                                        error={errors.email}
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

                                <CustomInput
                                    label={t('vat_number')}
                                    type='text'
                                    placeholder={t('vat_number')}
                                    value={data.vat_number}
                                    onChange={(e: any) => setData('vat_number', e.target.value)}
                                    error={errors.vat_number}
                                />

                                {/* Logo Upload Section */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 arabic-font">
                                        {t('company-logo')}
                                    </label>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            {settings?.logo ? (
                                                <img 
                                                    src={`/uploads/${settings.logo}`} 
                                                    alt="Company Logo" 
                                                    className="h-20 w-20 object-cover rounded-lg border border-gray-300"
                                                />
                                            ) : (
                                                <div className="h-20 w-20 flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg">
                                                    <Icon iconNode={Image} className="h-8 w-8 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <label className="cursor-pointer">
                                                <input 
                                                    type="file" 
                                                    className="hidden" 
                                                    accept="image/*"
                                                    onChange={(e: any) => setData('logo', e.target.files[0])} 
                                                />
                                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors arabic-font">
                                                    <Icon iconNode={Upload} className="h-4 w-4" />
                                                    {settings?.logo ? t('change-logo') : t('upload-logo')}
                                                </div>
                                            </label>
                                            <p className="text-xs text-gray-500 mt-1 arabic-font">
                                                {t('logo-requirements') || 'PNG, JPG up to 2MB'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center pt-4">
                                    <Button 
                                        type="submit" 
                                        disabled={processing}
                                        className="px-6 py-2 arabic-font"
                                    >
                                        <Icon iconNode={Save} className="h-4 w-4 mr-2" />
                                        {processing ? t('saving') : t('save-settings')}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Configuration Cards */}
                    <div className="space-y-6">
                        {/* Services Management Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 arabic-font">
                                    <Icon iconNode={Wrench} className="h-5 w-5 text-green-600" />
                                    {t('services-management')}
                                </CardTitle>
                                <CardDescription className="arabic-font">
                                    {t('services-management-description') || 'Add and manage your service types'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={add_new_service} className="space-y-4">
                                    <CustomInput
                                        label={t('service-name')}
                                        placeholder={t('enter-service-name') || 'Enter service name...'}
                                        value={serviceData.type}
                                        onChange={(e: any) => setServiceData('type', e.target.value)}
                                        error={errorsService.type}
                                    />
                                    
                                    <div className="flex justify-center">
                                        <Button 
                                            type="submit" 
                                            disabled={processingService || !serviceData.type.trim()}
                                            variant="outline"
                                            className="arabic-font"
                                        >
                                            <Icon iconNode={Plus} className="h-4 w-4 mr-2" />
                                            {processingService ? t('adding') : t('add-service')}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Invoice Types Management Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 arabic-font">
                                    <Icon iconNode={FileText} className="h-5 w-5 text-purple-600" />
                                    {t('invoice-types-management')}
                                </CardTitle>
                                <CardDescription className="arabic-font">
                                    {t('invoice-types-description') || 'Configure available invoice types'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={add_new_invoice_type} className="space-y-4">
                                    <CustomInput
                                        label={t('invoice-type')}
                                        placeholder={t('enter-invoice-type') || 'Enter invoice type...'}
                                        value={invoiceData.type}
                                        onChange={(e: any) => setInvoiceData('type', e.target.value)}
                                        error={errorsInvoice.type}
                                    />
                                    
                                    <div className="flex justify-center">
                                        <Button 
                                            type="submit" 
                                            disabled={processingInvoice || !invoiceData.type.trim()}
                                            variant="outline"
                                            className="arabic-font"
                                        >
                                            <Icon iconNode={Plus} className="h-4 w-4 mr-2" />
                                            {processingInvoice ? t('adding') : t('add-invoice-type')}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Quick Info Card */}
                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <Icon iconNode={SettingsIcon} className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <h4 className="font-medium text-blue-900 arabic-font">
                                            {t('settings-info-title') || 'Settings Information'}
                                        </h4>
                                        <p className="text-sm text-blue-700 arabic-font">
                                            {t('settings-info-description') || 'These settings will be used across all your invoices and documents.'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <Custommodal modalname={modalRef} message={t('settings-updated-successfully')} />
            <Custommodal modalname={modalService} message={t('service-added-successfully')} />
            <Custommodal modalname={modalInvoiceType} message={t('invoice-type-added-successfully')} />
        </AppLayout>
    );
}
