import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-auto bg-[#3bbed9] bg-opacity-10">{children}</main>
      <Footer />
    </>
  )
}
