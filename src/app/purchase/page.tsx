'use client'
import { Pricing } from "@/components/Pricing"
import { Layout } from '@/components/Layout'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import withAuth from "@/utils/withAuth";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '');

function Purchase() {
    return (
        <Elements stripe={stripePromise}>
            <Pricing />
        </Elements>

    )
}

export default withAuth(Purchase)
