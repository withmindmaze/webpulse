"use client"
import { BarsArrowUpIcon, GlobeAltIcon } from '@heroicons/react/20/solid'
import React, { useEffect, useState } from 'react';
import { JsonView, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import LightHouseStart from './LightHouseStart';
import Performance from './Performance/page';
import withAuth from '@/utils/withAuth';
import supabase from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';

function UrlInput() {
    const router = useRouter();
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null);
    const [device, setDevice] = useState('desktop');
    const [iframeSrc, setIframeSrc] = useState('');
    const [categories, setCategories] = useState({
        performance: true,
        accessibility: true,
        bestPractices: true,
        seo: true,
        pwa: true
    });

    // const shouldExpandNode = (level: number, value: any, field: any) => level < 2;

    useEffect(() => {
        if (data) {
            // Assuming `data.report` is a string containing your HTML report
            const blob = new Blob([data], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            setIframeSrc(url);

            // Clean up the blob URL when the component unmounts
            return () => {
                URL.revokeObjectURL(url);
            };
        }
    }, [data]);

    const handleDeviceChange = (event: any) => {
        setDevice(event.target.value);
    };

    const handleCategoryChange = (event: any) => {
        setCategories({ ...categories, [event.target.name]: event.target.checked });
    };

    const authUserClick = async () => {
        setIsLoading(true);
        // Prepare categories array
        const selectedCategories = Object.keys(categories)
            // @ts-ignore
            .filter(key => categories[key])
            .map(key => key.toLowerCase());

        try {
            const response = await fetch(`/api/audit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url, categories: selectedCategories, device: device }),
            });
            const data = await response.json();
            const getUser = await supabase.auth.getUser();;
            if (getUser.data.user?.id) {
                if (localStorage.getItem('isFirstReport') === 'false') {
                    const userPlan = await supabase
                        .from('user_plan')
                        .select('*')
                        .eq('user_id', getUser.data.user?.id)
                        .single();
                    if (userPlan.data.plan === "free") {
                        router.push('/purchase');
                    } else {
                        setData(data.data.report);
                    }
                } else {
                    setData(data.data.report);
                }
            } else {
                if (localStorage.getItem('isFirstReport') === 'false') {
                    router.push('/register');
                } else {
                    setData(data.data.report);
                }
            }
            localStorage.setItem('isFirstReport', 'false');
        } catch (error) {
            console.error('Error during API call:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleAnalyzeClick = async () => {
        authUserClick();
    };

    const hideLHTopbar = () => {
        const iframe = document.querySelector('iframe[title="Lighthouse Report"]') as HTMLIFrameElement;
        if (iframe?.contentWindow?.document) {
            const topBar = iframe?.contentWindow?.document.querySelector('.lh-topbar') as HTMLElement;
            if (topBar) {
                topBar.style.display = 'none';
            }
            const footer = iframe.contentWindow.document.querySelector('.lh-footer') as HTMLElement;
            if (footer) {
                footer.style.display = 'none';
            }
        }
    };

    return (
        <div className="mt-8 flex flex-col justify-center items-center">
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
            <LightHouseStart
                device={device}
                categories={categories}
                handleDeviceChange={handleDeviceChange}
                handleCategoryChange={handleCategoryChange}
            />
            {iframeSrc && (
                <iframe
                    src={iframeSrc}
                    onLoad={hideLHTopbar}
                    width="100%"
                    height="100%"
                    style={{ border: 'none', height: '100vh' }}
                    title="Lighthouse Report"
                />
            )}
        </div >
    );

}
export default withAuth(UrlInput)