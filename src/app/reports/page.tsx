'use client'
import { useEffect, useState } from 'react';
import supabase from "@/utils/supabaseClient";
import withAuth from "@/utils/withAuth";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register the chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
interface GraphData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        borderColor: string;
        backgroundColor: string;
    }[];
}

interface TableRow {
    url: string;
    performance: number;
    accessibility: number;
    seo: number;
    pwa: number;
    date: string;
}

function Reports() {
    const [urls, setUrls] = useState<string[]>([]);
    const [selectedUrl, setSelectedUrl] = useState('');
    const [graphData, setGraphData] = useState<GraphData | null>(null);
    const [individualGraphData, setIndividualGraphData] = useState({});
    const [tableData, setTableData] = useState<TableRow[]>([]);
    const [loading, setLoading] = useState(true);

    const normalizeUrl = (url: string) => {
        return url
            .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "") // Remove protocol and www
            .split('/')[0]; // Remove path and query string parts, focus only on domain
    };

    useEffect(() => {
        const fetchUrls = async () => {
            const { data: user } = await supabase.auth.getUser();
            const { data, error } = await supabase
                .from('report')
                .select('url')
                .eq('user_id', user?.user?.id);

            if (error) console.error('error fetching urls', error);
            else {
                const uniqueUrls = new Set(data.map(item => item.url));
                setUrls(Array.from(uniqueUrls));
            }
            setLoading(false);
        };
        fetchUrls();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('report')
                .select('json_report, created_at')
                .eq('url', selectedUrl);

            if (error) {
                console.error('error fetching reports', error);
            } else {
                const chartData = {
                    labels: data.map(d => new Date(d.created_at).toLocaleDateString()),
                    datasets: [
                        {
                            label: 'Performance Score',
                            data: data.map(d => d.json_report.categories.performance.score),
                            borderColor: 'rgb(255, 99, 132)',
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        },
                        {
                            label: 'Accessibility Score',
                            data: data.map(d => d.json_report.categories.accessibility.score),
                            borderColor: 'rgb(53, 162, 235)',
                            backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        },
                        {
                            label: 'SEO Score',
                            data: data.map(d => d.json_report.categories.seo.score),
                            borderColor: 'rgb(75, 192, 192)',
                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        },
                        {
                            label: 'PWA Score',
                            data: data.map(d => d.json_report.categories.pwa.score),
                            borderColor: 'rgb(153, 102, 255)',
                            backgroundColor: 'rgba(153, 102, 255, 0.5)',
                        }
                    ],
                };
                const tableData = data.map(d => ({
                    url: selectedUrl,
                    performance: d.json_report.categories.performance.score,
                    accessibility: d.json_report.categories.accessibility.score,
                    seo: d.json_report.categories.seo.score,
                    pwa: d.json_report.categories.pwa.score,
                    date: new Date(d.created_at).toLocaleDateString()
                }));
                setGraphData(chartData);
                setTableData(tableData);

                // Prepare individual graphs data
                const individualData = {};
                chartData.datasets.forEach(dataset => {
                    //@ts-ignore
                    individualData[dataset.label] = {
                        labels: chartData.labels,
                        datasets: [dataset]
                    };
                });
                setIndividualGraphData(individualData);
            }
        };
        if (selectedUrl) {
            fetchData();
        }
    }, [selectedUrl]);

    if (loading === true) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-lg font-semibold text-gray-800">
                    Loading...
                </div>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col items-center justify-center p-8">
                <select
                    value={selectedUrl}
                    onChange={(e) => setSelectedUrl(e.target.value)}
                    className="w-96 mb-4 p-3 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3bbed9] focus:border-[#3bbed9] transition duration-300 ease-in-out cursor-pointer hover:bg-blue-50"
                >
                    <option value="">Select a URL</option>
                    {urls.map(url => (
                        <option key={url} value={url}>{url}</option>
                    ))}
                </select>
                {graphData?.labels && (
                    <>
                        <div className="shadow-lg rounded-lg w-full">
                            <Line data={graphData} options={{
                                responsive: true,
                                scales: {
                                    y: {
                                        beginAtZero: true
                                    }
                                },
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    tooltip: {
                                        mode: 'index',
                                        intersect: false,
                                    },
                                }
                            }} />
                        </div>
                        <div className="flex flex-wrap justify-center">
                            {Object.keys(individualGraphData).map(key => (
                                <div key={key} className="w-full sm:w-1/2 p-2">
                                    <div className="shadow-lg rounded-lg overflow-hidden">  {/* Added shadow and rounded corners */}
                                        <h2 className="text-lg font-semibold mb-2 bg-gray-100 p-3">{key}</h2>
                                        {/**@ts-ignore */}
                                        <Line data={individualGraphData[key]} options={{
                                            responsive: true,
                                            maintainAspectRatio: true,
                                            scales: {
                                                y: {
                                                    beginAtZero: true
                                                }
                                            },
                                            plugins: {
                                                legend: {
                                                    display: false
                                                },
                                                tooltip: {
                                                    mode: 'index',
                                                    intersect: false,
                                                },
                                            }
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {tableData && tableData.length > 0 && (
                    <div className="overflow-x-auto relative shadow-md sm:rounded-lg my-5">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="py-3 px-6">URL</th>
                                    <th scope="col" className="py-3 px-6">Performance</th>
                                    <th scope="col" className="py-3 px-6">Accessibility</th>
                                    <th scope="col" className="py-3 px-6">SEO</th>
                                    <th scope="col" className="py-3 px-6">PWA</th>
                                    <th scope="col" className="py-3 px-6">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((item, index) => (
                                    <tr key={index} className="bg-white border-b">
                                        <td className="py-4 px-6">{item.url}</td>
                                        <td className="py-4 px-6">{item.performance}</td>
                                        <td className="py-4 px-6">{item.accessibility}</td>
                                        <td className="py-4 px-6">{item.seo}</td>
                                        <td className="py-4 px-6">{item.pwa}</td>
                                        <td className="py-4 px-6">{item.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    }


}

export default withAuth(Reports);
