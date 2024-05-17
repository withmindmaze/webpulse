//@ts-nocheck
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';
import supabase from '@/utils/supabaseClient';

export function NavLinks() {
  const { t } = useTranslation();
  const pathName = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const [user, setUser] = useState<object | null>(null);
  const links = [
    { label: `${user ? t('header.dashboard') : t('header.homepage')}`, href: '/' },
    { label: `${t('header.alerts')}`, href: '/alerts' },
    { label: `${t('header.compare')}`, href: '/compare' },
    { label: `${t('header.reports')}`, href: '/reports' },
    { label: `${t('header.pricing')}`, href: '/purchase' },
    { label: `${t('header.about_us')}`, href: '/about' },
    { label: `${t('header.faq')}`, href: '/faq' },
  ];
  const [filteredLinks, setFilteredLinks] = useState<object | null>(links);

  const getUser = async () => {
    const { data: user, error } = await supabase.auth.getUser();
    if (user?.user?.id) {
      setUser(user);
    } else {
      const filtered = links.filter(link =>
        [t('header.homepage'), t('header.about_us'), t('header.faq')].includes(link.label)
      );
      setFilteredLinks(filtered);
    }
  }

  useEffect(() => {
    getUser();
  }, []);



  return filteredLinks?.map((link, index) => (
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
