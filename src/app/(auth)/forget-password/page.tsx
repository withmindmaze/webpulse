'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { AuthLayout } from '@/components/AuthLayout';
import { Button } from '@/components/Button';
import { TextField } from '@/components/Fields';
import supabase from '@/utils/supabaseClient';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRedirection = async () => {
    const { data: user, error } = await supabase.auth.getUser();
    if (user.user?.id) {
      router.back();
    }
  }

  useEffect(() => {
    handleRedirection();
  }, [router]);

  const handleResetAction = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const baseURL = `${window.location.protocol}//${window.location.host}`;

    const { data, error } = await supabase.auth
      .resetPasswordForEmail(email, {
        redirectTo: baseURL
      });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t('toast.reset_password_link'));
    }
    setLoading(false);
  };

  return (
    <AuthLayout
      title={t('forget-password.title')}
      subtitle={
        <>
          {/* {t('signIn.subTitle_p1')}{' '}
          <Link href="/register" className="text-cyan-600">
            {t('signIn.subTitle_p2')}
          </Link>{' '}
          {t('signIn.subTitle_p3')} */}
        </>
      }
    >
      <div className="space-y-2">
        <TextField
          label={t('signIn.label_email')}
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <Button disabled={loading} onClick={handleResetAction} color="cyan" className="mt-8 w-full">
        {loading ? t('forget-password.button_sending_link') : t('forget-password.button_forget_password')}
      </Button>
    </AuthLayout>
  );
}
