'use client'
import { useState, useEffect } from 'react';
import supabase from "@/utils/supabaseClient";
import withAuth from "@/utils/withAuth";
import { toast } from 'react-toastify';

function Alerts() {
    const [url, setUrl] = useState('');
    const [saving, setSaving] = useState(false);
    const [email, setEmail] = useState('');
    const [metrics, setMetrics] = useState({
        Performance: '',
        Accessibility: '',
        SEO: '',
        PWA: '',
        BestPractices: ''
    });
    const [frequency, setFrequency] = useState('');

    const reloadStates = () => {
        setSaving(false);
        setUrl('');
        setFrequency('');
        setMetrics({
            Performance: '',
            Accessibility: '',
            SEO: '',
            PWA: '',
            BestPractices: ''
        });
    }

    const handleMetricChange = (metric: any, isChecked: any) => {
        setMetrics(prevMetrics => ({
            ...prevMetrics,
            [metric]: isChecked ? '50' : ''
        }));
    };

    const handleThresholdChange = (metric: any, value: any) => {
        setMetrics(prevMetrics => ({
            ...prevMetrics,
            [metric]: value
        }));
    };

    const handleSave = async (e: any) => {
        e.preventDefault();
        setSaving(true);
        const { data: user, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            toast.error('Authentication error or no user data');
            console.error('Authentication error or no user data:', userError);
            return;
        }

        const selectedCategories = Object.fromEntries(
            Object.entries(metrics).filter(([_, value]) => value !== '')
        );

        const { data, error } = await supabase.from('alert').insert([{
            user_id: user.user.id,
            url,
            metrics: selectedCategories,
            frequency,
            email
        }]);

        if (error) {
            toast.error('Failed to save alert settings');
            console.error('Failed to save alert settings:', error);
        } else {
            toast.success('Alert configured successfully for the entered URL');
            console.log('Alert settings saved successfully:', data);
        }
        reloadStates();
    };

    return (
        <div className="flex justify-center items-center w-full h-full">
            <div className="max-w-xl flex flex-col items-center justify-center p-8 shadow-lg rounded-lg bg-white">
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block">
                            URL to monitor:
                            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} className="mt-1 block w-full p-3 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3bbed9] focus:border-[#3bbed9] transition duration-300 ease-in-out cursor-pointer hover:bg-blue-50" />
                        </label>
                    </div>
                    <div>
                        <label className="block">
                            Email to receive alerts:
                            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full p-3 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3bbed9] focus:border-[#3bbed9] transition duration-300 ease-in-out cursor-pointer hover:bg-blue-50" />
                        </label>
                    </div>
                    {Object.keys(metrics).map((metric) => (
                        <div key={metric} className="flex items-center space-x-4 mb-2">
                            <input
                                type="checkbox"
                                //@ts-ignore
                                checked={metrics[metric] !== ''}
                                onChange={(e) => handleMetricChange(metric, e.target.checked)}
                                className="form-checkbox h-5 w-5"
                            />
                            <span className="flex-1">{metric}</span>

                            {
                                //@ts-ignore
                                metrics[metric] !== '' && (
                                    <input
                                        type="number"
                                        //@ts-ignore
                                        value={metrics[metric]}
                                        onChange={(e) => handleThresholdChange(metric, e.target.value)}
                                        min="0"
                                        className="w-20 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#3bbed9]"
                                        placeholder="Threshold"
                                    />
                                )}
                        </div>
                    ))}

                    <div>
                        <label>
                            Frequency:
                            <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-96 mb-4 p-3 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3bbed9] focus:border-[#3bbed9] transition duration-300 ease-in-out cursor-pointer hover:bg-blue-50">
                                <option value="">Select frequency</option>
                                <option value="12 hours">Every 12 hours</option>
                                <option value="24 hours">Every 24 hours</option>
                            </select>
                        </label>
                    </div>
                    <button disabled={saving} type="submit" className="px-6 py-3 w-full text-white bg-[#3bbed9] rounded-md hover:bg-[#3391a6] focus:outline-none focus:ring-2 focus:ring-[#3bbed9] focus:ring-offset-2 transition duration-300 ease-in-out">
                        {saving === true ? 'Saving' : 'Save'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default withAuth(Alerts);
