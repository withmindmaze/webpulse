import type { NextApiRequest, NextApiResponse } from 'next';
import lighthouse, { OutputMode, Config } from 'lighthouse';
import * as ChromeLauncher from 'chrome-launcher';
import nextCors from 'nextjs-cors';
import supabase from '@/utils/supabaseClient';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

async function runLighthouse(url: string, categories: string[], device: string): Promise<any> {
  let chrome;
  try {
    chrome = await ChromeLauncher.launch({
      startingUrl: 'https://google.com',
      chromeFlags: ['--headless','--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage'],
    });

    console.log(`Chrome launched with debugging port: ${chrome.port}`);

    const options = {
      port: chrome.port,
      onlyCategories: categories,
      output: "html" as OutputMode,
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
      } as Config.Settings,
    };

    const runnerResult = await lighthouse(url, options, config);
    console.log(`Chrome ended with debugging port: ${chrome.port}`);
    return runnerResult;
  } catch (err) {
    console.error("Failed to run Lighthouse:", err);
    throw err;
  } finally {
    if (chrome) {
      await chrome.kill();
    }
  }
}

export const config = {
  api: {
    responseLimit: '12mb',
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
    return;
  }

  if (!Array.isArray(params)) {
    return res.status(500).json({ error: 'Function not found' });
  }

  switch (params[0]) {
    case 'audit':
      const { url, categories, device, user_id, generatedBy } = req.body;

      if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'URL is required and must be a string' });
      }

      if (!categories || !Array.isArray(categories)) {
        return res.status(400).json({ error: 'Categories must be an array' });
      }

      if (!device || typeof device !== 'string') {
        return res.status(400).json({ error: 'Device is required and must be a string' });
      }

      const cacheKey = `${url}_${categories.join('_')}_${device}`;
      const cachedResult = cache.get(cacheKey);

      if (cachedResult) {
        return res.status(200).json({ data: cachedResult });
      }

      try {
        const runnerResult = await runLighthouse(url, categories, device);
        const jsonReport = runnerResult?.lhr;

        if (user_id !== undefined) {
          await supabase
            .from('report')
            .insert([{
              user_id,
              json_report: jsonReport,
              url,
              generated_by: generatedBy ? generatedBy : 'user'
            }]);
        }

        cache.set(cacheKey, runnerResult);
        res.status(200).json({ data: runnerResult, jsonReport: jsonReport });
      } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred' });
      }
      break;
    default:
      return res.status(500).json({ error: 'Function not found' });
  }
}
