import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from './supabaseClient';

const withAuth = (WrappedComponent) => {

    return (props) => {
        const router = useRouter();
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const getCurrentUser = async () => {
                try {
                    const session = await supabase.auth.getSession();
                    // Guest User
                    if (session.data.session === null) {
                        // create or fetch guest user against ip address
                        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/guest/signup`;
                        try {
                            const response = await fetch(apiUrl, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(),
                            });
                            const data = await response.json();
                            if (data.data.id) {
                                setLoading(false);
                            }
                        } catch (error) {
                            console.error('Error during API call:', error);
                        }
                    } else {
                        const { data: user, error } = await supabase.auth.getUser();

                        if (error) {
                            throw error;
                        }

                        if (!user) {
                            router.push('/login');
                        } else {
                            setLoading(false);
                        }
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