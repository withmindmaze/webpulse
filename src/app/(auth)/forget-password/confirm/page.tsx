'use client'
import { AuthLayout } from '@/components/AuthLayout';
import { Button } from '@/components/Button';
import { TextField } from '@/components/Fields';
import supabase from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ForgotPassword() {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const { t } = useTranslation();
  const router = useRouter();

  const handleResetPassword = async (e: any) => {
    setLoading(true);
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error(t('password_mismatch'));
      return;
    }

    const { data, error } = await supabase.auth
      .updateUser({ password: password });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t('toast.password_Reset_success'));
      supabase.auth.signOut();
      router.push('/login');
    }
    setLoading(false);
  };

  return (
    <AuthLayout
      title={t('forget-password.title')}
      subtitle={""}
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
      <Button disabled={loading || password === '' || confirmPassword === ''} onClick={handleResetPassword} color="cyan" className="mt-8 w-full">
        {loading ? t('forget-password.button_resetting_password') : t('forget-password.button_reset_password')}
      </Button>
    </AuthLayout>
  );
}
