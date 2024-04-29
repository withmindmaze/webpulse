import { useTranslation } from 'react-i18next';

export default function LightHouseStart({ device, categories, handleDeviceChange, handleCategoryChange }: any) {
    const { t } = useTranslation();

    return (
        <div className="mt-1 w-full bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
            <div className="flex flex-col gap-4 mb-4">
                {/* Mode section */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center">
                            <input type="radio" name="mode" className="form-radio" checked />
                            <span className="ml-2">{t('dashboard.radio_navigation')}</span>
                        </label>
                    </div>
                </div>

                {/* Device section */}
                <div>
                    <h1 className="text-sm font-bold mb-4">{t('dashboard.device_lable')}</h1>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="device"
                            value="desktop"
                            checked={device === 'desktop'}
                            onChange={handleDeviceChange}
                            className="form-radio"
                        />
                        <span className="ml-2">{t('dashboard.radio_desktop')}</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="device"
                            value="mobile"
                            checked={device === 'mobile'}
                            onChange={handleDeviceChange}
                            className="form-radio"
                        />
                        <span className="ml-2">{t('dashboard.radio_mobile')}</span>
                    </label>
                </div>

                {/* Categories section */}
                <div>
                    <h1 className="text-sm font-bold mb-4">{t('dashboard.label_categories')}</h1>
                    <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="performance"
                                checked={categories.performance}
                                onChange={handleCategoryChange}
                                className="form-checkbox"
                            />
                            <span className="ml-2">{t('dashboard.radio_performance')}</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="accessibility"
                                checked={categories.accessibility}
                                onChange={handleCategoryChange}
                                className="form-checkbox"
                            />
                            <span className="ml-2">{t('dashboard.radio_accessibility')}</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="bestPractices"
                                checked={categories.bestPractices}
                                onChange={handleCategoryChange}
                                className="form-checkbox"
                            />
                            <span className="ml-2">{t('dashboard.radio_best_paracticies')}</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="seo"
                                checked={categories.seo}
                                onChange={handleCategoryChange}
                                className="form-checkbox"
                            />
                            <span className="ml-2">{t('dashboard.radio_seo')}</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="pwa"
                                checked={categories.pwa}
                                onChange={handleCategoryChange}
                                className="form-checkbox"
                            />
                            <span className="ml-2">{t('dashboard.radio_pwa')}</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
