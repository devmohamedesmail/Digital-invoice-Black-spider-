import CustomInput from '@/components/custom/CustomInput';
import Custommodal from '@/components/custom/Custommodal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/react'
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

export default function TermsAndConditions({ settings }: any) {
  

    const { notes }: any = usePage().props;


    const modalRef = useRef<HTMLDialogElement>(null);
    const { t,i18n } = useTranslation();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('terms-conditions'),
            href: '/dashboard',
        },
    ];

    const { data, setData, post, processing, errors } = useForm({
        note: notes.note,


    })

    const add_terms_conditions = (e: any) => {
        e.preventDefault()
        post(route('terms.conditions.store'), {
            onSuccess: () => {
                if (modalRef.current) {
                    modalRef.current.showModal();
                }
            },
        })
    }



    const modules: Record<string, any> = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['image', 'code-block'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'direction': 'rtl' }],     // 👈 Adds RTL/LTR direction toggle
            [{ 'align': [] }],            // 👈 Adds text alignment (left, center, right, justify)
            ['clean']                     // Remove formatting
        ],
    };


    const formats = [
        'header',
        'bold',
        'italic',
        'underline',
        'image',
        'code-block',
        'list',
        'bullet',
        'direction',
        'align',
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('terms-conditions')} />
            <div className="flex  flex-col gap-4 rounded-xl p-4">
                <form onSubmit={add_terms_conditions} >
                    <div>
                        <h5 className='text-center font-bold arabic-font'>{t('terms-conditions')}</h5>
                        <div className='my-10'>
                            <ReactQuill
                                modules={modules}
                                formats={formats}
                                theme="snow"
                                value={data.note}
                                onChange={(content) => setData('note', content)}
                                style={{ height: '300px' }}

                            />
                        </div>
                        <div className='flex justify-center items-center mt-40'>
                            <Button>{t('save')}</Button>

                        </div>
                    </div>
                </form>

            </div>

           



            <Custommodal modalname={modalRef} message={t('added')} />



        </AppLayout>
    );
}
