//@ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next';
import stripe from 'stripe';

const stripeClient = new stripe(`${process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY}`);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { priceId } = req.body;
            const price = await stripeClient.prices.retrieve(priceId);
            return res.status(200).json({ priceObject: price });
        } catch (error) {
            console.error('Stripe API error:', error);
            return res.status(500).json({ error: 'Internal Server Error', details: error?.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end('Method Not Allowed');
    }
}
