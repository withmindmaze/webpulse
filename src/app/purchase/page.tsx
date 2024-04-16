'use client'
import { Pricing } from "@/components/Pricing"
import { Layout } from '@/components/Layout'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '');

export default function Purchase() {
    return (
        <Elements stripe={stripePromise}>
            <Pricing />
        </Elements>

    )
}
