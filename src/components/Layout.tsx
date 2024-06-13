//@ts-nocheck
'use client'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import supabase from '@/utils/supabaseClient';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

export function Layout({ children }: { children: React.ReactNode }) {
  // const [isLogin, setIsLogin] = useState(true);
  // const { i18n } = useTranslation();
  // const router = useRouter();

  // useEffect(() => {
  //   userLoggedIn();
  // }, [router]);

  // const userLoggedIn = async () => {
  //   const getUser = await supabase.auth.getUser();
  //   if (getUser.data.user?.id) {
  //     setIsLogin(true);
  //   } else {
  //     setIsLogin(false);
  //   }
  // }

  const { user, loading } = useUser();
  const { i18n } = useTranslation();

  return (
    <>
      <Header isLogin={!!user} language={i18n.language} />
      <main className="flex-auto bg-[#3bbed9] bg-opacity-10">{children}</main>
      <Footer language={i18n.language} isUserLoggedIn={!!user} />
    </>
  )
}
