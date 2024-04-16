'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { AuthLayout } from '@/components/AuthLayout';
import { Button } from '@/components/Button';
import { TextField } from '@/components/Fields';
import supabase from '@/utils/supabaseClient';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignUp = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Sign up the user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_API_BASE_UR}/login`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user.id) {
      const { data: planData, error: planError } = await supabase
        .from('user_plan')
        .insert([
          { user_id: data.user.id }
        ]);

      if (planError) {
        console.error('Error creating user plan:', planError);
        setError(planError.message);
      } else {
        console.log('User plan created:', planData);
        setLoading(false);
        router.push('/login');
      }
    }
  };


  return (
    <AuthLayout
      title="Sign up for an account"
      subtitle={
        <>
          Already registered?{' '}
          <Link href="/login" className="text-cyan-600">
            Sign in
          </Link>{' '}
          to your account.
        </>
      }
    >
      <form onSubmit={handleSignUp}>
        <div className="grid grid-cols-2 gap-6">
          <TextField
            className="col-span-full"
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            className="col-span-full"
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" color="cyan" className="mt-8 w-full">
          {loading ? 'Registering...' : 'Get started today'}
        </Button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </AuthLayout>
  );
}
