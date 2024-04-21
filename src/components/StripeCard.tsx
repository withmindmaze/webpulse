import React, { useState } from 'react';
import { Modal } from 'react-responsive-modal';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import 'react-responsive-modal/styles.css';
import supabase from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';
import { StripeCardElement } from '@stripe/stripe-js';

const StripeCard = ({ isOpen, handleOnClose }: any) => {
    const router = useRouter();
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement) as StripeCardElement;

        try {
            // Fetch the PaymentIntent from your API
            const response = await fetch(`/api/stripe/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });
            const data = await response.json();

            if (response.ok) {
                const result = await stripe.confirmCardPayment(data.clientSecret, {
                    payment_method: {
                        card: cardElement,
                    },
                });

                if (result.error) {
                    console.log('[error]', result.error);
                    alert('Error in processing payment: ' + result.error.message);
                } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
                    const getUser = await supabase.auth.getUser();
                    const { error: updateError } = await supabase
                        .from('user_plan')
                        .update({ plan: 'premium', payment_detail: result })
                        .eq('user_id', getUser.data.user?.id);

                    console.log('[PaymentIntent]', result.paymentIntent);
                    alert('Payment Successful!');
                    handleOnClose();
                    router.push('/');
                }
            } else {
                throw new Error(data.error.message);
            }
        } catch (error) {
            console.error('Payment error:', error);
            if(error instanceof Error && error?.message)
                alert('Error in processing payment: ' + error.message);
        }
    };

    return (
        <Modal open={isOpen} onClose={handleOnClose} center classNames={{ modal: 'bg-white rounded-lg shadow-lg overflow-hidden' }}>
            <form style={{ width: '400px', padding: '20px' }} onSubmit={handleSubmit} className="p-5 md:p-8 max-w-sm mx-auto">
                <h1 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Payment</h1>
                <div className="mb-4">
                    <CardElement options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }} />
                </div>
                <button type="submit" disabled={!stripe} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-150 ease-in-out">
                    Pay
                </button>
            </form>
        </Modal>
    );
};

export default StripeCard;
