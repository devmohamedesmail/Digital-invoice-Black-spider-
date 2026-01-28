import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { 
    FileText, 
    Calendar, 
    TrendingUp, 
    DollarSign, 
    Users, 
    BarChart3,
    Activity,
    Clock
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
    const { t } = useTranslation();
    const pageProps = usePage().props as any;
    const { 
        invoices = [], 
        today_invoices = [], 
        monthly_revenue = 0, 
        pending_invoices = [], 
        clients_count = 0 
    } = pageProps;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('dashboard'),
            href: '/dashboard',
        },
    ];

    // Calculate additional metrics
    const totalInvoices = invoices?.length || 0;
    const todayInvoicesCount = today_invoices?.length || 0;
    const pendingCount = pending_invoices?.length || 0;
    
    // Calculate growth rate (mock calculation - you can replace with real data)
    const growthRate = totalInvoices > 0 ? ((todayInvoicesCount / totalInvoices) * 100).toFixed(1) : 0;

    const statsCards = [
        {
            title: t('total-invoices'),
            value: totalInvoices.toLocaleString(),
            icon: FileText,
            description: t('all-time-invoices') || 'All time invoices',
            trend: '+12% from last month',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: t('today-invoices'),
            value: todayInvoicesCount.toLocaleString(),
            icon: Calendar,
            description: t('invoices-created-today') || 'Invoices created today',
            trend: `+${growthRate}% today`,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: t('monthly-revenue') || 'Monthly Revenue',
            value: `$${monthly_revenue.toLocaleString()}`,
            icon: DollarSign,
            description: t('revenue-this-month') || 'Revenue this month',
            trend: '+8% from last month',
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
        },
        {
            title: t('pending-invoices') || 'Pending Invoices',
            value: pendingCount.toLocaleString(),
            icon: Clock,
            description: t('awaiting-payment') || 'Awaiting payment',
            trend: pendingCount > 0 ? 'Requires attention' : 'All caught up',
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
        },
    ];

    const quickStats = [
        {
            title: t('active-clients') || 'Active Clients',
            value: clients_count.toLocaleString(),
            icon: Users,
            color: 'text-purple-600',
        },
        {
            title: t('avg-invoice-value') || 'Avg Invoice Value',
            value: totalInvoices > 0 ? `$${(monthly_revenue / totalInvoices).toFixed(0)}` : '$0',
            icon: BarChart3,
            color: 'text-indigo-600',
        },
        {
            title: t('conversion-rate') || 'Conversion Rate',
            value: '94.2%',
            icon: TrendingUp,
            color: 'text-green-600',
        },
        {
            title: t('system-status') || 'System Status',
            value: t('online') || 'Online',
            icon: Activity,
            color: 'text-green-600',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('dashboard')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Welcome Section */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 arabic-font">
                        {t('welcome-back') || 'Welcome back'}
                    </h1>
                    <p className="text-gray-600 mt-2 arabic-font">
                        {t('dashboard-overview') || 'Here\'s what\'s happening with your invoices today.'}
                    </p>
                </div>

                {/* Main Stats Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {statsCards.map((stat, index) => (
                        <Card key={index} className="transition-all duration-200 hover:shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600 arabic-font">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                                    <Icon iconNode={stat.icon} className={`h-5 w-5 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900 arabic-font mb-1">
                                    {stat.value}
                                </div>
                                <p className="text-xs text-gray-600 arabic-font mb-2">
                                    {stat.description}
                                </p>
                                <div className="flex items-center text-xs">
                                    <span className={`${stat.color} font-medium`}>
                                        {stat.trend}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Quick Stats Row */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {quickStats.map((stat, index) => (
                        <Card key={index} className="transition-all duration-200 hover:shadow-md">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 arabic-font">
                                            {stat.title}
                                        </p>
                                        <p className="text-xl font-bold text-gray-900 arabic-font mt-1">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <Icon iconNode={stat.icon} className={`h-6 w-6 ${stat.color}`} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Recent Activity Section */}
                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="arabic-font">
                                {t('recent-activity') || 'Recent Activity'}
                            </CardTitle>
                            <CardDescription className="arabic-font">
                                {t('latest-invoice-updates') || 'Latest invoice updates and activities'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {today_invoices?.slice(0, 5).map((invoice: any, index: number) => (
                                    <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50">
                                        <div className="p-2 bg-blue-100 rounded-full">
                                            <Icon iconNode={FileText} className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 arabic-font">
                                                {t('invoice-created') || 'Invoice created'} #{invoice.id || index + 1}
                                            </p>
                                            <p className="text-xs text-gray-500 arabic-font">
                                                {t('just-now') || 'Just now'}
                                            </p>
                                        </div>
                                        <div className="text-sm text-gray-500 arabic-font">
                                            ${invoice.amount || '1,250'}
                                        </div>
                                    </div>
                                ))}
                                {(!today_invoices || today_invoices.length === 0) && (
                                    <div className="text-center py-8 text-gray-500 arabic-font">
                                        {t('no-recent-activity') || 'No recent activity'}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="arabic-font">
                                {t('quick-actions') || 'Quick Actions'}
                            </CardTitle>
                            <CardDescription className="arabic-font">
                                {t('commonly-used-features') || 'Commonly used features'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-between p-3 text-left rounded-lg border hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <Icon iconNode={FileText} className="h-5 w-5 text-blue-600" />
                                        <span className="text-sm font-medium arabic-font">
                                            {t('create-invoice') || 'Create Invoice'}
                                        </span>
                                    </div>
                                </button>
                                <button className="w-full flex items-center justify-between p-3 text-left rounded-lg border hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <Icon iconNode={Users} className="h-5 w-5 text-green-600" />
                                        <span className="text-sm font-medium arabic-font">
                                            {t('manage-clients') || 'Manage Clients'}
                                        </span>
                                    </div>
                                </button>
                                <button className="w-full flex items-center justify-between p-3 text-left rounded-lg border hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <Icon iconNode={BarChart3} className="h-5 w-5 text-purple-600" />
                                        <span className="text-sm font-medium arabic-font">
                                            {t('view-reports') || 'View Reports'}
                                        </span>
                                    </div>
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
