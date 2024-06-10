'use client'
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

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
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

  const handleResetAction = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const redirectTo = `${window.location.protocol}//${window.location.host}/forget-password/confirm`;

    const { data, error } = await supabase.auth
      .resetPasswordForEmail(email, { redirectTo });

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
      subtitle={""}
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
      <Button disabled={loading || email === ''} onClick={handleResetAction} color="cyan" className="mt-8 w-full">
        {loading ? t('forget-password.button_sending_link') : t('forget-password.button_forget_password')}
      </Button>
    </AuthLayout>
  );
}

export default withAuth(ForgotPassword)