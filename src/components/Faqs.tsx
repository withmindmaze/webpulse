//@ts-nocheck
import { Container } from '@/components/Container'
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const faqs = [
  [
    {
      question: 'What is WebPulse?',
      answer:
        "WebPulse is an automated tool designed to improve the quality of web pages by providing comprehensive audits for performance, accessibility, SEO, and more. You can run WebPulse audits on any web page, whether it is public or requires authentication."
    },
    {
      question: 'How do I run WebPulse?',
      answer:
        'Web UI: Use the web interface at “WEBPULSE URL”.',
    },
    {
      type: 'list',
      question: 'What are the key features of WebPulse?',
      answer: [
        'Performance Audits: Measures page load speed, interactivity, and stability.',
        'Accessibility Audits: Ensures web content is accessible to all users, including those with disabilities.',
        'Best Practices Audits: Checks for common web development mistakes.',
        'SEO Audits: Analyzes the page for search engine optimization best practices.',
        'PWA Audits: Evaluates Progressive Web App features.'
      ]
    },
    {
      question: 'What is the difference between mobile and desktop audits in WebPulse?',
      answer:
        'WebPulse provides separate audits for mobile and desktop, simulating different devices and network conditions. Mobile audits typically emphasize performance optimizations for slower networks and less powerful hardware.',
    },
  ],
  [
    {
      question: 'How often should I run WebPulse audits?',
      answer:
        'It’s recommended to run WebPulse audits regularly, especially after significant changes to your website, to ensure ongoing performance, accessibility, and SEO compliance.',
    },
    {
      question: 'How does WebPulse calculate scores?',
      answer:
        'WebPulse scores are calculated based on a weighted average of audit results in each category. Scores range from 0 to 100, with higher scores indicating better performance and compliance.',
    },
    {
      type: 'list',
      question: 'What do the colors in the WebPulse report mean?',
      answer: [
        'Green (90-100): Indicates excellent performance.',
        'Orange (50-89): Indicates moderate performance with room for improvement.',
        'Red (0-49): Indicates poor performance that requires immediate attention.'
      ]
    },
    {
      question: 'Can WebPulse detect progressive web app (PWA) features?',
      answer:
        'Yes, WebPulse includes audits specifically designed to evaluate PWA features such as service workers, manifest files, and offline capabilities.',
    },
  ],
  [
    {
      question: 'Is there a way to compare WebPulse scores over time?',
      answer:
        'You can use tools like the PageSpeed Insights API, WebPulse CI, or third-party services like Calibre to track and compare WebPulse scores over time, helping you monitor performance trends and improvements.',
    },
    {
      question: 'Can WebPulse audit authenticated pages?',
      answer:
        'Yes, WebPulse can audit authenticated pages using the DevTools protocol for scripting interactions or by providing login credentials in a custom WebPulse configuration.',
    },
    {
      question: 'How does WebPulse handle third-party scripts?',
      answer:
        'WebPulse identifies and reports on the impact of third-party scripts on your page’s performance. It provides suggestions for mitigating any negative effects caused by these scripts.',
    },
  ],
]

const faqsArabic = [
  [
    {
      question: 'ما هو WebPulse؟',
      answer:
        "WebPulse هو أداة مؤتمتة مصممة لتحسين جودة صفحات الويب من خلال توفير تدقيق شامل للأداء، وإمكانية الوصول، وتحسين محركات البحث، والمزيد. يمكنك تشغيل تدقيق WebPulse على أي صفحة ويب، سواء كانت عامة أو تتطلب مصادقة."
    },
    {
      question: 'كيف يمكنني تشغيل WebPulse؟',
      answer:
        'واجهة الويب: استخدم واجهة الويب في "عنوان WebPulse".',
    },
    {
      type: 'list',
      question: 'ما هي الميزات الرئيسية لـ WebPulse؟',
      answer: [
        'تدقيق الأداء: يقيس سرعة تحميل الصفحة، والتفاعل، والاستقرار.',
        'تدقيق إمكانية الوصول: يضمن أن محتوى الويب متاح لجميع المستخدمين، بما في ذلك الأشخاص ذوي الإعاقة.',
        'تدقيق أفضل الممارسات: يتحقق من الأخطاء الشائعة في تطوير الويب.',
        'تدقيق تحسين محركات البحث: يحلل الصفحة لضمان الامتثال لأفضل ممارسات تحسين محركات البحث.',
        'تدقيق تطبيقات الويب التقدمية: يقيم ميزات تطبيقات الويب التقدمية.'
      ]
    },
    {
      question: 'ما الفرق بين التدقيق المحمول وتدقيق سطح المكتب في WebPulse؟',
      answer:
        'يوفر WebPulse تدقيقات منفصلة للأجهزة المحمولة وسطح المكتب، مما يحاكي الأجهزة المختلفة وظروف الشبكة. عادةً ما تركز التدقيقات المحمولة على تحسينات الأداء للشبكات الأبطأ والأجهزة الأقل قوة.',
    },
  ],
  [
    {
      question: 'كم مرة يجب أن أقوم بتشغيل تدقيق WebPulse؟',
      answer:
        'يوصى بإجراء تدقيق WebPulse بانتظام، خاصة بعد التغييرات الكبيرة في موقعك الإلكتروني، لضمان الامتثال المستمر للأداء، وإمكانية الوصول، وتحسين محركات البحث.',
    },
    {
      question: 'كيف يحسب WebPulse الدرجات؟',
      answer:
        'تُحسب درجات WebPulse بناءً على متوسط مرجح لنتائج التدقيق في كل فئة. تتراوح الدرجات من 0 إلى 100، مع الإشارة إلى أداء أفضل عند الدرجات الأعلى.',
    },
    {
      type: 'list',
      question: 'ماذا تعني الألوان في تقرير WebPulse؟',
      answer: [
        'الأخضر (90-100): يشير إلى أداء ممتاز.',
        'البرتقالي (50-89): يشير إلى أداء معتدل مع مجال للتحسين.',
        'الأحمر (0-49): يشير إلى أداء ضعيف يتطلب اهتمامًا فوريًا.'
      ]
    },
    {
      question: 'هل يمكن لـ WebPulse اكتشاف ميزات تطبيقات الويب التقدمية (PWA)؟',
      answer:
        'نعم، يتضمن WebPulse تدقيقات مصممة خصيصًا لتقييم ميزات تطبيقات الويب التقدمية مثل العاملين في الخدمة، وملفات البيان، والقدرات غير المتصلة.',
    },
  ],
  [
    {
      question: 'هل هناك طريقة لمقارنة درجات WebPulse مع مرور الوقت؟',
      answer:
        'يمكنك استخدام أدوات مثل واجهة برمجة تطبيقات PageSpeed Insights، أو WebPulse CI، أو خدمات الجهات الخارجية مثل Calibre لتتبع ومقارنة درجات WebPulse مع مرور الوقت، مما يساعدك على مراقبة اتجاهات الأداء والتحسينات.',
    },
    {
      question: 'هل يمكن لـ WebPulse تدقيق الصفحات المصادق عليها؟',
      answer:
        'نعم، يمكن لـ WebPulse تدقيق الصفحات المصادق عليها باستخدام بروتوكول DevTools لأتمتة التفاعلات أو من خلال توفير بيانات الاعتماد في إعداد مخصص لـ WebPulse.',
    },
    {
      question: 'كيف يتعامل WebPulse مع البرامج النصية للجهات الخارجية؟',
      answer:
        'يحدد WebPulse تأثير البرامج النصية للجهات الخارجية على أداء صفحتك ويبلغ عنه. يقدم اقتراحات للتخفيف من الآثار السلبية التي تسببها هذه البرامج النصية.',
    },
  ],
]


export function Faqs() {
  const [selectedFaqs, setSelectedFaqs] = useState([]);
  const { i18n, t } = useTranslation();

  useEffect(() => {
    if (i18n.language === 'ar') {
      setSelectedFaqs(faqsArabic);
    } else {
      setSelectedFaqs(faqs);
    }

  }, [i18n.language])

  return (
    <section
      id="faqs"
      aria-labelledby="faqs-title"
      className="border-t border-gray-200 py-20 sm:py-32"
    >
      <Container>
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="faqs-title"
            className="text-3xl font-medium tracking-tight text-gray-900"
          >
            {t('faqs.heading')}
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            {t('faqs.feel_free')}{' '}
            <a
              href="mailto:webpulse@testcrew.com"
              className="text-gray-900 underline"
            >
              {t('faqs.reach_out')}
            </a>
            .
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:max-w-none lg:grid-cols-3"
        >
          {selectedFaqs.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="space-y-10">
                {column.map((faq, faqIndex) => (
                  <li key={faqIndex}>
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">
                      {faq.question}
                    </h3>
                    {faq.type === 'list' ? (
                      <ul className="mt-4 text-sm text-gray-700 list-disc pl-5">
                        {faq.answer.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-4 text-sm text-gray-700">{faq.answer}</p>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
