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
    Plus, 
    FileText, 
    Search,
    Calendar,
    User,
    Phone,
    ShoppingCart,
    Receipt,
    DollarSign,
    Eye,
    TrendingUp,
    Package,
    Clock
} from 'lucide-react';

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

DataTable.use(DT);
DataTable.use(Buttons);

interface Purchase {
    id: number;
    purchase_number: string;
    supplier_name: string;
    supplier_company: string;
    supplier_phone: string;
    supplier_email: string;
    subtotal: number;
    vat: number;
    total: number;
    purchase_date: string;
    status: string;
    notes: string;
    items: any[];
    created_at: string;
    updated_at: string;
}

interface PurchaseStats {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
    today: number;
    this_month: number;
    total_amount: number;
    monthly_total: number;
}

export default function PurchasesIndex() {
    const { purchases, stats } = usePage<{ purchases: Purchase[], stats: PurchaseStats }>().props;
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('purchases'),
            href: '/purchases',
        },
    ];

    const handleDeletePurchase = (purchaseId: number) => {
        if (confirm(t('confirm-delete-purchase'))) {
            router.delete(`/purchases/${purchaseId}`, {
                onSuccess: () => {
                    // Handle success - maybe show a toast notification
                }
            });
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { variant: 'outline' as const, color: 'text-yellow-600', icon: Clock },
            completed: { variant: 'default' as const, color: 'text-green-600', icon: Package },
            cancelled: { variant: 'destructive' as const, color: 'text-red-600', icon: Trash2 },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
        const StatusIcon = config.icon;

        return (
            <Badge variant={config.variant} className="flex items-center gap-1">
                <StatusIcon className="h-3 w-3" />
                {t(status)}
            </Badge>
        );
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ar-SA', {
            style: 'currency',
            currency: 'SAR',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const tableColumns = [
        {
            title: t('purchase-number'),
            data: 'purchase_number',
            render: (data: string, type: string, row: Purchase) => {
                if (type === 'display') {
                    return `<div class="font-medium">${data}</div>`;
                }
                return data;
            }
        },
        {
            title: t('supplier'),
            data: 'supplier_name',
            render: (data: string, type: string, row: Purchase) => {
                if (type === 'display') {
                    return `
                        <div class="space-y-1">
                            <div class="font-medium">${data}</div>
                            <div class="text-sm text-gray-500">${row.supplier_company || ''}</div>
                        </div>
                    `;
                }
                return data;
            }
        },
        {
            title: t('date'),
            data: 'purchase_date',
            render: (data: string, type: string, row: Purchase) => {
                if (type === 'display') {
                    return formatDate(data);
                }
                return data;
            }
        },
        {
            title: t('total'),
            data: 'total',
            render: (data: number, type: string, row: Purchase) => {
                if (type === 'display') {
                    return `<div class="font-medium">${formatCurrency(data)}</div>`;
                }
                return data;
            }
        },
        {
            title: t('status'),
            data: 'status',
            render: (data: string, type: string, row: Purchase) => {
                if (type === 'display') {
                    const badge = getStatusBadge(data);
                    return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        data === 'completed' ? 'bg-green-100 text-green-800' :
                        data === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                    }">${data.charAt(0).toUpperCase() + data.slice(1)}</span>`;
                }
                return data;
            }
        },
        {
            title: t('actions'),
            data: null,
            orderable: false,
            render: (data: any, type: string, row: Purchase) => {
                if (type === 'display') {
                    return `
                        <div class="flex items-center gap-2">
                            <a href="/purchases/${row.id}" class="inline-flex items-center justify-center h-8 w-8 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50">
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                            </a>
                            <a href="/purchases/${row.id}/edit" class="inline-flex items-center justify-center h-8 w-8 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50">
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                            </a>
                            <button onclick="deletePurchase(${row.id})" class="inline-flex items-center justify-center h-8 w-8 rounded-md border border-gray-200 bg-white text-red-600 hover:bg-red-50">
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </button>
                        </div>
                    `;
                }
                return '';
            }
        }
    ];

    React.useEffect(() => {
        // Add global delete function
        (window as any).deletePurchase = handleDeletePurchase;
        
        return () => {
            delete (window as any).deletePurchase;
        };
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Purchases" />
            
            <div className="space-y-6 p-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 arabic-font">{t('purchases')}</h1>
                        <p className="text-gray-600 mt-1 arabic-font">{t('manage-purchases-description')}</p>
                    </div>
                    <Link href="/purchases/create">
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            <span className="arabic-font">{t('create-purchase')}</span>
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium arabic-font">{t('total-purchases')}</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground arabic-font">
                                {stats.today} {t('today')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium arabic-font">{t('pending-orders')}</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending}</div>
                            <p className="text-xs text-muted-foreground arabic-font">
                                {t('awaiting-processing')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium arabic-font">{t('monthly-total')}</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.monthly_total)}</div>
                            <p className="text-xs text-muted-foreground arabic-font">
                                {stats.this_month} {t('purchases-this-month')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium arabic-font">{t('all-time-total')}</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.total_amount)}</div>
                            <p className="text-xs text-muted-foreground arabic-font">
                                {t('total-purchase-value')}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Purchases Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 arabic-font">
                            <FileText className="h-5 w-5" />
                            {t('purchase-orders')}
                        </CardTitle>
                        <CardDescription className="arabic-font">
                            {t('view-manage-purchase-orders')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-hidden">
                            <DataTable
                                data={purchases}
                                columns={tableColumns}
                                options={{
                                    responsive: true,
                                    pageLength: 10,
                                    ordering: true,
                                    searching: true,
                                    dom: 'Bfrtip',
                                    buttons: [
                                        {
                                            extend: 'copy',
                                            text: t('copy'),
                                            className: 'btn btn-sm btn-outline-secondary me-2'
                                        },
                                        {
                                            extend: 'csv',
                                            text: 'CSV',
                                            className: 'btn btn-sm btn-outline-secondary me-2'
                                        },
                                        {
                                            extend: 'excel',
                                            text: 'Excel',
                                            className: 'btn btn-sm btn-outline-secondary me-2'
                                        },
                                        {
                                            extend: 'pdf',
                                            text: 'PDF',
                                            className: 'btn btn-sm btn-outline-secondary me-2'
                                        },
                                        {
                                            extend: 'print',
                                            text: t('print'),
                                            className: 'btn btn-sm btn-outline-secondary'
                                        }
                                    ],
                                    language: {
                                        search: "",
                                        searchPlaceholder: t('search-purchases'),
                                        lengthMenu: `_MENU_ ${t('purchases-per-page')}`,
                                        info: `${t('showing')} _START_ ${t('to')} _END_ ${t('of')} _TOTAL_ ${t('purchases')}`,
                                        infoEmpty: t('no-purchases-found'),
                                        infoFiltered: `(${t('filtered-from-total')})`,
                                        zeroRecords: t('no-matching-purchases'),
                                        emptyTable: t('no-purchases-available')
                                    },
                                    initComplete: function(settings: any, json: any) {
                                        // Add custom styling to search input
                                        const searchInput = document.querySelector('.dataTables_filter input');
                                        if (searchInput) {
                                            searchInput.setAttribute('class', 'form-control form-control-sm');
                                            searchInput.setAttribute('placeholder', 'Search purchases...');
                                        }
                                    }
                                }}
                                className="display responsive nowrap w-100"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
