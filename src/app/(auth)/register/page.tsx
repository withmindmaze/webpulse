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
import { useTranslation } from 'react-i18next';

export default function Register() {
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

  const handleSignUp = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    const baseURL = `${window.location.protocol}//${window.location.host}`;

    // Sign up the user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: `${baseURL}/register/confirm`,
        data: {
          currentLanguage: localStorage.getItem('language')
        }
      },
    });

    if (signUpError) {
      toast.error(signUpError.message);
      setLoading(false);
      return;
    }

    if (data?.user?.id) {
      const { data: planData, error: planError } = await supabase
        .from('user_plan')
        .insert([
          { user_id: data.user.id }
        ]);

      if (planError) {
        console.error('Error creating user plan:', planError);
      } else {
        console.log('User plan created:', planData);
        setLoading(false);
        toast.success(t('toast.signup_success'))
        router.push('/login');
      }
    }
  };

  return (
    <AuthLayout
      title={t('signUp.title')}
      subtitle={
        <>
          {t('signUp.subTitle_p1')}{' '}
          <Link href="/login" className="text-cyan-600">
            {t('signUp.subTitle_p2')}
          </Link>{' '}
          {t('signUp.subTitle_p3')}
        </>
      }
    >
      <form onSubmit={handleSignUp}>
        <div className="grid grid-cols-2 gap-2">
          <TextField
            className="col-span-full"
            label={t('signUp.label_email')}
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            className="col-span-full"
            label={t('signUp.label_password')}
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button disabled={loading} type="submit" color="cyan" className="mt-8 w-full">
          {loading ? t('signUp.button_signing_up') : t('signUp.button_signup')}
        </Button>
      </form>
    </AuthLayout>
  );
}
