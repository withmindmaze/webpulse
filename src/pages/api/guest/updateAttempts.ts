import supabase from '@/utils/supabaseClient';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get the client's IP address from the request headers or connection info
        const ip_address = (req.headers['x-forwarded-for'] as string)?.split(',').shift() || req.socket.remoteAddress;

        // Check if an entry for this IP address already exists
        const guestUser = await supabase
            .from('guest_user')
            .select('*')
            .eq('ip_address', ip_address)
            .single();

        const updateGuest = await supabase
            .from('guest_user')
            .update({ attempts: guestUser.data.attempts + 1 })
            .eq('ip_address', ip_address)

        if (updateGuest.error) {
            throw updateGuest.error;
        }

        return res.status(200).json({ data: "updated guest attempts" });
    } catch (error) {
        if(error instanceof Error)
            return res.status(500).json({ error: error.message });
    }
}
