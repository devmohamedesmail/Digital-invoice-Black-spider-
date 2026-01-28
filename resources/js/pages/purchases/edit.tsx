import CustomInput from '@/components/custom/CustomInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useTranslation } from 'react-i18next';
import { useRef, useState } from 'react';
import CustomtextArea from '@/components/custom/CustomtextArea';
import Custommodal from '@/components/custom/Custommodal';
import {
    FileText,
    Calculator,
    Save,
    Plus,
    Trash2,
    Building,
    Package,
    Loader2
} from 'lucide-react';

interface PurchaseItem {
    id: string;
    description: string;
    quantity: number;
    unit_price: number;
    total: number;
}

interface Purchase {
    id: number;
    purchase_number: string;
    supplier_name: string;
    supplier_company: string | null;
    supplier_phone: string | null;
    supplier_email: string | null;
    supplier_address: string | null;
    items: PurchaseItem[];
    subtotal: number;
    vat_rate: number;
    vat_amount: number;
    total: number;
    purchase_date: string;
    status: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export default function EditPurchase() {
    const { purchase } = usePage<{ purchase: Purchase }>().props;
    const { t } = useTranslation();
    const [items, setItems] = useState<PurchaseItem[]>(purchase.items || []);
    const [vatRate, setVatRate] = useState(purchase.vat_rate || 15);
    const modalRef = useRef<HTMLDialogElement>(null);
    const { errors: pageErrors } = usePage<any>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('purchases'),
            href: '/purchases',
        },
        {
            title: t('edit-purchase'),
            href: `/purchases/${purchase.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        purchase_number: purchase.purchase_number || '',
        supplier_name: purchase.supplier_name || '',
        supplier_company: purchase.supplier_company || '',
        supplier_phone: purchase.supplier_phone || '',
        supplier_email: purchase.supplier_email || '',
        supplier_address: purchase.supplier_address || '',
        items: JSON.stringify(purchase.items || []),
        subtotal: purchase.subtotal || 0,
        vat_rate: purchase.vat_rate || 15,
        vat_amount: purchase.vat_amount || 0,
        total: purchase.total || 0,
        purchase_date: purchase.purchase_date || new Date().toISOString().split('T')[0],
        status: purchase.status || 'pending',
        notes: purchase.notes || ''
    });

    const addItem = () => {
        const newItem: PurchaseItem = {
            id: Date.now().toString(),
            description: '',
            quantity: 1,
            unit_price: 0,
            total: 0
        };
        const newItems = [...items, newItem];
        setItems(newItems);
        setData('items', JSON.stringify(newItems));
    };

    const removeItem = (itemId: string) => {
        if (items.length > 1) {
            const newItems = items.filter(item => item.id !== itemId);
            setItems(newItems);
            setData('items', JSON.stringify(newItems));
            calculateTotals(newItems);
        }
    };

    const updateItem = (itemId: string, field: keyof PurchaseItem, value: any) => {
        const updatedItems = items.map(item => {
            if (item.id === itemId) {
                const updatedItem = { ...item, [field]: value };
                if (field === 'quantity' || field === 'unit_price') {
                    updatedItem.total = updatedItem.quantity * updatedItem.unit_price;
                }
                return updatedItem;
            }
            return item;
        });
        
        setItems(updatedItems);
        setData('items', JSON.stringify(updatedItems));
        calculateTotals(updatedItems);
    };

    const calculateTotals = (itemsArray: PurchaseItem[]) => {
        const subtotal = itemsArray.reduce((sum, item) => sum + item.total, 0);
        const vat_amount = (subtotal * vatRate) / 100;
        const total = subtotal + vat_amount;
        
        setData(prevData => ({
            ...prevData,
            subtotal: subtotal,
            vat_amount: vat_amount,
            total: total,
            vat_rate: vatRate
        }));
    };

    const handleVatRateChange = (newVatRate: number) => {
        setVatRate(newVatRate);
        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const vat_amount = (subtotal * newVatRate) / 100;
        const total = subtotal + vat_amount;
        
        setData(prevData => ({
            ...prevData,
            subtotal: subtotal,
            vat_amount: vat_amount,
            total: total,
            vat_rate: newVatRate
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        console.log('Form data before submit:', data);
        console.log('Items before JSON conversion:', items);
        
        // Use router.put with the transformed data
        router.put(route('purchases.update', purchase.id), {
            ...data,
            items: JSON.stringify(items),
            vat_amount: data.vat_amount || 0
        }, {
            preserveScroll: true,
            preserveState: false,
            onSuccess: () => {
                console.log('Purchase updated successfully!');
                if (modalRef.current) {
                    modalRef.current.showModal();
                }
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
            }
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ar-SA', {
            style: 'currency',
            currency: 'SAR',
        }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('edit-purchase')} />
            
            <div className="space-y-6 p-6">
                {/* Error Display */}
                {(Object.keys(errors).length > 0 || Object.keys(pageErrors || {}).length > 0) && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h3 className="text-red-800 font-medium mb-2">{t('validation-errors')}</h3>
                        <ul className="text-red-700 text-sm space-y-1">
                            {Object.entries(errors).map(([key, error]) => (
                                <li key={key}>• {key}: {error}</li>
                            ))}
                            {Object.entries(pageErrors || {}).map(([key, error]) => (
                                <li key={`page-${key}`}>• {key}: {String(error)}</li>
                            ))}
                        </ul>
                    </div>
                )}
                
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 arabic-font">{t('edit-purchase')}</h1>
                        <p className="text-gray-600 mt-1 arabic-font">{t('edit-purchase-description')}</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href={`/purchases/${purchase.id}`}>
                            <Button variant="outline" className="arabic-font">
                                {t('cancel')}
                            </Button>
                        </Link>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Purchase Order Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 arabic-font">
                                <FileText className="h-5 w-5" />
                                {t('purchase-information')}
                            </CardTitle>
                            <CardDescription className="arabic-font">
                                {t('enter-basic-purchase-details')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CustomInput
                                    label={t('purchase-number')}
                                    type="text"
                                    placeholder={t('enter-purchase-number')}
                                    value={data.purchase_number}
                                    onChange={(e: any) => setData('purchase_number', e.target.value)}
                                    error={errors.purchase_number}
                                />

                                <CustomInput
                                    label={t('purchase-date')}
                                    type="date"
                                    value={data.purchase_date}
                                    onChange={(e: any) => setData('purchase_date', e.target.value)}
                                    error={errors.purchase_date}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="arabic-font">{t('order-status')}</Label>
                                <Select value={data.status?.toString()} onValueChange={(value) => setData('status', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('select-purchase-status')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">{t('pending')}</SelectItem>
                                        <SelectItem value="completed">{t('completed')}</SelectItem>
                                        <SelectItem value="cancelled">{t('cancelled')}</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && <p className="text-red-600 text-xs">{errors.status}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Supplier Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 arabic-font">
                                <Building className="h-5 w-5" />
                                {t('supplier-information')}
                            </CardTitle>
                            <CardDescription className="arabic-font">
                                {t('enter-supplier-contact-details')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CustomInput
                                    label={t('supplier-name')}
                                    type="text"
                                    placeholder={t('enter-supplier-name')}
                                    value={data.supplier_name}
                                    onChange={(e: any) => setData('supplier_name', e.target.value)}
                                    error={errors.supplier_name}
                                />

                                <CustomInput
                                    label={t('supplier-company')}
                                    type="text"
                                    placeholder={t('enter-supplier-company')}
                                    value={data.supplier_company}
                                    onChange={(e: any) => setData('supplier_company', e.target.value)}
                                    error={errors.supplier_company}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CustomInput
                                    label={t('supplier-phone')}
                                    type="text"
                                    placeholder={t('enter-supplier-phone')}
                                    value={data.supplier_phone}
                                    onChange={(e: any) => setData('supplier_phone', e.target.value)}
                                    error={errors.supplier_phone}
                                />

                                <CustomInput
                                    label={t('supplier-email')}
                                    type="email"
                                    placeholder={t('enter-supplier-email')}
                                    value={data.supplier_email}
                                    onChange={(e: any) => setData('supplier_email', e.target.value)}
                                    error={errors.supplier_email}
                                />
                            </div>

                            <CustomInput
                                label={t('supplier-address')}
                                type="text"
                                placeholder={t('enter-supplier-address')}
                                value={data.supplier_address}
                                onChange={(e: any) => setData('supplier_address', e.target.value)}
                                error={errors.supplier_address}
                            />
                        </CardContent>
                    </Card>

                    {/* Items Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 arabic-font">
                                <Package className="h-5 w-5" />
                                {t('order-items')}
                            </CardTitle>
                            <CardDescription className="arabic-font">
                                {t('add-items-to-purchase-order')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {items.map((item, index) => (
                                <div key={item.id} className="space-y-4 p-4 border rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium arabic-font">{t('item')} {index + 1}</h4>
                                        {items.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removeItem(item.id)}
                                                className="text-red-600 hover:text-red-700 arabic-font"
                                            >
                                                <Trash2 className="h-4 w-4 mr-1" />
                                                {t('remove-item')}
                                            </Button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="md:col-span-2">
                                            <Label className="arabic-font">{t('item-description')}</Label>
                                            <Input
                                                placeholder={t('enter-description')}
                                                value={item.description}
                                                onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <Label className="arabic-font">{t('quantity')}</Label>
                                            <Input
                                                type="number"
                                                placeholder={t('enter-quantity')}
                                                value={item.quantity}
                                                onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                            />
                                        </div>

                                        <div>
                                            <Label className="arabic-font">{t('unit-price')}</Label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder={t('enter-unit-price')}
                                                value={item.unit_price}
                                                onChange={(e) => updateItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <div className="text-right">
                                            <Label className="text-sm text-gray-600 arabic-font">{t('item-total')}</Label>
                                            <div className="text-lg font-semibold">{formatCurrency(item.total)}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <Button
                                type="button"
                                variant="outline"
                                onClick={addItem}
                                className="w-full arabic-font"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                {t('add-item')}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Pricing Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 arabic-font">
                                <Calculator className="h-5 w-5" />
                                {t('pricing-summary')}
                            </CardTitle>
                            <CardDescription className="arabic-font">
                                {t('review-pricing-calculations')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="arabic-font">{t('purchase-subtotal')}</span>
                                    <span className="font-semibold">{formatCurrency(data.subtotal as number || 0)}</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="arabic-font">{t('vat-rate')}</span>
                                        <Select value={vatRate.toString()} onValueChange={(value) => handleVatRateChange(parseInt(value))}>
                                            <SelectTrigger className="w-24">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="0">0%</SelectItem>
                                                <SelectItem value="5">5%</SelectItem>
                                                <SelectItem value="15">15%</SelectItem>
                                                <SelectItem value="20">20%</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <span className="font-semibold">{formatCurrency(data.vat_amount as number || 0)}</span>
                                </div>

                                <Separator />

                                <div className="flex justify-between items-center text-lg font-bold">
                                    <span className="arabic-font">{t('final-total')}</span>
                                    <span>{formatCurrency(data.total as number || 0)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notes */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 arabic-font">
                                <FileText className="h-5 w-5" />
                                {t('notes')}
                            </CardTitle>
                            <CardDescription className="arabic-font">
                                {t('additional-purchase-notes')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CustomtextArea
                                label={t('notes')}
                                value={data.notes}
                                onChange={(e: any) => setData('notes', e.target.value)}
                                error={errors.notes}
                            />
                        </CardContent>
                    </Card>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end gap-3 pt-6">
                        <Link href={`/purchases/${purchase.id}`}>
                            <Button type="button" variant="outline" className="arabic-font">
                                {t('cancel')}
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing} className="arabic-font">
                            {processing ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    {t('processing')}
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    {t('update-purchase')}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
                
                {/* Success Modal */}
                <Custommodal modalname={modalRef} message={t('purchase-updated-successfully')} />
            </div>
        </AppLayout>
    );
}
