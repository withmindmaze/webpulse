//@ts-nocheck
'use client'
import supabase from '@/utils/supabaseClient';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const [user, setUser] = useState<object | null>(null);
  const { t, i18n } = useTranslation();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(true);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n]);

  const links_arabic_logged_in = [
    { label: "لوحة التحكم", href: '/' },
    { label: "ملخص التقارير", href: '/reports' },
    { label: "التنبيهات", href: '/alerts' },
    { label: "يقارن", href: '/compare' },
    { label: "الأسعار", href: '/purchase' },
    { label: "معلومات عنا", href: '/about' },
    { label: "التعليمات", href: '/faq' },
  ];

  const links_english_logged_in = [
    { label: "Dashboard", href: '/' },
    { label: "Reports Summary", href: '/reports' },
    { label: "Alerts", href: '/alerts' },
    { label: "Compare", href: '/compare' },
    { label: "Pricing", href: '/purchase' },
    { label: "About Us", href: '/about' },
    { label: "FAQ", href: '/faq' },
  ];

  const getUser = async () => {
    const { data: user, error } = await supabase.auth.getUser();
    if (user?.user?.id) {
      setIsUserLoggedIn(true);
    } else {
      setIsUserLoggedIn(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);


  return (
    <footer className="bg-[#3bbed9] bg-opacity-10 py-4">
      <div className=" overflow-hidden px-6 py-10 sm:py-12 lg:px-8">
        <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
          {i18n.language === 'en' && isUserLoggedIn === true &&
            links_english_logged_in?.map((item, index) => (
              <div className="pb-6" key={index}>
                <a href={item.href} className="text-sm leading-6 text-gray-600 hover:text-gray-900" style={{ marginLeft: index === 0 ? "40px" : "0px" }}>
                  {item.label}
                </a>
              </div>
            ))}
          {i18n.language === 'en' && isUserLoggedIn === false &&
            [
              { label: "Homepage", href: '/' },
              { label: "About Us", href: '/about' },
              { label: "FAQ", href: '/faq' }
            ]?.map((item, index) => (
              <div className="pb-6" key={index}>
                <a href={item.href} className="text-sm leading-6 text-gray-600 hover:text-gray-900" style={{ marginLeft: index === 0 ? "40px" : "0px" }}>
                  {item.label}
                </a>
              </div>
            ))}
          {i18n.language === 'ar' && isUserLoggedIn === true &&
            links_arabic_logged_in?.map((item, index) => (
              <div className="pb-6" key={index}>
                <a href={item.href} className="text-sm leading-6 text-gray-600 hover:text-gray-900" style={{ marginLeft: index === 0 ? "40px" : "0px" }}>
                  {item.label}
                </a>
              </div>
            ))}
          {i18n.language === 'ar' && isUserLoggedIn === false &&
            [
              { label: "الصفحة الرئيسية", href: '/' },
              { label: "معلومات عنا", href: '/about' },
              { label: "التعليمات", href: '/faq' },
            ]?.map((item, index) => (
              <div className="pb-6" key={index}>
                <a href={item.href} className="text-sm leading-6 text-gray-600 hover:text-gray-900" style={{ marginLeft: index === 0 ? "40px" : "0px" }}>
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
