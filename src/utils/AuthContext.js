'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from './supabaseClient';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const { data: user, error } = await supabase.auth.getUser();
            if (error) {
                console.error('Error fetching user:', error.message);
            }
            setUser(user || null);
            setLoading(false);
        };

        checkUser();
    }, []);

    useEffect(() => {
        const { pathname } = router;
        const allowedForGuestUser = ['/', '/about', '/faq', '/login', '/register', '/forget-password', '/forget-password/confirm'];

        if (!allowedForGuestUser.includes(pathname) && !user) {
            router.push('/login');
        }
    }, [router, user]);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
