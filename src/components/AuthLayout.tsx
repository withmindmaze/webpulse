//@ts-nocheck
'use client'
import { CirclesBackground } from '@/components/CirclesBackground';
import { useEffect, useState } from 'react';
import supabase from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: React.ReactNode
  children: React.ReactNode
}) {
  const [pageLoading, setPageLoading] = useState(true);
  const router = useRouter();
  const pathName = usePathname();

  const handleRedirection = async () => {
    const { data: user, error } = await supabase.auth.getUser();
    if (user.user?.id) {
      setPageLoading(true);
      router.back();
    } else {
      setPageLoading(false);
    }
  }

  useEffect(() => {
    if (pathName === '/forget-password/confirm') {
      setPageLoading(false);
    } else {
      handleRedirection();
    }
  }, [router]);

  if (pageLoading === true) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#3bbed9] bg-opacity-10">
        <div className="text-lg font-semibold text-gray-800">
          Loading...
        </div>
      </div>
    )
  } else {
    return (
      <main className="flex overflow-hidden">
        <div className="mx-auto flex w-full max-w-2xl flex-col px-4 sm:px-6">
          {/* <Link href="/" aria-label="Home">
            <Logo className="mx-auto h-10 w-auto" />
          </Link> */}
          <div className="relative mt-12 sm:mt-16">
            <CirclesBackground
              width="1090"
              height="1090"
              className="absolute -top-7 left-1/2 -z-10 h-[788px] -translate-x-1/2 stroke-gray-300/30 [mask-image:linear-gradient(to_bottom,white_20%,transparent_75%)] sm:-top-9 sm:h-auto"
            />
            <h1 className="text-center text-2xl font-medium tracking-tight text-gray-900">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-3 text-center text-lg text-gray-600">{subtitle}</p>
            )}
          </div>
          <div className="-mx-4 mt-10 flex-auto bg-white px-4 py-10 shadow-2xl shadow-gray-900/10 sm:mx-0 sm:flex-none sm:rounded-5xl sm:p-24">
            {children}
          </div>
        </div>
      </main>
    )
  }
}
