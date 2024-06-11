//@ts-nocheck
"use client"
import supabase from '@/utils/supabaseClient';
import withAuth from '@/utils/withAuth';
import { BarsArrowUpIcon, GlobeAltIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'react-json-view-lite/dist/index.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { stringToUrl, validateURL } from '../utils/urlValidator';
import LightHouseStart from './LightHouseStart';
import Stats from './Report/page';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

function UrlInput() {
    const [categories, setCategories] = useState({ performance: true, accessibility: true, 'best-practices': true, seo: true, pwa: true });
    const [isLoading, setIsLoading] = useState(false);
    const [device, setDevice] = useState('desktop');
    const [iframeSrc, setIframeSrc] = useState('');
    const [fingerPrintExist, setFingerPrintExist] = useState(false);
    const [data, setData] = useState(null);
    const [jsonData, setJsonData] = useState(null);
    const [url, setUrl] = useState('');
    const { t } = useTranslation();
    const iframeRef = useRef(null);
    const router = useRouter();
    const [fpHash, setFpHash] = useState('');
    useEffect(() => {
        const setFp = async () => {
            setIsLoading(true);
            const fp = await FingerprintJS.load();
            const { visitorId } = await fp.get();
            const existingFingerprint = await supabase
                .from('browser_fingerprint')
                .select('fingerprint')
                .eq('fingerprint', visitorId);
            if (existingFingerprint.data?.length > 0) {
                setFingerPrintExist(true);
            }
            setFpHash(visitorId);
            setIsLoading(false);
        };
        setFp();
    }, []);

    useEffect(() => {
        if (data) {
            const blob = new Blob([data], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            setIframeSrc(url);

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

    // const printIframe = () => {
    //     var printContents = document.getElementById("statsDiv").innerHTML;
    //     var originalContents = document.body.innerHTML;
    //     document.body.innerHTML = printContents;
    //     window.print();
    //     document.body.innerHTML = originalContents;

    //     // const iframe = iframeRef.current;
    //     // if (iframe) {
    //     //     //@ts-ignore
    //     //     iframe?.contentWindow?.print();
    //     // }
    // };

    const printIframe = () => {
        // Open a new window for printing
        var printWindow = window.open('', '_blank');

        // Get the specific iframe by its title
        var iframe = document.querySelector('iframe[title="Audit Report"]') as HTMLIFrameElement;
        if (!iframe) {
            console.error('Audit Report iframe not found');
            return;
        }

        // Get the contents of statsDiv
        var statsContents = document.getElementById("statsDiv").innerHTML;

        // Clone the document of the iframe
        var iframeDocument = iframe.contentDocument.cloneNode(true) as Document;

        // Serialize the manipulated iframe content to HTML string
        var iframeContents = new XMLSerializer().serializeToString(iframeDocument.documentElement);

        // Create full HTML content by combining both parts, including necessary styles
        var fullContent = `
            <html>
                <head>
                    <style>
                        /* Add any styles that apply globally on your site */
                        body { font-family: 'Arial', sans-serif; }
                    </style>
                    ${Array.from(document.getElementsByTagName('link')).map(link => `<link rel="stylesheet" href="${link.href}">`).join('')}
                </head>
                <body>
                    <div class="stats-content">
                        ${statsContents}
                    </div>
                    <div class="iframe-content">
                        ${iframeContents}
                    </div>
                </body>
            </html>`;

        // Write the combined HTML content into the new window
        printWindow.document.write(fullContent);
        printWindow.document.close();

        // Print the new window's content after it has loaded
        printWindow.onload = function () {
            printWindow.focus(); // Focus the new window to ensure the print dialog covers it
            printWindow.print();
            printWindow.close(); // Close the new window after printing
        };
    };






    const callAuditApi = async (selectedCategories: any, getUser: any) => {
        const response = await fetch(`/api/audit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: stringToUrl(url),
                categories: selectedCategories,
                device: device,
                user_id: getUser?.data?.user?.id ? getUser?.data?.user?.id : undefined
            }),
        });
        const data = await response.json();
        if (data?.data?.report && data.jsonReport) {
            return data;
        } else {
            if (localStorage.getItem('language') === 'ar') {
                toast.error("هناك خطأ ما");
            } else {
                toast.error("Something went wrong");
            }
            return null;
        }
    }

    const canGenerateReport = (userPlan) => {
        if (userPlan.plan !== "free") {
            return true;  // Allow report generation for any paid plans.
        }

        // For free plan, check if there is a valid cancellation within the last 30 days.
        if (userPlan.cancellation_date) {
            const cancellationDate = new Date(userPlan.cancellation_date);
            const currentDate = new Date();
            const thirtyDaysAfterCancellation = new Date(cancellationDate);
            thirtyDaysAfterCancellation.setDate(cancellationDate.getDate() + 30);

            if (currentDate <= thirtyDaysAfterCancellation) {
                return true;  // Allow if within 30 days after cancellation.
            }
        }

        return false;  // Do not allow otherwise.
    }


    const authUserClick = async () => {
        const getUser = await supabase.auth.getUser();
        // Prepare categories array
        const selectedCategories = Object.keys(categories)
            // @ts-ignore
            .filter(key => categories[key])
            .map(key => key.toLowerCase());

        try {
            if (getUser.data.user?.id) {
                if (fingerPrintExist === true) {
                    const userSubscriptions = await supabase
                        .from('user_plan')
                        .select('*')
                        .eq('user_id', getUser.data.user?.id)
                        .single();
                    const userPlan = userSubscriptions?.data;
                    if (userPlan === undefined || !canGenerateReport(userPlan)) {
                        toast.info(t('toast.payment_info'));
                        router.push('/purchase');
                    } else {
                        const data = await callAuditApi(selectedCategories, getUser);
                        if (data !== null) {
                            toast.success(t('toast.audit_report_success'));
                            setData(data.data.report);
                            setJsonData(data.jsonReport);
                        } else {
                            return;
                        }
                    }
                } else {
                    const data = await callAuditApi(selectedCategories, getUser);
                    if (data !== null) {
                        toast.success(t('toast.audit_report_success'));
                        setData(data.data.report);
                        setJsonData(data.jsonReport);
                    }
                    else {
                        return;
                    }
                }
            } else {
                if (fingerPrintExist === true) {
                    toast.info(t('toast.sign_up_to_use'));
                    router.push('/register');
                } else {
                    const data = await callAuditApi(selectedCategories, getUser);
                    if (data !== null) {
                        toast.success(t('toast.audit_report_success'));
                        setData(data.data.report);
                        setJsonData(data.jsonReport);
                    } else {
                        return;
                    }
                }
            }
            await supabase
                .from('browser_fingerprint')
                .upsert([
                    { fingerprint: fpHash }
                ], { onConflict: 'fingerprint' });
            setFingerPrintExist(true);

        } catch (error) {
            console.error('Error during API call:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleAnalyzeClick = async () => {
        setIsLoading(true);
        if (await validateURL(url)) {
            authUserClick();
        } else {
            setIsLoading(false);
        }
    };

    const manipulateDOM = () => {
        const iframe = document.querySelector('iframe[title="Audit Report"]') as HTMLIFrameElement;
        if (iframe?.contentWindow?.document) {
            // Import Montserrat font into iframe
            const style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
            article.lh-root {
                font-family: 'Montserrat', sans-serif;
            }`;
            iframe.contentWindow.document.head.appendChild(style);

            // Change the document title
            const title = iframe.contentWindow.document.querySelector('title');
            if (title) {
                title.textContent = "Webpulse Audit Report";
            }

            // Locate the article tag and change its class from lh-dark to lh-light
            const article = iframe.contentWindow.document.querySelector('article.lh-root') as HTMLElement;
            if (article) {
                article.classList.remove('lh-dark');
                article.classList.add('lh-light');
                article.style.fontFamily = 'Montserrat, sans-serif';
                article.style.backgroundColor = '#FAFAFA';
            }
        }
        const iframeElement = iframeRef.current;
        if (iframeElement) {
            // @ts-ignore
            iframeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        const doc = iframe.contentDocument;
        // Hide the sticky header permanently
        //@ts-ignore
        const stickHeader = doc.querySelectorAll('.lh-sticky-header');
        stickHeader.forEach(header => {
            (header as HTMLElement).style.display = 'none';
        });

        //@ts-ignore
        const warnings = doc.querySelectorAll('.lh-warnings__msg');
        warnings.forEach(warning => {
            (warning as HTMLElement).style.display = 'none';
        });

        const topHeader = doc.querySelectorAll('.lh-topbar');
        topHeader.forEach(header => {
            (header as HTMLElement).style.display = 'none';
        });

        const scoreHeader = doc.querySelectorAll('.lh-scores-header');
        scoreHeader.forEach(header => {
            (header as HTMLElement).style.display = 'none';
        });

        //@ts-ignore
        const categoryHeader = doc.querySelectorAll('.lh-category-header');
        categoryHeader.forEach(header => {
            (header as HTMLElement).style.display = 'none';
        });

        // Hide specific elements
        const elementsToHide = [
            '.lh-category-header.lh-category-header__finalscreenshot',
            '.lh-audit-group.lh-audit-group--metrics',
            '.lh-filmstrip-container',
            '.lh-footer',
            '.lh-warnings lh-warnings--toplevel'
        ];
        elementsToHide.forEach(selector => {
            const element = doc.querySelector(selector) as HTMLElement;
            if (element) {
                element.style.display = 'none';
            }
        });
    };

    return (
        <div className="mt-8 flex flex-col justify-center items-center">
            <div className="max-w-2xl w-full bg-white p-6 rounded-lg shadow-md">
                <label htmlFor="email" className="block text-center text-sm font-medium leading-6 w-full">
                    <h1 className="text-2xl font-bold mb-4">{t('dashboard.searchHeading')}</h1>
                </label>

                <div className="mt-4 flex rounded-md shadow-sm bg-gray-50">
                    <div className="relative flex flex-grow items-stretch focus-within:z-10">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <GlobeAltIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="block w-full border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-400 placeholder:text-gray-400 focus:border-[#3bbed9] focus:outline-none focus:ring-[#3bbed9] focus:ring-1 sm:text-sm sm:leading-6"
                            placeholder={t('dashboard.urlPlaceHolder')}
                            value={url}
                            onChange={(e) => setUrl((e.target.value))}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleAnalyzeClick();
                                }
                            }}
                        />
                    </div>
                    <button
                        type="button"
                        className="relative inline-flex items-center gap-x-2 px-4 py-2 text-sm font-semibold text-gray-900 bg-[#3bbed9] text-white"
                        onClick={handleAnalyzeClick}
                    >

                        {isLoading ? (
                            <div className="w-5 h-5 border-t-4 border-b-4 border-white animate-spin" />
                        ) : (
                            <>
                                <BarsArrowUpIcon className="h-5 w-5 text-gray-200" aria-hidden="true" />
                                {t('dashboard.analyseButton')}
                            </>
                        )}
                    </button>
                </div>
                <div className='mt-4'>
                    <LightHouseStart
                        device={device}
                        categories={categories}
                        handleDeviceChange={handleDeviceChange}
                        handleCategoryChange={handleCategoryChange}
                    />
                </div>
            </div>

            {
                iframeSrc !== '' &&
                <button
                    onClick={printIframe}
                    className="my-4 bg-[#3bbed9] text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-[#32a8c1] transition-colors duration-300 ease-in-out"
                >
                    {t('dashboard.button_print_report')}
                </button>
            }
            <div id="statsDiv" style={{ minWidth: '-webkit-fill-available' }}>
                {
                    jsonData !== null && (
                        <Stats jsonData={jsonData} url={url} iframeSrc={iframeSrc} />
                    )
                }
            </div>
            {iframeSrc && (
                <iframe
                    id='reportIframe'
                    ref={iframeRef}
                    src={iframeSrc}
                    onLoad={manipulateDOM}
                    width="100%"
                    height="100%"
                    style={{ border: 'none', height: '100vh' }}
                    title='Audit Report'
                />
            )}
        </div>
    );
}
export default withAuth(UrlInput)