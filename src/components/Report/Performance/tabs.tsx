//@ts-nocheck
import { useEffect } from "react";

const tabs = [
    { name: 'Diagnostics', id: 1, current: true },
    { name: 'Passed Audits', id: 2, current: false },
];

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ');
}

export default function Tabs({ selectedTab, setSelectedTab, iframeSrc }: any) {

    const manipulateDOM = () => {
        const iframe = document.querySelector('iframe[title="Audit Report"]') as HTMLIFrameElement;
        const doc = iframe.contentDocument;
        const performanceElement = doc?.getElementById('performance') as HTMLElement;
        const accessibilityElement = doc?.getElementById('accessibility') as HTMLElement;
        const seoElement = doc?.getElementById('seo') as HTMLElement;
        const pwaElement = doc?.getElementById('pwa') as HTMLElement;
        if (performanceElement) {
            performanceElement.style.display = 'block';
        }
        if (accessibilityElement) {
            accessibilityElement.style.display = 'none';
        }
        if (seoElement) {
            seoElement.style.display = 'none';
        }
        if (pwaElement) {
            pwaElement.style.display = 'none';
        }
        // Hide specific elements based on the selected tab
        const diagnosticsTable = doc.querySelector('.lh-audit-group.lh-audit-group--diagnostics') as HTMLElement;
        const passedAuditsTable = doc.querySelector('.lh-clump.lh-clump--passed') as HTMLElement;
        if (diagnosticsTable && diagnosticsTable && selectedTab === 1) {
            passedAuditsTable.style.display = 'none';
            diagnosticsTable.style.display = 'block';
        } else if (diagnosticsTable && diagnosticsTable && selectedTab === 2) {
            passedAuditsTable.setAttribute('open', '');
            passedAuditsTable.style.display = 'block';
            diagnosticsTable.style.display = 'none';
        }
    };

    useEffect(() => {
        if (iframeSrc !== '') {
            manipulateDOM();
        }
    }, [selectedTab])

    return (
        <div>
            <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">
                    Select a tab
                </label>
                <select
                    id="tabs"
                    name="tabs"
                    className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    value={selectedTab}
                    onChange={(e) => setSelectedTab(Number(e.target.value))}
                >
                    {tabs.map((tab) => (
                        <option key={tab.id} value={tab.id}>
                            {tab.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="hidden sm:block mt-4">
                <nav className="isolate flex divide-x divide-gray-200 rounded-lg shadow" aria-label="Tabs">
                    {tabs.map((tab, tabIdx) => (
                        <button
                            key={tab.id}
                            onClick={() => setSelectedTab(tab.id)}
                            className={classNames(
                                selectedTab === tab.id ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700',
                                tabIdx === 0 ? 'rounded-l-lg' : '',
                                tabIdx === tabs.length - 1 ? 'rounded-r-lg' : '',
                                'group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10'
                            )}
                            aria-current={selectedTab === tab.id ? 'page' : undefined}
                        >
                            <span>{tab.name}</span>
                            <span
                                aria-hidden="true"
                                className={classNames(
                                    selectedTab === tab.id ? 'bg-indigo-500' : 'bg-transparent',
                                    'absolute inset-x-0 bottom-0 h-0.5'
                                )}
                            />
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
}
