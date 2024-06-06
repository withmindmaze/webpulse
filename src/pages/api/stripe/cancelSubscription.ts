import type { NextApiRequest, NextApiResponse } from 'next';
import stripe from 'stripe';
import supabase from '@/utils/supabaseClient';

const stripeClient = new stripe(`${process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY}`);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { userId } = req.body;

            const subscriptionDetails = await supabase
                .from('user_plan')
                .select('subscription_id')
                .eq('user_id', userId)
                .single();

            const subScriptionId = subscriptionDetails.data?.subscription_id;
            // stripeClient.subscriptions.update(subScriptionId, { cancel_at_period_end: false });
            const sub = await stripeClient.subscriptions.retrieve(subScriptionId);
            if (sub.status === 'canceled') {
                return res.status(200).json({ success: 'Subscription already cancelled' });
            }
            const subscription = await stripeClient.subscriptions.cancel(
                subScriptionId
            );
            const cancellation_date = new Date().toISOString().split('T')[0];
            await supabase
                .from('user_plan')
                .update({
                    plan: 'free',
                    payment_detail: null,
                    stripe_customer_id: null,
                    subscription_id: null,
                    cancellation_date: cancellation_date,
                    subscription_date: null
                })
                .eq('user_id', userId);
            return res.status(200).json({ success: subscription });
        } catch (error) {
            if (error instanceof Error)
                res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end('Method Not Allowed');
    }
}
