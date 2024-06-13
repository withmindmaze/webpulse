//@ts-nocheck
import Link from 'next/link';
import { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export function NavLinks({ isUserLoggedIn, language }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const timeoutRef = useRef(null);

  const links = {
    en: {
      logged_in: [
        { label: "Dashboard", href: '/' },
        { label: "Reports Summary", href: '/reports' },
        { label: "Alerts", href: '/alerts' },
        { label: "Compare", href: '/compare' },
        { label: "Pricing", href: '/purchase' },
        { label: "About Us", href: '/about' },
        { label: "FAQ", href: '/faq' },
      ],
      logged_out: [
        { label: "Homepage", href: '/' },
        { label: "About Us", href: '/about' },
        { label: "FAQ", href: '/faq' }
      ]
    },
    ar: {
      logged_in: [
        { label: "لوحة التحكم", href: '/' },
        { label: "ملخص التقارير", href: '/reports' },
        { label: "التنبيهات", href: '/alerts' },
        { label: "يقارن", href: '/compare' },
        { label: "الأسعار", href: '/purchase' },
        { label: "معلومات عنا", href: '/about' },
        { label: "التعليمات", href: '/faq' },
      ],
      logged_out: [
        { label: "لوحة التحكم", href: '/' },
        { label: "معلومات عنا", href: '/about' },
        { label: "التعليمات", href: '/faq' },
      ]
    }
  };

  const currentLinks = isUserLoggedIn ? links[language].logged_in : links[language].logged_out;

  return (
    <>
      {currentLinks.map((link, index) => (
        <Link key={link.label} href={link.href} passHref>
          <motion.div
            className="mr-4 relative -mx-3 -my-2 rounded-lg px-3 py-2 text-sm transition-colors delay-150"
            onMouseEnter={() => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
              setHoveredIndex(index);
            }}
            onMouseLeave={() => {
              timeoutRef.current = setTimeout(() => setHoveredIndex(null), 200);
            }}
          >
            <AnimatePresence>
              {hoveredIndex === index && (
                <motion.span
                  className="absolute inset-0 rounded-lg bg-gray-100"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.15 } }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                />
              )}
            </AnimatePresence>
            <span className="relative z-10">{link.label}</span>
          </motion.div>
        </Link>
      ))}
    </>
  );
}
