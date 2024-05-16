import { useState } from "react";
import PerformanceMetrics from "./Performance/metrics";
import PerformanceTabs from "./Performance/tabs";
import AccessibilityTabs from "./Accessibility/tabs";
import SeoTabs from "./SEO/tabs";
import PwaTabs from "./PWA/tabs";

const prepareStatsArray = (jsonData: any) => {
    const stats = [];
    const categories = jsonData.categories;

    let idCounter = 1;
    for (const key in categories) {
        if (categories[key]) {
            stats.push({
                id: idCounter++,
                name: categories[key].title,
                value: (categories[key].score * 100).toFixed(1),
            });
        }
    }

    return stats;
};

const getColorClass = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 50) return 'text-orange-500';
    return 'text-red-500';
};

export default function Stats({ jsonData, url, iframeSrc }: any) {
    const stats = prepareStatsArray(jsonData);
    const [selectedCategory, setSelectedCategory] = useState(stats[0]?.name);
    const [selectedTab, setSelectedTab] = useState(1);
    console.log({selectedCategory});

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:max-w-none">
                    <div className="text-center">
                        <p className="mt-4 text-xl text-gray-600">
                            <span className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-800 rounded-md">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.9 4.6a1 1 0 00-1.4 1.4l3.3 3.3H5a1 1 0 000 2h9.8l-3.3 3.3a1 1 0 001.4 1.4l5-5a1 1 0 000-1.4l-5-5z" clipRule="evenodd" />
                                </svg>
                                {url}
                            </span>
                        </p>
                    </div>
                    <dl className="mt-8 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat) => (
                            <div
                                key={stat.id}
                                className={`rounded-2xl flex flex-col bg-gray-400/5 p-8 cursor-pointer ${selectedCategory === stat.name ? 'border-4 border-[#3bbed9]' : ''
                                    }`}
                                onClick={() => setSelectedCategory(stat.name)}
                            >
                                <dt className={`text-sm font-semibold leading-6 ${getColorClass(parseFloat(stat.value))}`}>{stat.name}</dt>
                                <dd className={`order-first text-3xl font-semibold tracking-tight ${getColorClass(parseFloat(stat.value))}`}>{stat.value}</dd>
                            </div>
                        ))}
                    </dl>
                    {
                        selectedCategory === 'Performance' &&
                        <>
                            < PerformanceMetrics jsonData={jsonData} />
                            <PerformanceTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} iframeSrc={iframeSrc} />
                        </>
                    }
                    {
                        selectedCategory === 'Accessibility' &&
                        <>
                            {/* <AccessibilityMetrics jsonData={jsonData} /> */}
                            <AccessibilityTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} iframeSrc={iframeSrc} />
                        </>
                    }
                    {
                        selectedCategory === 'SEO' &&
                        <>
                            {/* <AccessibilityMetrics jsonData={jsonData} /> */}
                            <SeoTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} iframeSrc={iframeSrc} />
                        </>
                    }
                    {
                        selectedCategory === 'PWA' &&
                        <>
                            {/* <AccessibilityMetrics jsonData={jsonData} /> */}
                            <PwaTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} iframeSrc={iframeSrc} />
                        </>
                    }
                </div>
            </div>
        </div>
    );
}
