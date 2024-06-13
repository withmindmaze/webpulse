//@ts-nocheck
export function Footer({ isUserLoggedIn, language }) {
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
        { label: "الصفحة الرئيسية", href: '/' },
        { label: "معلومات عنا", href: '/about' },
        { label: "التعليمات", href: '/faq' },
      ]
    }
  };

  const currentLinks = isUserLoggedIn ? links[language].logged_in : links[language].logged_out;

  return (
    <footer className="bg-[#3bbed9] bg-opacity-10 py-4">
      <div className=" overflow-hidden px-6 py-10 sm:py-12 lg:px-8">
        <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
          {currentLinks.map((item, index) => (
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
  );
}
