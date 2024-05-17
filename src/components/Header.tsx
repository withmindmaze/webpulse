'use client'

import Link from 'next/link'
import { Popover } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { Logo } from '@/components/Logo'
import { NavLinks } from '@/components/NavLinks'
import supabase from '@/utils/supabaseClient'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import '../utils/i18n';

function MenuIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5 6h14M5 18h14M5 12h14"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronUpIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M17 14l-5-5-5 5"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MobileNavLink(
  props: Omit<
    React.ComponentPropsWithoutRef<typeof Popover.Button<typeof Link>>,
    'as' | 'className'
  >,
) {
  return (
    <Popover.Button
      as={Link}
      className="block text-base leading-7 tracking-tight text-gray-700"
      {...props}
    />
  )
}

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  // Function to change language and store selection in localStorage
  const changeLanguage = (lang: any) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang); // Store the language preference
  };

  // Effect hook to load language preference from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  return (
    <select
      value={i18n.language}
      onChange={(e) => changeLanguage(e.target.value)}
      className="border p-2 rounded w-[95px]"
    >
      <option value="en">English</option>
      <option value="ar">العربية</option>
    </select>
  );
}

export function Header() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const { t } = useTranslation();

  const userLoggedIn = async () => {
    const getUser = await supabase.auth.getUser();
    if (getUser.data.user?.id) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }

  useEffect(() => {
    userLoggedIn();
  }, [router]);


  const handleLogout = () => {
    supabase.auth.signOut();
    toast.success(t('toast.log_out_success'))
    router.push('/login');
  }

  const handleLogIn = () => {
    router.push('/login');
  }

  return (
    <header>
      <nav>
        <Container className="relative z-50 flex justify-center items-center py-8">
          <div className="flex justify-between items-center w-full max-w-6xl px-4 lg:px-0">
            {/* Logo and NavLinks grouped */}
            <div className="flex-grow flex items-center justify-start">
              <Link href="/" aria-label="Home">
                <Logo className="h-10 w-auto" />
              </Link>
            </div>

            {/* Centered NavLinks */}
            <div className="flex-grow-0 hidden lg:flex justify-center">
              <NavLinks />
            </div>




            <Popover className="lg:hidden">
              {({ open }) => (
                <>
                  <Popover.Button
                    className="relative z-10 -m-2 inline-flex items-center rounded-lg stroke-gray-900 p-2 hover:bg-gray-200/50 hover:stroke-gray-600 active:stroke-gray-900 ui-not-focus-visible:outline-none"
                    aria-label="Toggle site navigation"
                  >
                    {({ open }) =>
                      open ? (
                        <ChevronUpIcon className="h-6 w-6" />
                      ) : (
                        <MenuIcon className="h-6 w-6" />
                      )
                    }
                  </Popover.Button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <>
                        <Popover.Overlay
                          static
                          as={motion.div}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-0 bg-gray-300/60 backdrop-blur"
                        />
                        <Popover.Panel
                          static
                          as={motion.div}
                          initial={{ opacity: 0, y: -32 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{
                            opacity: 0,
                            y: -32,
                            transition: { duration: 0.2 },
                          }}
                          className="absolute inset-x-0 top-0 z-0 origin-top rounded-b-2xl bg-gray-50 px-6 pb-6 pt-32 shadow-2xl shadow-gray-900/20"
                        >
                          <div className="space-y-4">
                            <MobileNavLink href="/">
                              {t('header.dashboard')}
                            </MobileNavLink>
                            <MobileNavLink href="/reports">
                              {t('header.reports')}
                            </MobileNavLink>
                            <MobileNavLink href="/alerts">
                              {t('header.alerts')}
                            </MobileNavLink>
                            <MobileNavLink href="/compare">
                              {t('header.compare')}
                            </MobileNavLink>
                            <MobileNavLink href="/purchase">
                              {t('header.pricing')}
                            </MobileNavLink>
                            <MobileNavLink href="/purchase">
                              {t('header.about_us')}
                            </MobileNavLink>
                            <MobileNavLink href="/purchase">
                              {t('header.faq')}
                            </MobileNavLink>
                          </div>
                          <div className="mt-8 flex flex-col gap-4">
                            {
                              isLogin === true ?
                                <Button onClick={handleLogout} variant="outline">
                                  {t('header.logout')}
                                </Button>
                                :
                                <Button onClick={handleLogIn} variant="outline">
                                  {t('header.login')}
                                </Button>
                            }
                          </div>
                        </Popover.Panel>
                      </>
                    )}
                  </AnimatePresence>
                </>
              )}
            </Popover>


            {/* Language and authentication actions grouped */}
            <div className="flex-grow flex items-center justify-end gap-6">
              <LanguageSwitcher />
              {isLogin ? (
                <Button onClick={handleLogout} variant="outline"
                  className="border-[#3bbed9] text-[#3bbed9] hover:border-[#3bbed9] hover:text-[#3bbed9] focus:outline-none focus:ring-2 focus:ring-[#3bbed9] focus:ring-opacity-50 hidden lg:block"
                >
                  {t('header.logout')}
                </Button>
              ) : (
                <Button
                  onClick={handleLogIn}
                  variant="outline"
                  className="border-[#3bbed9] text-[#3bbed9] hover:border-[#3bbed9] hover:text-[#3bbed9] focus:outline-none focus:ring-2 focus:ring-[#3bbed9] focus:ring-opacity-50 hidden lg:block"
                >
                  {t('header.login')}
                </Button>
              )}
            </div>
          </div>
        </Container>
      </nav>
    </header>
  );


}