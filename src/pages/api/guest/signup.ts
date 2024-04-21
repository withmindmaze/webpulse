import supabase from '@/utils/supabaseClient';
import { NextApiRequest, NextApiResponse } from 'next';
import nextCors from 'nextjs-cors';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await nextCors(req, res, {
        methods: ['POST', 'OPTIONS'],
        origin: '*',
        allowedHeaders: ['Content-Type'],
      });
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get the client's IP address from the request headers or connection info
        const ip_address = (req.headers['x-forwarded-for'] as string)?.split(',').shift() || req.socket.remoteAddress;

        // Check if an entry for this IP address already exists
        const { data: existingUser, error: existingUserError } = await supabase
            .from('guest_user')
            .select('*')
            .eq('ip_address', ip_address)
            .single();

        if (existingUserError && existingUserError.message !== 'Item not found') {
            throw existingUserError;
        }

        if (existingUser) {
            // If user with this IP already exists, return a message
            return res.status(200).json({ message: 'User already exists.', data: { id: existingUser.id } });
        } else {
            // If no user exists with this IP, insert a new record
            const { data, error } = await supabase
                .from('guest_user')
                .insert([{ ip_address }]).single();

            if (error) {
                throw error;
            }

            const { data: newUser, error: newUserError } = await supabase
                .from('guest_user')
                .select('*')
                .eq('ip_address', ip_address)
                .single();

            if (newUserError) {
                throw error;
            }

            return res.status(200).json({ message: 'User signed up successfully.', data: newUser });
        }
    } catch (error) {
        if(error instanceof Error)
            return res.status(500).json({ error: error.message });
    }
}
