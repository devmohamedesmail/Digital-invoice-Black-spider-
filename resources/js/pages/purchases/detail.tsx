import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { 
    Edit, 
    Trash2, 
    FileText, 
    Building,
    Phone,
    Mail,
    MapPin,
    Calendar,
    Package,
    Receipt,
    DollarSign,
    ArrowLeft,
    Eye,
    Clock,
    CheckCircle,
    XCircle
} from 'lucide-react';

interface Purchase {
    id: number;
    purchase_number: string;
    supplier_name: string;
    supplier_company: string;
    supplier_phone: string;
    supplier_email: string;
    supplier_address: string;
    subtotal: number;
    vat: number;
    vat_rate: number;
    total: number;
    purchase_date: string;
    status: string;
    notes: string;
    items: any[];
    created_at: string;
    updated_at: string;
    user?: {
        name: string;
        email: string;
    };
}

export default function ShowPurchase() {
    const { purchase } = usePage<{ purchase: Purchase }>().props;
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('purchases') || 'Purchases',
            href: '/purchases',
        },
        {
            title: purchase.purchase_number,
            href: `/purchases/${purchase.id}`,
        },
    ];

    const handleDelete = () => {
        if (confirm(t('confirm-delete-purchase') || 'Are you sure you want to delete this purchase?')) {
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
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${config.color}`}>
                <StatusIcon className="h-4 w-4" />
                <span className="text-sm font-medium">
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
            </div>
        );
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Purchase ${purchase.purchase_number}`} />
            
            <div className="space-y-6 p-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/purchases">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                {t('back') || 'Back'}
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {t('purchase-order') || 'Purchase Order'} {purchase.purchase_number}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {t('purchase-details') || 'Purchase order details and information'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {getStatusBadge(purchase.status)}
                        <Link href={`/purchases/${purchase.id}/edit`}>
                            <Button variant="outline" className="flex items-center gap-2">
                                <Edit className="h-4 w-4" />
                                {t('edit') || 'Edit'}
                            </Button>
                        </Link>
                        <Button 
                            variant="destructive" 
                            onClick={handleDelete}
                            className="flex items-center gap-2"
                        >
                            <Trash2 className="h-4 w-4" />
                            {t('delete') || 'Delete'}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Purchase Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    {t('purchase-information') || 'Purchase Information'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            {t('purchase-number') || 'Purchase Number'}
                                        </label>
                                        <p className="font-medium">{purchase.purchase_number}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            {t('purchase-date') || 'Purchase Date'}
                                        </label>
                                        <p className="font-medium">{formatDate(purchase.purchase_date)}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            {t('status') || 'Status'}
                                        </label>
                                        <div className="mt-1">
                                            {getStatusBadge(purchase.status)}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            {t('created-by') || 'Created By'}
                                        </label>
                                        <p className="font-medium">{purchase.user?.name || 'Unknown'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Items */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    {t('items') || 'Items'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {purchase.items && purchase.items.length > 0 ? (
                                        purchase.items.map((item: any, index: number) => (
                                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div className="flex-1">
                                                    <h4 className="font-medium">{item.description}</h4>
                                                    <p className="text-sm text-gray-500">
                                                        {t('quantity') || 'Quantity'}: {item.quantity} × {formatCurrency(item.unit_price)}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold">{formatCurrency(item.total)}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-8">
                                            {t('no-items') || 'No items found'}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notes */}
                        {purchase.notes && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('notes') || 'Notes'}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 whitespace-pre-wrap">{purchase.notes}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Supplier Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building className="h-5 w-5" />
                                    {t('supplier-information') || 'Supplier Information'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        {t('supplier-name') || 'Supplier Name'}
                                    </label>
                                    <p className="font-medium">{purchase.supplier_name}</p>
                                </div>
                                
                                {purchase.supplier_company && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            {t('company') || 'Company'}
                                        </label>
                                        <p className="font-medium">{purchase.supplier_company}</p>
                                    </div>
                                )}

                                {purchase.supplier_phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        <span>{purchase.supplier_phone}</span>
                                    </div>
                                )}

                                {purchase.supplier_email && (
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <span>{purchase.supplier_email}</span>
                                    </div>
                                )}

                                {purchase.supplier_address && (
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                                        <span className="text-sm">{purchase.supplier_address}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Purchase Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Receipt className="h-5 w-5" />
                                    {t('purchase-summary') || 'Purchase Summary'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">{t('subtotal') || 'Subtotal'}:</span>
                                    <span className="font-medium">{formatCurrency(purchase.subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">{t('vat') || 'VAT'} ({purchase.vat_rate}%):</span>
                                    <span className="font-medium">{formatCurrency(purchase.vat)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>{t('total') || 'Total'}:</span>
                                    <span>{formatCurrency(purchase.total)}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Purchase Dates */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    {t('important-dates') || 'Important Dates'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        {t('purchase-date') || 'Purchase Date'}
                                    </label>
                                    <p className="font-medium">{formatDate(purchase.purchase_date)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        {t('created-at') || 'Created At'}
                                    </label>
                                    <p className="font-medium">{formatDate(purchase.created_at)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        {t('last-updated') || 'Last Updated'}
                                    </label>
                                    <p className="font-medium">{formatDate(purchase.updated_at)}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
