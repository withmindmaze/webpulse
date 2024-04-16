import supabase from '@/utils/supabaseClient';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get the client's IP address from the request headers or connection info
        const ip_address = req.headers['x-forwarded-for']?.split(',').shift() || req.socket.remoteAddress;

        // Check if an entry for this IP address already exists
        const { data: existingUser, error: existingUserError } = await supabase
            .from('guest_user')
            .select('*')
            .eq('ip_address', ip_address)
            .single();

        if (existingUserError && existingUserError.message !== 'Item not found') {
            throw existingUserError;
        }

        return res.status(200).json({ attempts: existingUser.attempts });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
