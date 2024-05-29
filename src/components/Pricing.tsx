//@ts-nocheck
'use client'
import supabase from '@/utils/supabaseClient'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
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

const SubscribeForm = ({ handleSubmit, billingInterval, handleIntervalChange, buttonLoading }) => {
  const { t } = useTranslation();

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="flex justify-center bg-gray-200 py-2">
        <button
          className={`px-4 py-2 focus:outline-none ${billingInterval === 'monthly' ? 'bg-[#3bbed9] text-white' : ''}`}
          onClick={() => handleIntervalChange('monthly')}
        >
          {t('pricing.monthly_label')}
        </button>
        <button
          className={`px-4 py-2 focus:outline-none ${billingInterval === 'yearly' ? 'bg-[#3bbed9] text-white' : ''}`}
          onClick={() => handleIntervalChange('yearly')}
        >
          {t('pricing.yearly_label')}
        </button>
      </div>
      <div className="p-4">
        <h2 className="text-2xl font-semibold text-center mt-4">{billingInterval === 'monthly' ? t('pricing.testcrew_plan_text_monthly') : t('pricing.testcrew_plan_text_yearly')}</h2>
        <p className="text-center text-gray-700 mt-2">{billingInterval === 'monthly' ? t('pricing.us_ten_dollar_month') : t('pricing.us_hunred_dollar_year')}</p>
        <form onSubmit={handleSubmit}>
          <CardElement className="p-2 border rounded-md" />
          <button
            className={`w-full py-2 mt-4 rounded-lg ${buttonLoading ? 'bg-gray-400' : 'bg-[#3bbed9] text-white'}`}
            type="submit"
            disabled={buttonLoading}
          >
            {t('pricing.button_subscribe')}
          </button>
        </form>
        <div className="mt-4">
          <p className="text-gray-600">{t('pricing.text_offer')}</p>
          <ul className="list-disc list-inside text-gray-600">
            <li className="flex py-2">
              <CheckIcon className="h-6 w-6 flex-none text-cyan-500" />
              <span className="ml-4">{t('pricing.offer_1')}</span>
            </li>
            <li className="flex py-2">
              <CheckIcon className="h-6 w-6 flex-none text-cyan-500" />
              <span className="ml-4">{t('pricing.offer_2')}</span>
            </li>
            <li className="flex py-2">
              <CheckIcon className="h-6 w-6 flex-none text-cyan-500" />
              <span className="ml-4">{t('pricing.offer_3')}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export function Pricing() {
  const router = useRouter();
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const [priceId, setPriceId] = useState('price_1PDo1vAth9C2NE0Mg3hisgmf');
  const [billingInterval, setBillingInterval] = useState('monthly');

  const checkPaymentStatus = async () => {
    const getUser = await supabase.auth.getUser();
    const userSubscriptions = await supabase
      .from('user_plan')
      .select('*')
      .eq('user_id', getUser.data.user?.id);

    const paymentDetails = userSubscriptions.data[userSubscriptions.data?.length - 1];
    if (paymentDetails) {
      if (paymentDetails?.payment_detail !== null && paymentDetails?.plan === "premium") {
        setIsPremiumUser(true);
      }
    }
    console.log(paymentDetails);
    setLoading(false);
  }

  useEffect(() => {
    checkPaymentStatus();
  }, [router]);

  const handleCancelSubscription = async () => {
    setButtonLoading(true);
    const getUser = await supabase.auth.getUser();

    const apiResponse = await fetch(`/api/stripe/cancelSubscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: getUser.data.user?.id
      }),
    });

    const data = await apiResponse.json();
    if (data.success) {
      toast.success(t('toast.subscription_cancel_success'));
      router.push('/');
    } else {
      toast.error(t('toast.subscription_cancel_fail'));
    }
    setButtonLoading(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonLoading(true);
    const getUser = await supabase.auth.getUser();


    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      console.error("CardElement not found");
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.error(error);
      return;
    }

    const response = await fetch('/api/stripe/newSubscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: getUser.data.user?.email,
        paymentMethodId: paymentMethod.id,
        priceId,
        user_id: getUser.data.user?.id
      }),
    });

    const subscription = await response.json();
    setButtonLoading(false);
    if (subscription.error) {
      toast.error(subscription.error);
      console.error(subscription.error);
    } else {
      toast.success(t('toast.subscription_success'));
      console.log('Subscription successful:', subscription);
      router.push('/');
    }
  };

  const handleIntervalChange = (interval: string) => {
    setBillingInterval(interval);
    setPriceId(interval === 'monthly' ? 'price_1PDo1vAth9C2NE0Mg3hisgmf' : 'price_1PDo2HAth9C2NE0MPCFNRlNL');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg font-semibold text-gray-800">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div>
      {isPremiumUser ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="flex flex-col items-center space-y-4">
            <h2 id="pricing-title" className="text-3xl font-medium tracking-tight text-gray-900">
              {t('pricing.already_subscribed')}
            </h2>
            <div className="flex flex-col items-center space-y-4">
              <button
                onClick={handleCancelSubscription}
                className={`w-full p-2 mt-4 rounded-lg ${buttonLoading ? 'bg-gray-400' : 'bg-[#3bbed9] text-white'}`}
                disabled={buttonLoading}>
                {t('pricing.button_cancel_subscription')}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <SubscribeForm
          handleSubmit={handleSubmit}
          billingInterval={billingInterval}
          handleIntervalChange={handleIntervalChange}
          buttonLoading={buttonLoading}
        />
      )
      }
    </div >
  );
}

export default Pricing;
