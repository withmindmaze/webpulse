import type { NextApiRequest, NextApiResponse } from 'next';
import stripe from 'stripe';
import supabase from '@/utils/supabaseClient';

const stripeClient = new stripe(`${process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY}`);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { } = req.body;
            let event = req.body;
            switch (event.type) {
                case 'invoice.paid':
                    const eventData = event.data.object;
                    const customer = await stripeClient.customers.retrieve(eventData.customer);
                    const customerEmail = customer.email;
                    console.log('Customer Email:', customerEmail);
                    // Query Supabase to update user plan
                    const { error: updateError } = await supabase
                        .from('user_plan')
                        .update({ plan: 'premium', payment_detail: eventData })
                        .eq('email', customerEmail);

                    if (updateError) {
                        console.log("updare user_plan error", updateError);
                    }

                    break;
                default:
                // Unexpected event type
                // console.log(`Unhandled event type ${event.type}.`);
            }

            res.status(200).json({});

        } catch (error) {
            if (error instanceof Error)
                res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end('Method Not Allowed');
    }
}
