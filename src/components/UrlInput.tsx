"use client"
import { BarsArrowUpIcon, GlobeAltIcon } from '@heroicons/react/20/solid'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Example() {
    const router = useRouter();
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAnalyzeClick = async () => {
        setIsLoading(true);
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}api/audit`;
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });
            const data = await response.json();
            localStorage.setItem('reportData', JSON.stringify(data));
            router.push(`/report`);
        } catch (error) {
            console.error('Error during API call:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-8 flex justify-center items-center px-1">
            <div className="max-w-2xl w-full">
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Get Performance
                </label>
                <div className="mt-2 flex rounded-md shadow-sm">
                    <div className="relative flex flex-grow items-stretch focus-within:z-10">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <GlobeAltIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="block w-full rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            placeholder="Enter URL"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>
                    <button
                        type="button"
                        className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        onClick={handleAnalyzeClick}
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-t-4 border-b-4 border-gray-900 animate-spin" />
                        ) : (
                            <>
                                <BarsArrowUpIcon className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                Analyze
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );

}
