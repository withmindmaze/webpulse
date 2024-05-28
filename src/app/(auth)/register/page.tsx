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

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [enableResend, setEnableResend] = useState(false);
  const [email, setEmail] = useState('');
  const { t } = useTranslation();
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
    // check if user has already signup with this email
    const userPlan = await supabase
      .from('user_metadata')
      .select('*')
      .eq('email', email);
    if (userPlan?.data?.length > 0) {
      setLoading(false);
      toast.error(t('toast.signup_already'));
      return;
    }

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
          { user_id: data.user.id, email: data.user.email }
        ]);

      if (planError) {
        console.error('Error creating user plan:', planError);
        setLoading(false);
      } else {
        const { data: user_metadata, error: user_metadata_error } = await supabase
          .from('user_metadata')
          .insert([
            { email: email }
          ]);
        setLoading(false);
        toast.success(t('toast.signup_success'));
        setEnableResend(true);
        // router.push('/login');
      }
    }
    toast.success(t('toast.signup_success'))
    setLoading(false);
    return;
  };

  const handleResendEmail = async () => {
    setLoading(true);
    if (email === '' || password === '') {
      toast.error(t('missing_info'));
      setLoading(false);
      return;
    }
    const baseURL = `${window.location.protocol}//${window.location.host}`;
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${baseURL}/register/confirm`,
      }
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    } else {
      toast.success(t('toast.email_resend'));
      setLoading(false);
      return;
    }
  }

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
        {enableResend === true && (
          <span onClick={handleResendEmail} className="text-[#3bbed9] hover:text-[#3bbed9] focus:outline-none cursor-pointer">
            {t('signUp.resend_email')}
          </span>
        )}
        <Button disabled={loading || email === '' || password === ''} type="submit" color="cyan" className="mt-8 w-full">
          {loading ? t('signUp.button_signing_up') : t('signUp.button_signup')}
        </Button>
      </form>
    </AuthLayout>
  );
}
