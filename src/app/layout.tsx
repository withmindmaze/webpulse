'use client'
import clsx from 'clsx'
import { Inter } from 'next/font/google'
import './global.css'

import '@/styles/tailwind.css'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ToastContainer } from 'react-toastify'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [direction, setDirection] = useState('ltr');
  const [isClient, setIsClient] = useState(false);
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.on('languageChanged', () => {
      console.log("languageChanged");

      if (i18n.language === 'en') {
        setDirection('ltr');
      }
      if (i18n.language === 'ar') {
        setDirection('rtl');
      }
    });
    setIsClient(true);
  }, []);

  useEffect(() => {
    const currentLanguage = localStorage.getItem('language');
    if (currentLanguage === 'en') {
      i18n.changeLanguage('en')
    } else if (currentLanguage === 'ar') {
      i18n.changeLanguage('ar')
    }
  }, []);


  return (
    <html
      dir={direction}
      lang="en"
      className={clsx('h-full bg-gray-50 antialiased', inter.variable)}
    >
      <body className="flex h-full flex-col">
        <div className="flex min-h-full flex-col">{children}</div>
      </body>
      {isClient && <ToastContainer progressStyle={{ background: "#3bbed9" }} />}
    </html>
  )
}
