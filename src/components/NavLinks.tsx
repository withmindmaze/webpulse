//@ts-nocheck
'use client'
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';
import supabase from '@/utils/supabaseClient';

export function NavLinks() {
  const { t, i18n } = useTranslation();
  const pathName = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(true);

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


  if (i18n.language === 'en' && isUserLoggedIn === true) {
    return links_english_logged_in?.map((link, index) => (
      <Link
        key={link.label}
        href={link.href}
        className={`mr-4 relative -mx-3 -my-2 rounded-lg px-3 py-2 text-sm transition-colors delay-150 ${pathName === link.href ? 'text-[#3bbed9]' : 'text-gray-700 hover:text-gray-900 hover:delay-0'}`}
        onMouseEnter={() => {
          if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
          }
          setHoveredIndex(index);
        }}
        onMouseLeave={() => {
          timeoutRef.current = window.setTimeout(() => {
            setHoveredIndex(null);
          }, 200);
        }}
      >
        <AnimatePresence>
          {hoveredIndex === index && (
            <motion.span
              className="absolute inset-0 rounded-lg bg-gray-100"
              layoutId="hoverBackground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.15 } }}
              exit={{
                opacity: 0,
                transition: { duration: 0.15 },
              }}
            />
          )}
        </AnimatePresence>
        <span className="relative z-10">{link.label}</span>
      </Link>
    ));
  } else if (i18n.language === 'en' && isUserLoggedIn === false) {
    return [
      { label: "Homepage", href: '/' },
      { label: "About Us", href: '/about' },
      { label: "FAQ", href: '/faq' }
    ]?.map((link, index) => (
      <Link
        key={link.label}
        href={link.href}
        className={`mr-4 relative -mx-3 -my-2 rounded-lg px-3 py-2 text-sm transition-colors delay-150 ${pathName === link.href ? 'text-[#3bbed9]' : 'text-gray-700 hover:text-gray-900 hover:delay-0'}`}
        onMouseEnter={() => {
          if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
          }
          setHoveredIndex(index);
        }}
        onMouseLeave={() => {
          timeoutRef.current = window.setTimeout(() => {
            setHoveredIndex(null);
          }, 200);
        }}
      >
        <AnimatePresence>
          {hoveredIndex === index && (
            <motion.span
              className="absolute inset-0 rounded-lg bg-gray-100"
              layoutId="hoverBackground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.15 } }}
              exit={{
                opacity: 0,
                transition: { duration: 0.15 },
              }}
            />
          )}
        </AnimatePresence>
        <span className="relative z-10">{link.label}</span>
      </Link>
    ));
  }
  else if (i18n.language === 'ar' && isUserLoggedIn === true) {
    return links_arabic_logged_in?.map((link, index) => (
      <Link
        key={link.label}
        href={link.href}
        className={`mr-4 relative -mx-3 -my-2 rounded-lg px-3 py-2 text-sm transition-colors delay-150 ${pathName === link.href ? 'text-[#3bbed9]' : 'text-gray-700 hover:text-gray-900 hover:delay-0'}`}
        onMouseEnter={() => {
          if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
          }
          setHoveredIndex(index);
        }}
        onMouseLeave={() => {
          timeoutRef.current = window.setTimeout(() => {
            setHoveredIndex(null);
          }, 200);
        }}
      >
        <AnimatePresence>
          {hoveredIndex === index && (
            <motion.span
              className="absolute inset-0 rounded-lg bg-gray-100"
              layoutId="hoverBackground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.15 } }}
              exit={{
                opacity: 0,
                transition: { duration: 0.15 },
              }}
            />
          )}
        </AnimatePresence>
        <span className="relative z-10">{link.label}</span>
      </Link>
    ));
  } else if (i18n.language === 'ar' && isUserLoggedIn === false) {
    return [
      { label: "لوحة التحكم", href: '/' },
      { label: "معلومات عنا", href: '/about' },
      { label: "التعليمات", href: '/faq' },
    ]?.map((link, index) => (
      <Link
        key={link.label}
        href={link.href}
        className={`mr-4 relative -mx-3 -my-2 rounded-lg px-3 py-2 text-sm transition-colors delay-150 ${pathName === link.href ? 'text-[#3bbed9]' : 'text-gray-700 hover:text-gray-900 hover:delay-0'}`}
        onMouseEnter={() => {
          if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
          }
          setHoveredIndex(index);
        }}
        onMouseLeave={() => {
          timeoutRef.current = window.setTimeout(() => {
            setHoveredIndex(null);
          }, 200);
        }}
      >
        <AnimatePresence>
          {hoveredIndex === index && (
            <motion.span
              className="absolute inset-0 rounded-lg bg-gray-100"
              layoutId="hoverBackground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.15 } }}
              exit={{
                opacity: 0,
                transition: { duration: 0.15 },
              }}
            />
          )}
        </AnimatePresence>
        <span className="relative z-10">{link.label}</span>
      </Link>
    ));
  }


}
