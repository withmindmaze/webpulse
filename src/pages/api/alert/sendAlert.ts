import supabase from '@/utils/supabaseClient';
import * as ChromeLauncher from 'chrome-launcher';
import lighthouse, { Config, OutputMode } from 'lighthouse';
import type { NextApiRequest, NextApiResponse } from 'next';
import nextCors from 'nextjs-cors';

function runLighthouse(url: string, device: string): Promise<any> {
    return ChromeLauncher.launch({
        chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage'],
    })
        .then(chrome => {
            console.log(`Chrome launched with debugging port: ${chrome.port}`);

            const options = {
                port: chrome.port,
                output: "json" as OutputMode,
            };
            const mobileEmulation = {
                mobile: true,
                width: 360,
                height: 640,
                deviceScaleFactor: 2.625,
                disabled: false,
            };
            const desktopEmulation = {
                mobile: false,
                width: 1350,
                height: 940,
                deviceScaleFactor: 1,
                disabled: false,
            };

            const config = {
                extends: 'lighthouse:default',
                settings: {
                    formFactor: device === 'desktop' ? 'desktop' : 'mobile',
                    screenEmulation: device === 'desktop' ? desktopEmulation : mobileEmulation,
                } as Config.Settings
            };

            return lighthouse(url, options, config)
                .then(runnerResult => {
                    chrome.kill();
                    ChromeLauncher.killAll();
                    console.error("Chrome killed successfully");
                    return runnerResult;
                })
                .catch(err => {
                    chrome.kill();
                    ChromeLauncher.killAll();
                    console.error("Chrome killed successfully");
                    console.log({ err: err });
                    throw err;
                }).finally(() => {
                    chrome.kill();
                    ChromeLauncher.killAll();
                    console.error("Chrome killed successfully");
                });
        })
        .catch(err => {
            console.error("Failed to launch Chrome:", err);
            throw err;
        });
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'POST') {
        // Initialize CORS middleware
        await nextCors(req, res, {
            methods: ['POST', 'OPTIONS'],
            origin: '*',
            allowedHeaders: ['Content-Type'],
        });

        const { params } = req.query;

        if (req.method !== 'POST') {
            res.setHeader('Allow', ['POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }

        console.log("🚀 ~ send alert handler ~ req.body:", req.body);

        const { url, device, user_id } = req.body;

        if (!url || typeof url !== 'string') {
            return res.status(400).json({ error: 'URL is required and must be a string' });
        }

        if (!device || typeof device !== 'string') {
            return res.status(400).json({ error: 'Device is required and must be a string' });
        }

        try {
            const runnerResult = await runLighthouse(url, device);
            const jsonReport = runnerResult?.lhr
            const finalResponse = {
                performance: jsonReport.categories.performance.score,
                accessibility: jsonReport.categories.accessibility.score,
                seo: jsonReport.categories.seo.score,
                pwa: jsonReport.categories.pwa.score,
            };
            const reportData = await supabase
                .from('report')
                .insert([{
                    user_id,
                    json_report: jsonReport,
                    url,
                    generated_by: 'system'
                }]);
            console.log(reportData.error);
            res.status(200).json({ data: finalResponse });
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
        }
    }
    else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end('Method Not Allowed');
    }
}

