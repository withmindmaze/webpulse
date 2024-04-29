import { useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export function NavLinks() {
  const { t } = useTranslation();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const links = [
    { label: `${t('header.dashboard')}`, href: '/' },
    { label: `${t('header.alerts')}`, href: '/alerts' },
    { label: `${t('header.compare')}`, href: '/compare' },
    { label: `${t('header.reports')}`, href: '/reports' },
    { label: `${t('header.pricing')}`, href: '/purchase' },
  ];

  return links.map((link, index) => (
    <Link
      key={link.label}
      href={link.href}
      className="relative -mx-3 -my-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors delay-150 hover:text-gray-900 hover:delay-0"
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
