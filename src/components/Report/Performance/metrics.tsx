import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid';

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ');
}

const getColorClass = (score: any) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 50) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
};

export default function Metrics({ jsonData }: any) {
    const metrics = [
        {
            name: 'First Contentful Paint',
            score: (jsonData.audits['first-contentful-paint'].numericValue / 1000).toFixed(1),
            type: 'decrease',
            tooltip: 'First Contentful Paint marks the time at which the first text or image is painted.'
        },
        {
            name: 'Largest Contentful Paint',
            score: (jsonData.audits['largest-contentful-paint'].numericValue / 1000).toFixed(1),
            type: 'decrease',
            tooltip: 'Largest Contentful Paint marks the time at which the largest text or image is painted.'
        },
        {
            name: 'Total Blocking Time',
            score: (jsonData.audits['total-blocking-time'].numericValue).toFixed(1),
            type: 'decrease',
            tooltip: 'Sum of all time periods between FCP and Time to Interactive, when task length exceeded 50ms, expressed in milliseconds.'
        },
        {
            name: 'Cumulative Layout Shift',
            score: (jsonData.audits['cumulative-layout-shift'].numericValue / 100).toFixed(1),
            type: 'decrease',
            tooltip: 'Cumulative Layout Shift measures the movement of visible elements within the viewport.'
        },
        {
            name: 'Speed Index',
            score: (jsonData.audits['speed-index'].numericValue / 1000).toFixed(1),
            type: 'decrease',
            tooltip: 'Speed Index shows how quickly the contents of a page are visibly populated.'
        }
    ];

    return (
        <div>
            <dl className="mt-5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-5 md:divide-x md:divide-y-0">
                {metrics.map((item) => (
                    <div key={item.name} className="px-4 py-5 sm:p-6 relative group">
                        <dt className="text-base font-normal text-gray-900">{item.name}
                            <span className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-max hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                                Score: {item.score}
                            </span>
                        </dt>
                        <span className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-max hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                            Score: {item.tooltip}
                        </span>
                        <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                            <div className="flex items-baseline text-2xl font-semibold text-[#3bbed9]">
                                {item.score}
                            </div>

                            <div
                                className={classNames(
                                    getColorClass(parseFloat(item.score)),
                                    'inline-flex items-baseline rounded-full px-2.5 py-2 text-sm font-medium md:mt-2 lg:mt-0'
                                )}
                            >
                            </div>
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}
