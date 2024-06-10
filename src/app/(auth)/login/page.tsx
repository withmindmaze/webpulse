//@ts-nocheck
'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AuthLayout } from '@/components/AuthLayout';
import { Button } from '@/components/Button';
import { TextField } from '@/components/Fields';
import supabase from '@/utils/supabaseClient';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import withAuth from '@/utils/withAuth';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const { t } = useTranslation();
  const router = useRouter();

  const handleLogin = async (e: any) => {
    e.preventDefault();  // Prevent the form from submitting traditionally
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t('toast.logged_in_success'));
      router.push('/');
    }
    setLoading(false);
  };

  return (
    <AuthLayout
      title={t('signIn.title')}
      subtitle={
        <>
          {t('signIn.subTitle_p1')}{' '}
          <Link href="/register" className="text-cyan-600">
            {t('signIn.subTitle_p2')}
          </Link>{' '}
          {t('signIn.subTitle_p3')}
        </>
      }
    >
      <form onSubmit={handleLogin} className="space-y-6">
        <TextField
          label={t('signIn.label_email')}
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label={t('signIn.label_password')}
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Link href="/forget-password" className="text-[#3bbed9]">
          {t('signIn.text_forgot_password')}
        </Link>
        <Button type="submit" disabled={loading || email === '' || password === ''} color="cyan" className="mt-8 w-full">
          {loading ? t('signIn.button_signing_in') : t('signIn.button_signin')}
        </Button>
      </form>
    </AuthLayout>
  );
}

export default withAuth(Login);
