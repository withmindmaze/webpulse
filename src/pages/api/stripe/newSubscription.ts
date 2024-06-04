//@ts-nocheck
import { NextApiRequest, NextApiResponse } from 'next';
import stripe from 'stripe';
import supabase from '@/utils/supabaseClient';

const stripeClient = new stripe(`${process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY}`);
console.log('ENV Secrets==============',process.env, '==============ENV Secrets');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { email, paymentMethodId, priceId, user_id } = req.body;

            // Create a customer in Stripe
            const customer = await stripeClient.customers.create({
                email: email,
                payment_method: paymentMethodId,
                invoice_settings: { default_payment_method: paymentMethodId },
            });

            // Create a subscription
            const subscription = await stripeClient.subscriptions.create({
                customer: customer.id,
                items: [{ price: priceId }],
                expand: ['latest_invoice.payment_intent'],
            });

            // Save the customer and subscription to Supabase
            const { data, error } = await supabase
                .from('user_plan')
                .insert([{
                    email: email,
                    payment_detail: subscription,
                    stripe_customer_id: customer.id,
                    subscription_id: subscription.id,
                    plan: 'premium',
                    user_id: user_id
                }]);

            if (error) throw error;

            res.status(200).json({ subscriptionId: subscription.id, clientSecret: subscription.latest_invoice.payment_intent.client_secret });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end('Method Not Allowed');
    }
}
