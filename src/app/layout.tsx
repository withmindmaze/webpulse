'use client'
import { Inter } from 'next/font/google'
import clsx from 'clsx'
import './global.css'

import '@/styles/tailwind.css'
import { type Metadata } from 'next'
import { ToastContainer } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

// export const metadata: Metadata = {
//   title: {
//     template: '%s - Web Pulse',
//     default: 'Web Pulse - Find your website perfect performance..',
//   },
//   description:
//     'By leveraging insights from our web-application that uses state of the art tech, you’ll know exactly what you need to fix to maximize your website performance, and exactly which line to do it at.',
// }

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
    >
      <body className={clsx('flex h-full flex-col h-full bg-gray-50 antialiased', inter.variable)}
      >
        <div className="flex min-h-full flex-col">{children}</div>
      </body>
      {isClient && <ToastContainer progressStyle={{ background: "#3bbed9" }} />}
    </html>
  )
}
