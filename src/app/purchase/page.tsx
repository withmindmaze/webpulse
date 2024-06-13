//@ts-nocheck
'use client'
import { Pricing } from "@/components/Pricing"
// import i18n from "@/utils/i18n"
import withAuth from "@/utils/withAuth"
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useTranslation } from 'react-i18next';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '');

function Purchase({ user }) {
    const { i18n } = useTranslation();

    return (
        <Elements stripe={stripePromise} options={{ locale: i18n.language }}>
            <Pricing user={user} />
        </Elements >
    )
}

export default withAuth(Purchase)
