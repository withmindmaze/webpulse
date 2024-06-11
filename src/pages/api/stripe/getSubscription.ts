//@ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next';
import stripe from 'stripe';

const stripeClient = new stripe(`${process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY}`);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { subscriptionId } = req.body;

            // Retrieve the subscription from Stripe
            const subscription = await stripeClient.subscriptions.retrieve(subscriptionId);

            // Determine if the subscription is considered cancelled
            const isCancelled = subscription.status === 'canceled';

            // Determine if the subscription is still valid
            const currentPeriodEndTimestamp = subscription.current_period_end * 1000;
            const isValid = subscription.status === 'active' || (isCancelled && currentPeriodEndTimestamp > Date.now());

            // Determine the next charge date, which is the end of the current period
            const nextChargeDate = new Date(currentPeriodEndTimestamp).toDateString();

            // Get currency and amount from the subscription's plan
            const currency = subscription.currency;
            const unitAmount = subscription.items.data[0].price.unit_amount;

            // Construct and send response
            return res.status(200).json({
                isValid,
                isCancelled,
                nextChargeDate,
                currentPeriodEndDate: nextChargeDate,  // The end of the current period is also when the current period ends
                currency,
                unitAmount
            });
        } catch (error) {
            console.error('Stripe API error:', error);
            return res.status(500).json({ error: 'Internal Server Error', details: error?.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end('Method Not Allowed');
    }
}
