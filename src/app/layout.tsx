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
  const [isClient, setIsClient] = useState(false);
  const [direction, setDirection] = useState<string>('ltr');
  const { t } = useTranslation();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const currentLnaguage = localStorage.getItem('language');
    if (currentLnaguage === 'en' || currentLnaguage === undefined || currentLnaguage === null) {
      setDirection('ltr');
    } else {
      setDirection('rtl');
    }
  }, [t]);

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
