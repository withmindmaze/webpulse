'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { AuthLayout } from '@/components/AuthLayout';
import { Button } from '@/components/Button';
import { TextField } from '@/components/Fields';
import supabase from '@/utils/supabaseClient';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Confirm() {
    const router = useRouter();

    const handleRedirect = () => {
        router.push('/login');
    }

    return (
        <AuthLayout
            title="Congratulations! "
            subtitle={
                <>
                    Your email address has been successfully verified.
                </>
            }
        >
            <div className="text-center p-5">
                <p className="mb-4">Thank you for confirming your email address. You have successfully completed the verification process and your account is now fully activated.</p>
                <button onClick={handleRedirect} className="bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50">
                    Login
                </button>
            </div>

        </AuthLayout>
    );
}
