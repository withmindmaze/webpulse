//@ts-nocheck
'use client'
import supabase from '@/utils/supabaseClient';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const [user, setUser] = useState<object | null>(null);
  const { t, i18n } = useTranslation();

  const NavLinks = [
    { label: `${user ? t('header.dashboard') : t('header.homepage')}`, href: '/' },
    { label: `${t('header.alerts')}`, href: '/alerts' },
    { label: `${t('header.compare')}`, href: '/compare' },
    { label: `${t('header.reports')}`, href: '/reports' },
    { label: `${t('header.pricing')}`, href: '/purchase' },
    { label: `${t('header.about_us')}`, href: '/about' },
    { label: `${t('header.faq')}`, href: '/faq' },
  ];
  const [filteredLinks, setFilteredLinks] = useState<object | null>(NavLinks);

  const getUser = async () => {
    const { data: user, error } = await supabase.auth.getUser();
    if (user?.user?.id) {
      setUser(user);
      setFilteredLinks(NavLinks);
    } else {
      const filtered = NavLinks.filter(link =>
        [t('header.homepage'), t('header.about_us'), t('header.faq')].includes(link.label)
      );
      setFilteredLinks(filtered);
    }
  };

  useEffect(() => {
    getUser();
  }, [i18n.language]);

  return (
    <footer className="bg-[#3bbed9] bg-opacity-10 py-4">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-10 sm:py-12 lg:px-8">
        <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
          {filteredLinks?.map((item) => (
            <div key={item.label} className="pb-6">
              <a href={item.href} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                {item.label}
              </a>
            </div>
          ))}
        </nav>
        <p className="mt-10 text-center text-xs leading-5 text-gray-500">
          &copy; 2024 Testcrew, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
