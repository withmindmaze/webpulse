'use client'

import { useEffect, useState } from 'react'
import { RadioGroup } from '@headlessui/react'
import clsx from 'clsx'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { Logomark } from '@/components/Logo'
import StripeCard from "@/components/StripeCard";
import supabase from '@/utils/supabaseClient'
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify'



function CheckIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M9.307 12.248a.75.75 0 1 0-1.114 1.004l1.114-1.004ZM11 15.25l-.557.502a.75.75 0 0 0 1.15-.043L11 15.25Zm4.844-5.041a.75.75 0 0 0-1.188-.918l1.188.918Zm-7.651 3.043 2.25 2.5 1.114-1.004-2.25-2.5-1.114 1.004Zm3.4 2.457 4.25-5.5-1.187-.918-4.25 5.5 1.188.918Z"
        fill="currentColor"
      />
      <circle
        cx="12"
        cy="12"
        r="8.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Plan({
  name,
  price,
  description,
  button,
  features,
  activePeriod,
  logomarkClassName,
  featured = false,
  handleOpenModal,
  isPremiumUser
}: {
  name: string
  price: {
    Monthly: string
    Annually: string
  }
  description: string
  button: {
    label: string
    href: string
  }
  features: Array<string>
  activePeriod: 'Monthly' | 'Annually'
  logomarkClassName?: string
  featured?: boolean
  handleOpenModal: any
  isPremiumUser: boolean
}) {
  const { t } = useTranslation();

  return (
    <section
      className={clsx(
        'flex flex-col overflow-hidden rounded-3xl p-6 shadow-lg shadow-gray-900/5',
        featured ? 'order-first bg-gray-900 lg:order-none' : 'bg-white',
      )}
    >
      <h3
        className={clsx(
          'flex items-center text-sm font-semibold',
          featured ? 'text-white' : 'text-gray-900',
        )}
      >
      </h3>
      <p
        className={clsx(
          'relative mt-5 flex text-3xl tracking-tight',
          featured ? 'text-white' : 'text-gray-900',
        )}
      >
        {price.Monthly === price.Annually ? (
          price.Monthly
        ) : (
          <>
            <span
              aria-hidden={activePeriod === 'Annually'}
              className={clsx(
                'transition duration-300',
                activePeriod === 'Annually' &&
                'pointer-events-none translate-x-6 select-none opacity-0',
              )}
            >
              {price.Monthly}
            </span>
            <span
              aria-hidden={activePeriod === 'Monthly'}
              className={clsx(
                'absolute left-0 top-0 transition duration-300',
                activePeriod === 'Monthly' &&
                'pointer-events-none -translate-x-6 select-none opacity-0',
              )}
            >
              {price.Annually}
            </span>
          </>
        )}
      </p>
      <p
        className={clsx(
          'mt-3 text-sm',
          featured ? 'text-gray-300' : 'text-gray-700',
        )}
      >
        {description}
      </p>
      <div className="order-last mt-6">
        <ul
          role="list"
          className={clsx(
            '-my-2 divide-y text-sm',
            featured
              ? 'divide-gray-800 text-gray-300'
              : 'divide-gray-200 text-gray-700',
          )}
        >
          {features.map((feature) => (
            <li key={feature} className="flex py-2">
              <CheckIcon
                className={clsx(
                  'h-6 w-6 flex-none',
                  featured ? 'text-white' : 'text-cyan-500',
                )}
              />
              <span className="ml-4">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <Button
        onClick={handleOpenModal}
        // href={button.href}
        color={featured ? 'cyan' : 'gray'}
        className="mt-6"
        aria-label={`Get started with the ${name} plan for ${price}`}
        disabled={isPremiumUser}
      >
        {isPremiumUser === true ? t('pricing.button_already_purchased') : button.label}
      </Button>
    </section>
  )
}

export function Pricing() {
  const router = useRouter();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState('');
  const { t } = useTranslation();

  const plans = [
    {
      name: 'Investor',
      featured: false,
      price: { Monthly: '$7', Annually: '$70' },
      description: t('pricing.info_text_2'),
      button: {
        label: t('pricing.button_pay'),
        href: '/register',
      },
      features: [
        t('pricing.feature_1'),
        t('pricing.feature_2'),
        t('pricing.feature_3'),
      ],
      logomarkClassName: 'fill-gray-500',
    },
  ];

  const checkPaymentStatus = async () => {
    const getUser = await supabase.auth.getUser();
    const paymentDetails = await supabase
      .from('user_plan')
      .select('*')
      .eq('user_id', getUser.data.user?.id)
      .single();

    setUser(paymentDetails?.data);
    if (paymentDetails.data?.payment_detail !== null && paymentDetails.data?.plan === "premium") {
      setIsPremiumUser(true);
    }
    setLoading(false);
  }

  useEffect(() => {
    checkPaymentStatus();
  }, [router]);


  const handleOpenModal = () => {
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  let [activePeriod, setActivePeriod] = useState<'Monthly' | 'Annually'>(
    'Monthly',
  )

  useEffect(() => {
    // Function to dynamically load a script
    const loadScript = (src: any) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.head.appendChild(script);
      return script;
    };

    // Load the Stripe Pricing Table script
    const stripeScript = loadScript('https://js.stripe.com/v3/pricing-table.js');

    // Clean up the script when the component unmounts
    return () => {
      document.head.removeChild(stripeScript);
    };
  }, []);

  const handleCancelSubscription = async () => {
    const apiResponse = await fetch(`/api/stripe/cancelSubscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        //@ts-ignore
        userId: user.id
      }),
    });

    const data = await apiResponse.json();
    if (data.success) {
      toast.success(t('toast.subscription_cancel_success'));
      router.push('/');
    } else {
      toast.error(t('toast.subscription_cancel_fail'));
    }
  }

  return (
    <>
      {/* <StripeCard isOpen={modalIsOpen} handleOnClose={handleCloseModal} /> */}

      {
        isPremiumUser === true ?
          <div className="flex justify-center items-center min-h-screen">
            <div className="flex flex-col items-center space-y-4">
              <h2 id="pricing-title" className="text-3xl font-medium tracking-tight text-gray-900">
                {t('pricing.already_subscribed')}
              </h2>
              <a href="https://billing.stripe.com/p/login/test_14k01j2ZxfEU3N6bII" target="_blank"
                className="bg-[#3bbed9] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#32a8c1] transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#3bbed9] focus:ring-opacity-50">
                {t('pricing.button_manage_subscription')}
              </a>
              <button onClick={handleCancelSubscription}
                className="text-black font-medium py-2 px-4 rounded-lg hover:bg-[#32a8c1] transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#3bbed9] focus:ring-opacity-50">
                {t('pricing.button_cancel_subscription')}
              </button>
            </div>
          </div>
          :
          //@ts-ignore
          <stripe-pricing-table
          //@ts-ignore
            customer-email={user.email}
            pricing-table-id="prctbl_1PDoCjAth9C2NE0MgZRLSDBE"
            publishable-key="pk_test_51O0jx3Ath9C2NE0MvIrV1nitk2yYftCYjwr2v2HPghQNJrTuVXbN8R82JPw3DSQzZjm2MBuB69nn88kbYQ4azLOW00WCTYP7Wg"
          />
      }


      {/* <section
        id="pricing"
        aria-labelledby="pricing-title"
        className="border-t border-gray-200 bg-gray-100 py-20 sm:py-32"
      >
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2
              id="pricing-title"
              className="text-3xl font-medium tracking-tight text-gray-900"
            >
              {t('pricing.flat_pricing')}
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              {t('pricing.info_text_1')}
            </p>
          </div>

          <div className=" flex justify-center">
            <div className="relative">
              <RadioGroup
                value={activePeriod}
                onChange={setActivePeriod}
                className="grid grid-cols-2"
              >
                {['Monthly', 'Annually'].map((period) => (
                  <RadioGroup.Option
                    key={period}
                    value={period}
                    className={clsx(
                      'cursor-pointer border border-gray-300 px-[calc(theme(spacing.3)-1px)] py-[calc(theme(spacing.2)-1px)] text-sm text-gray-700 outline-2 outline-offset-2 transition-colors hover:border-gray-400',
                      period === 'Monthly'
                        ? 'rounded-l-lg'
                        : '-ml-px rounded-r-lg',
                    )}
                  >
                    {period}
                  </RadioGroup.Option>
                ))}
              </RadioGroup>
              <div
                aria-hidden="true"
                className={clsx(
                  'pointer-events-none absolute inset-0 z-10 grid grid-cols-2 overflow-hidden rounded-lg bg-cyan-500 transition-all duration-300',
                  activePeriod === 'Monthly'
                    ? '[clip-path:inset(0_50%_0_0)]'
                    : '[clip-path:inset(0_0_0_calc(50%-1px))]',
                )}
              >
                {['Monthly', 'Annually'].map((period) => (
                  <div
                    key={period}
                    className={clsx(
                      'py-2 text-center text-sm font-semibold text-white',
                      period === 'Annually' && '-ml-px',
                    )}
                  >
                    {period}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {
            loading === true ?
              <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-lg font-semibold text-gray-800">
                  Loading...
                </div>
              </div>
              :
              <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 items-start gap-x-8 gap-y-10 sm:mt-20 lg:max-w-100 lg:grid-cols-1">
                {plans.map((plan) => (
                  <Plan
                    key={plan.name}
                    {...plan}
                    activePeriod={activePeriod}
                    handleOpenModal={handleOpenModal}
                    isPremiumUser={isPremiumUser}
                  />
                ))}
              </div>
          }


        </Container>
      </section> */}
    </>

  )
}
