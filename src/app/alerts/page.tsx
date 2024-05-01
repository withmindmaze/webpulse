//@ts-nocheck
'use client'

import { useState, useEffect } from 'react';
import supabase from "@/utils/supabaseClient";
import withAuth from "@/utils/withAuth";
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

function Alerts() {
    const [url, setUrl] = useState('');
    const [saving, setSaving] = useState(false);
    const [email, setEmail] = useState('');
    const [alerts, setAlerts] = useState([]);
    const [currentAlert, setCurrentAlert] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [frequency, setFrequency] = useState('');
    const { t } = useTranslation();
    const [metrics, setMetrics] = useState({
        Performance: '',
        Accessibility: '',
        SEO: '',
        PWA: '',
    });

    const reloadStates = () => {
        setSaving(false);
        setUrl('');
        setFrequency('');
        setMetrics({
            Performance: '',
            Accessibility: '',
            SEO: '',
            PWA: '',
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
        fetchAlerts();
    };

    const handleUpdate = async (updatedAlert: any) => {
        const { data, error } = await supabase.from('alert').update({
            url: updatedAlert.url,
            email: updatedAlert.email
        }).match({ id: updatedAlert.id });

        if (!error) {
            fetchAlerts();
            setIsModalOpen(false);
        } else {
            console.error('Update error:', error);
        }
    };

    const openModal = (alert) => {
        setCurrentAlert(alert);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        const { data: user, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            toast.error('Authentication error or no user data');
            return;
        }

        const { data, error } = await supabase
            .from('alert')
            .select('*')
            .eq('user_id', user.user.id);

        if (error) {
            toast.error('Failed to fetch alerts');
            console.error('Failed to fetch alerts:', error);
        } else {
            setAlerts(data);
        }
    };

    const handleDelete = async (alertId: any) => {
        const { data, error } = await supabase
            .from('alert')
            .delete()
            .match({ id: alertId });

        if (error) {
            toast.error('Failed to delete alert');
            console.error('Failed to delete alert:', error);
        } else {
            toast.success('Alert deleted successfully');
            fetchAlerts();
        }
    };

    function formatMetrics(metrics: any) {
        return Object.entries(metrics).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
                <span className="font-semibold">{key}:</span>
                <span className="ml-4">{value}</span>
            </div>
        ));
    }

    function EditAlertModal({ isOpen, onClose, alert, onSave }: any) {
        const [localAlert, setLocalAlert] = useState(alert);

        useEffect(() => {
            setLocalAlert(alert); // Update local state when alert changes
        }, [alert]);

        const handleChange = (e) => {
            const { name, value } = e.target;
            setLocalAlert(prev => ({ ...prev, [name]: value }));
        };

        const handleSubmit = () => {
            onSave(localAlert);
            onClose();
        };

        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
                <div className="bg-white p-4 rounded-lg max-w-sm w-full">
                    <h2 className="text-lg text-[#3bbed9] font-semibold">Edit Alert</h2>
                    <label className="block mt-4">
                        URL:
                        <input type="text" name="url" value={localAlert.url} onChange={handleChange} className="mt-1 block w-full p-2 border rounded" />
                    </label>
                    <label className="block mt-4">
                        Email:
                        <input type="text" name="email" value={localAlert.email} onChange={handleChange} className="mt-1 block w-full p-2 border rounded" />
                    </label>
                    <div className="flex justify-between space-x-4 mt-6">
                        <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded">
                            Cancel
                        </button>
                        <button onClick={handleSubmit} className="bg-[#3bbed9] text-white py-2 px-4 rounded">
                            Save
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const renderMetricName = (metric_english: any) => {
        if (localStorage.getItem('language') === 'ar') {
            if (metric_english === "Performance") {
                return "الأداء";
            } else if (metric_english === "Accessibility") {
                return "السهولة";
            } else if (metric_english === "PWA") {
                return "تطبيق ويب تقدمي";
            } else if (metric_english === "SEO") {
                return "تحسين محركات البحث";
            }
        }
        return metric_english;
    }


    return (
        <div className="flex flex-col items-center w-full">
            <div className="max-w-xl flex flex-col items-center justify-center p-8 shadow-lg rounded-lg bg-white">
                <h2 className="text-lg text-center font-semibold mb-4 text-[#3bbed9]">{t('alert.heading_top')}</h2>
                <p className="text-sm text-gray-600 mb-6 text-center">
                    {t('alert.text_guide')}                </p>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block">
                            {t('alert.label_url')}
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="mt-1 block w-full p-3 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3bbed9] focus:border-[#3bbed9] transition duration-300 ease-in-out cursor-pointer hover:bg-blue-50"
                            />
                            <p className="text-xs mt-1 text-gray-500">{t('alert.info_url')}</p>
                        </label>
                    </div>
                    <div>
                        <label className="block">
                            {t('alert.label_email')}
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full p-3 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3bbed9] focus:border-[#3bbed9] transition duration-300 ease-in-out cursor-pointer hover:bg-blue-50"
                            />
                            <p className="text-xs mt-1 text-gray-500">{t('alert.info_email')}</p>
                        </label>
                    </div>
                    <h5 className="text-xs mt-1 text-gray-500 flex-1">{t('alert.info_threshold')}</h5>
                    {Object.keys(metrics).map((metric) => (
                        <div key={metric} className="flex items-center space-x-4 mb-2">
                            <input
                                type="checkbox"
                                checked={metrics[metric] !== ''}
                                onChange={(e) => handleMetricChange(metric, e.target.checked)}
                                className="form-checkbox h-5 w-5"
                            />
                            <span className="flex-1">{renderMetricName(metric)}</span>
                            {metrics[metric] !== '' && (
                                <input
                                    type="number"
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
                            {t('alert.label_frequency')}
                            <select
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value)}
                                className="w-96 mb-4 p-3 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3bbed9] focus:border-[#3bbed9] transition duration-300 ease-in-out cursor-pointer hover:bg-blue-50"
                            >
                                <option value="">{t('alert.placeholder_frequency')}</option>
                                <option value="12 hours">{t('alert.frequency_12_hours')}</option>
                                <option value="24 hours">{t('alert.frequency_24_hours')}</option>
                            </select>
                            <p className="text-xs mt-1 text-gray-500">{t('alert.info_frequency')}</p>
                        </label>
                    </div>
                    <button disabled={saving} type="submit" className="px-6 py-3 w-full text-white bg-[#3bbed9] rounded-md hover:bg-[#3391a6] focus:outline-none focus:ring-2 focus:ring-[#3bbed9] focus:ring-offset-2 transition duration-300 ease-in-out">
                        {saving ? t('alert.button_saving') : t('alert.button_save')}
                    </button>
                </form>
            </div>
            <div className="overflow-x-auto relative shadow-md sm:rounded-lg my-5">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-[#3bbed9] text-left text-xs font-semibold text-white uppercase tracking-wider">
                                {t('alert.table_header_url')}
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-[#3bbed9] text-left text-xs font-semibold text-white uppercase tracking-wider">
                                {t('alert.table_header_metrics')}
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-[#3bbed9] text-left text-xs font-semibold text-white uppercase tracking-wider">
                                {t('alert.table_header_frequency')}
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-[#3bbed9] text-left text-xs font-semibold text-white uppercase tracking-wider">
                                {t('alert.table_header_email')}
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-[#3bbed9] text-left text-xs font-semibold text-white uppercase tracking-wider">
                                {t('alert.table_header_action')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {alerts.map((alert) => (
                            <tr key={alert.id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {alert.url}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {formatMetrics(alert.metrics)}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {alert.frequency}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {alert.email}
                                </td>
                                <td className="h-full px-5 py-10 border-b border-gray-200 bg-white text-sm flex flex-col justify-center space-y-2">
                                    <button onClick={() => handleDelete(alert.id)} className="text-red-500 hover:text-red-700 self-center">
                                        {t('alert.button_delete')}
                                    </button>
                                    <button onClick={() => openModal(alert)} className="text-[#3bbed9] hover:text-blue-700 self-center">
                                        {t('alert.button_update')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <EditAlertModal
                isOpen={isModalOpen}
                onClose={closeModal}
                alert={currentAlert}
                onSave={handleUpdate}
            />
        </div>
    );
}

export default withAuth(Alerts);
