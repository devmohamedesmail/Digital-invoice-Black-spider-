import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@/components/ui/icon';
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { 
    Edit, 
    Trash2, 
    Printer, 
    FileText, 
    Download,
    Copy,
    Building,
    Phone,
    Mail,
    MapPin,
    Calendar,
    User,
    Package,
    DollarSign,
    Hash,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle
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
    supplier_company: string;
    supplier_phone: string;
    supplier_email: string;
    supplier_address: string;
    items: PurchaseItem[] | string;
    subtotal: number;
    vat_rate: number;
    vat_amount: number;
    total: number;
    purchase_date: string;
    status: string;
    notes: string;
    created_at: string;
    updated_at: string;
}

export default function ShowPurchase() {
    const { purchase } = usePage<{ purchase: Purchase }>().props;
    const { t } = useTranslation();

    // Helper function to safely parse items
    const getPurchaseItems = (items: PurchaseItem[] | string): PurchaseItem[] => {
        if (!items) return [];
        if (typeof items === 'string') {
            try {
                return JSON.parse(items);
            } catch (e) {
                console.error('Failed to parse items:', e);
                return [];
            }
        }
        return Array.isArray(items) ? items : [];
    };

    const parsedItems = getPurchaseItems(purchase.items);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('purchases'),
            href: '/purchases',
        },
        {
            title: purchase.purchase_number || 'Purchase',
            href: `/purchases/${purchase.id}`,
        },
    ];

    const handleDeletePurchase = () => {
        if (confirm(t('confirm-delete-purchase'))) {
            router.delete(`/purchases/${purchase.id}`, {
                onSuccess: () => {
                    router.visit('/purchases');
                }
            });
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { 
                variant: 'outline' as const, 
                color: 'text-yellow-600 bg-yellow-50 border-yellow-200', 
                icon: Clock 
            },
            completed: { 
                variant: 'default' as const, 
                color: 'text-green-600 bg-green-50 border-green-200', 
                icon: CheckCircle 
            },
            cancelled: { 
                variant: 'destructive' as const, 
                color: 'text-red-600 bg-red-50 border-red-200', 
                icon: XCircle 
            },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
        const StatusIcon = config.icon;

        return (
            <Badge className={`flex items-center gap-1 ${config.color}`}>
                <StatusIcon className="h-3 w-3" />
                {t(status)}
            </Badge>
        );
    };

    const formatCurrency = (amount: number | undefined | null) => {
        if (amount === undefined || amount === null || isNaN(amount)) {
            return new Intl.NumberFormat('ar-SA', {
                style: 'currency',
                currency: 'SAR',
            }).format(0);
        }
        return new Intl.NumberFormat('ar-SA', {
            style: 'currency',
            currency: 'SAR',
        }).format(amount);
    };

    const formatDate = (dateString: string | undefined | null) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch (e) {
            return 'Invalid Date';
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Purchase Order ${purchase.purchase_number || 'N/A'}`} />
            
            <div className="space-y-6 p-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 arabic-font">{t('purchase')} #{purchase.purchase_number || 'N/A'}</h1>
                        <p className="text-gray-600 mt-1 arabic-font">{t('view-manage-purchase-details')}</p>
                    </div>
                    <div className="flex gap-3">
                        <Button 
                            variant="outline" 
                            onClick={handlePrint}
                            className="flex items-center gap-2"
                        >
                            <Printer className="h-4 w-4" />
                            Print
                        </Button>
                        <Link href={`/purchases/${purchase.id}/edit`}>
                            <Button variant="outline" className="flex items-center gap-2">
                                <Edit className="h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                        <Button 
                            variant="destructive" 
                            onClick={handleDeletePurchase}
                            className="flex items-center gap-2"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Purchase Order Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Purchase Order Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Hash className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-500">Purchase Number</p>
                                                <p className="font-medium">{purchase.purchase_number || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-500">Purchase Date</p>
                                                <p className="font-medium">{purchase.purchase_date ? formatDate(purchase.purchase_date) : 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Hash className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-500">Purchase ID</p>
                                                <p className="font-medium">#{purchase.id}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <AlertCircle className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-500">Status</p>
                                                <div className="mt-1">
                                                    {getStatusBadge(purchase.status || 'pending')}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-500">Total Amount</p>
                                                <p className="font-bold text-lg">{formatCurrency(purchase.total)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Supplier Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building className="h-5 w-5" />
                                    Supplier Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Supplier Name</p>
                                            <p className="font-medium">{purchase.supplier_name || 'N/A'}</p>
                                        </div>
                                        {purchase.supplier_company && (
                                            <div>
                                                <p className="text-sm text-gray-500">Company</p>
                                                <p className="font-medium">{purchase.supplier_company}</p>
                                            </div>
                                        )}
                                        {purchase.supplier_phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-gray-500" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Phone</p>
                                                    <p className="font-medium">{purchase.supplier_phone}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        {purchase.supplier_email && (
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-gray-500" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Email</p>
                                                    <p className="font-medium">{purchase.supplier_email}</p>
                                                </div>
                                            </div>
                                        )}
                                        {purchase.supplier_address && (
                                            <div className="flex items-start gap-2">
                                                <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Address</p>
                                                    <p className="font-medium whitespace-pre-line">{purchase.supplier_address}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Purchase Items */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Purchase Items
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-3 px-2">Description</th>
                                                <th className="text-right py-3 px-2">Quantity</th>
                                                <th className="text-right py-3 px-2">Unit Price</th>
                                                <th className="text-right py-3 px-2">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {parsedItems.map((item: PurchaseItem, index: number) => (
                                                <tr key={index} className="border-b">
                                                    <td className="py-3 px-2">
                                                        <div className="font-medium">{item?.description || 'N/A'}</div>
                                                    </td>
                                                    <td className="text-right py-3 px-2">{item?.quantity || 0}</td>
                                                    <td className="text-right py-3 px-2">{formatCurrency(item?.unit_price || 0)}</td>
                                                    <td className="text-right py-3 px-2 font-medium">{formatCurrency(item?.total || 0)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                
                                <Separator className="my-4" />
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span className="font-medium">{formatCurrency(purchase.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>VAT ({purchase.vat_rate || 0}%):</span>
                                        <span className="font-medium">{formatCurrency(purchase.vat_amount)}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total:</span>
                                        <span>{formatCurrency(purchase.total)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notes */}
                        {purchase.notes && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Additional Notes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="whitespace-pre-line">{purchase.notes}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Link href={`/purchases/${purchase.id}/edit`} className="block">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Purchase
                                    </Button>
                                </Link>
                                <Button 
                                    variant="outline" 
                                    className="w-full justify-start"
                                    onClick={handlePrint}
                                >
                                    <Printer className="h-4 w-4 mr-2" />
                                    Print Purchase
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="w-full justify-start"
                                    onClick={() => navigator.clipboard.writeText(window.location.href)}
                                >
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy Link
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Purchase Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Purchase Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{formatCurrency(purchase.total)}</div>
                                    <p className="text-sm text-gray-500">Total Amount</p>
                                </div>
                                <Separator />
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Items:</span>
                                        <span>{parsedItems.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Created:</span>
                                        <span>{purchase.created_at ? formatDate(purchase.created_at) : 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Updated:</span>
                                        <span>{purchase.updated_at ? formatDate(purchase.updated_at) : 'N/A'}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
