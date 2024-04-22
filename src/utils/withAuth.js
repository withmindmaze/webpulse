import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import supabase from './supabaseClient';

const withAuth = (WrappedComponent) => {
    const allowedForGuestUser = ['/'];

    return (props) => {
        const pathname = usePathname();
        const router = useRouter();
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            // Check if the current path is allowed for guest users
            if (allowedForGuestUser.includes(pathname)) {
                setLoading(false);
                return;
            }
            const getCurrentUser = async () => {
                try {
                    const { data: user, error } = await supabase.auth.getUser();

                    if (error) {
                        throw error;
                    }

                    if (!user) {
                        router.push('/login');
                    } else {
                        setLoading(false);
                    }
                } catch (error) {
                    router.push('/login');
                }
            };
            getCurrentUser();
        }, [router]);

        if (loading) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-gray-100">
                    <div className="text-lg font-semibold text-gray-800">
                        Loading...
                    </div>
                </div>
            );
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;