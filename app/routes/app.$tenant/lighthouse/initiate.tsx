export default function InitiateLighHouse({ device, categories, handleDeviceChange, handleCategoryChange }: any) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
            <h1 className="text-xl font-bold mb-4">Generate a Lighthouse report</h1>

            <div className="flex flex-col gap-4 mb-4">
                {/* Mode section */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center">
                            <input type="radio" name="mode" className="form-radio" defaultChecked />
                            <span className="ml-2">Navigation (Default)</span>
                        </label>
                    </div>
                </div>

                {/* Device section */}
                <div>
                    <h1 className="text-sm font-bold mb-4">Device</h1>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="device"
                            value="desktop"
                            defaultChecked={device === 'desktop'}
                            onChange={handleDeviceChange}
                            className="form-radio"
                        />
                        <span className="ml-2">Desktop</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="device"
                            value="mobile"
                            defaultChecked={device === 'mobile'}
                            onChange={handleDeviceChange}
                            className="form-radio"
                        />
                        <span className="ml-2">Mobile</span>
                    </label>
                </div>

                {/* Categories section */}
                <div>
                    <h1 className="text-sm font-bold mb-4">Categories</h1>
                    <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="performance"
                                defaultChecked={categories.performance}
                                onChange={handleCategoryChange}
                                className="form-checkbox"
                            />
                            <span className="ml-2">Performance</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="accessibility"
                                defaultChecked={categories.accessibility}
                                onChange={handleCategoryChange}
                                className="form-checkbox"
                            />
                            <span className="ml-2">Accessibility</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="bestPractices"
                                defaultChecked={categories.bestPractices}
                                onChange={handleCategoryChange}
                                className="form-checkbox"
                            />
                            <span className="ml-2">Best practices</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="seo"
                                defaultChecked={categories.seo}
                                onChange={handleCategoryChange}
                                className="form-checkbox"
                            />
                            <span className="ml-2">SEO</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="pwa"
                                defaultChecked={categories.pwa}
                                onChange={handleCategoryChange}
                                className="form-checkbox"
                            />
                            <span className="ml-2">Progressive Web App</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
