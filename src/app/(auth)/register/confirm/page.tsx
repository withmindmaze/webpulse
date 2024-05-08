'use client'
import { AuthLayout } from '@/components/AuthLayout';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import 'react-toastify/dist/ReactToastify.css';

export default function Confirm() {
    const { t } = useTranslation();
    const router = useRouter();

    const handleRedirect = () => {
        router.push('/login');
    }

    return (
        <AuthLayout
            title={t('confirmation.heading_congratulations')}
            subtitle={
                <>
                    {t('confirmation.subheading_note')}
                </>
            }
        >
            <div className="text-center p-5">
                <p className="mb-4">{t('confirmation.text_note')}</p>
                <button onClick={handleRedirect} className="bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50">
                    {t('confirmation.button_login')}
                </button>
            </div>

        </AuthLayout>
    );
}
