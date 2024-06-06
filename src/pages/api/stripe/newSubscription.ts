//@ts-nocheck
import { NextApiRequest, NextApiResponse } from 'next';
import stripe from 'stripe';
import supabase from '@/utils/supabaseClient';
const stripeClient = new stripe(`${process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY}`);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end('Method Not Allowed');
    }
    const { email, paymentMethodId, priceId, user_id } = req.body;
    let customer, subscription;

    try {
        // Create a customer in Stripe
        customer = await stripeClient.customers.create({
            email: email,
            payment_method: paymentMethodId,
            invoice_settings: { default_payment_method: paymentMethodId },
        });

        // Create a subscription
        subscription = await stripeClient.subscriptions.create({
            customer: customer.id,
            items: [{ price: priceId }],
            expand: ['latest_invoice.payment_intent'],
        });

    } catch (stripeError) {
        console.error('Stripe error:', stripeError);
        return res.status(500).json({
            error: 'Failed to create customer or subscription in Stripe.',
            message: stripeError.message
        });
    } finally {
        try {
            // Save the customer and subscription to Supabase
            if (subscription?.status !== 'active') {
                throw new Error('Something went wrong with your subscription.')
            }
            if (supabase.auth.getSession() === null) {
                console.log(supabase.auth.getSession());
                // throw new Error('User is not authenticated.')
            }
            // console.log(supabase)
            const { data, error } = await supabase
                .from('user_plan')
                .upsert([{
                    email: email,
                    payment_detail: subscription,
                    stripe_customer_id: customer.id,
                    subscription_id: subscription.id,
                    plan: 'premium',
                    user_id: user_id
                }], {
                    onConflict: 'user_id'
                });
            console.log("newSubscription.ts ~ handler ~ data:", data)

            if (error) {
                console.log("error while storing user_plan", error)
            }

            return res.status(200).json({ subscriptionId: subscription.id });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Failed to save subscription details.', message: error.message });
        }
    }
}
