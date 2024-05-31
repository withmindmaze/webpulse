import type { NextApiRequest, NextApiResponse } from 'next';
import stripe from 'stripe';
import supabase from '@/utils/supabaseClient';

const stripeClient = new stripe(`${process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY}`);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { userId, return_url } = req.body;

            const { data: user, error } = await supabase
                .from('user_plan')
                .select('stripe_customer_id')
                .eq('user_id', userId)
                .single();

            if (error) {
                return res.status(400).json({ error: 'User not found' });
            }

            const session = await stripeClient.billingPortal.sessions.create({
                customer: user.stripe_customer_id,
                return_url: `${return_url}/purchase`,
            });

            res.json({ url: session.url });
        } catch (error) {
            if (error instanceof Error)
                res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end('Method Not Allowed');
    }
}
