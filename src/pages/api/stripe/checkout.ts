import type { NextApiRequest, NextApiResponse } from 'next';
import stripe from 'stripe';

const stripeClient = new stripe(`${process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY}`);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { email } = req.body;

            // Create a new customer or use an existing one
            const customer = await stripeClient.customers.create({
                email: email
            });

            // Create a subscription
            const subscription = await stripeClient.subscriptions.create({
                customer: customer.id,
                items: [{ plan: 'plan_ID' }],
                expand: ['latest_invoice.payment_intent'],
            });

            //@ts-ignore
            const clientSecret = subscription?.latest_invoice.payment_intent?.client_secret;
            res.status(200).json({ clientSecret: clientSecret });

        } catch (error) {
            if (error instanceof Error)
                res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end('Method Not Allowed');
    }
}
