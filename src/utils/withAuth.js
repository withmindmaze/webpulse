import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import supabase from './supabaseClient';
import { useTranslation } from 'react-i18next';

const withAuth = (WrappedComponent) => {
    const allowedForGuestUser = ['/', '/about', '/faq', '/login', '/register', '/forget-password', '/forget-password/confirm'];

    return (props) => {
        const { t } = useTranslation();
        const pathname = usePathname();
        const router = useRouter();
        const [loading, setLoading] = useState(true);
        const [user, setUser] = useState(null);

        useEffect(() => {
            if (allowedForGuestUser.includes(pathname)) {
                setLoading(false);
                return;
            } else {
                const getCurrentUser = async () => {
                    try {
                        const { data: { user }, error } = await supabase.auth.getUser();

                        if (error) {
                            throw error;
                        }

                        if (!user) {
                            router.push('/login');
                        } else {
                            setUser(user);
                            setLoading(false);
                        }
                    } catch (error) {
                        router.push('/login');
                    }
                };
                getCurrentUser();
            }
        }, [pathname]);

        if (loading) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-gray-100">
                    <div className="text-lg font-semibold text-gray-800">
                        {t('auth.loading')}
                    </div>
                </div>
            );
        }

        return <WrappedComponent {...props} user={user} />;
    };
};

export default withAuth;
