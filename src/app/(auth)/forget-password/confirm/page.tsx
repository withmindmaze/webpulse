'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthLayout } from '@/components/AuthLayout';
import { Button } from '@/components/Button';
import { TextField } from '@/components/Fields';
import supabase from '@/utils/supabaseClient';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const searchParams = useSearchParams();
  const access_token = searchParams.get('access_token');

  const validateAccessToken = async () => {
    if (!access_token) {
      // router.push('/forget-password');
    }

    try {
      const { data, error } = await supabase.auth.getUser(access_token);
      if (error || !data) {
        toast.error(error);
      }
      console.log(data);
      setUser(data.user);
    } catch (error) {
      toast.error("Invalid access token");
      // router.push('/forget-password');
    }
  };

  useEffect(() => {
    validateAccessToken();
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error(t('password_mismatch'));
      return;
    }
    setLoading(true);

    const { data, error } = await supabase.auth
      .updateUser({ password: password });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t('toast.password_Reset_success'));
      router.push('/login');
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
      <div className="space-y-4">
        <TextField
          label={t('forget-password.label_password')}
          name="password"
          type="password"
          autoComplete="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          label={t('forget-password.label_confirm_password')}
          name="confirmPassword"
          type="password"
          autoComplete="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <Button disabled={loading} onClick={handleResetPassword} color="cyan" className="mt-8 w-full">
        {loading ? t('forget-password.button_resetting_password') : t('forget-password.button_reset_password')}
      </Button>
    </AuthLayout>
  );
}
