
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';



export default function Error({error}:any) {
    const { t } = useTranslation();
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('dashboard'),
            href: '/dashboard',
        },
    ];


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('dashboard')} />
            <div className="flex h-full flex-1 flex-col justify-center items-center p-4">
                
                <h5 className='text-8xl text-center font-bold text-primary' >404</h5>
                <p className='text-center mt-5 text-red-600'>
                {error ? error : ''}

                </p>

            </div>
        </AppLayout>
    );
}
