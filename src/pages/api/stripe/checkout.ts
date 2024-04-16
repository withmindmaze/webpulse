import type { NextApiRequest, NextApiResponse } from 'next';
import stripe from 'stripe';

const stripeClient = new stripe(`${process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY}`);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { } = req.body;
            const paymentIntent = await stripeClient.paymentIntents.create({
                amount: 1000,
                currency: 'usd',
                payment_method_types: ['card'],
            });

            res.status(200).json({ clientSecret: paymentIntent.client_secret });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end('Method Not Allowed');
    }
}
